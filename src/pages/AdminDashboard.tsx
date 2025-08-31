import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, MessageSquare, Briefcase, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  category: string;
  user_id: string;
  created_at: string;
  likes_count: number;
  replies_count: number;
  profiles: Profile;
}

interface UserWithRole {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  role: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalAdmins: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error("관리자 권한이 필요합니다.");
      navigate("/");
      return;
    }

    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, roleLoading, navigate]);

  const fetchAdminData = async () => {
    try {
      setIsLoadingData(true);

      // 사용자 목록 조회
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, display_name, created_at')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        toast.error("사용자 데이터를 불러오는데 실패했습니다.");
      } else {
        // 각 사용자의 역할 정보 조회
        const usersWithRoles = await Promise.all(
          (usersData || []).map(async (user) => {
            const { data: roleData } = await supabase.rpc('get_user_role', {
              _user_id: user.id
            });
            return {
              ...user,
              role: roleData || 'user'
            };
          })
        );
        setUsers(usersWithRoles);
      }

      // 게시글 목록 조회
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('id, title, category, user_id, created_at, likes_count, replies_count')
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        toast.error("게시글 데이터를 불러오는데 실패했습니다.");
      } else {
        // 각 게시글의 작성자 정보 조회
        const postsWithProfiles = await Promise.all(
          (postsData || []).map(async (post) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('id, email, display_name, created_at')
              .eq('id', post.user_id)
              .single();
            
            return {
              ...post,
              profiles: profileData || { id: post.user_id, email: '', display_name: '', created_at: '' }
            };
          })
        );
        setPosts(postsWithProfiles);
      }

      // 통계 계산
      const totalUsers = usersData?.length || 0;
      const totalPosts = postsData?.length || 0;
      const totalAdmins = users.filter(u => u.role === 'admin').length;

      setStats({
        totalUsers,
        totalPosts,
        totalAdmins,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error("데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error);
        toast.error("게시글 삭제에 실패했습니다.");
      } else {
        toast.success("게시글이 삭제되었습니다.");
        fetchAdminData(); // 데이터 새로고침
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error("게시글 삭제에 실패했습니다.");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return '관리자';
      case 'moderator':
        return '운영자';
      default:
        return '일반 사용자';
    }
  };

  if (roleLoading || isLoadingData) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">관리자 대시보드를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">관리자 대시보드</h1>
            <p className="text-muted-foreground">시스템 관리 및 모니터링</p>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">등록된 사용자 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 게시글</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">커뮤니티 게시글 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">관리자 수</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            <p className="text-xs text-muted-foreground">관리자 권한 사용자</p>
          </CardContent>
        </Card>
      </div>

      {/* 사용자 관리 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            사용자 관리
          </CardTitle>
          <CardDescription>등록된 사용자 목록 및 권한 관리</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이메일</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>권한</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.display_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleText(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 게시글 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            게시글 관리
          </CardTitle>
          <CardDescription>최근 게시글 목록 및 관리</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>좋아요</TableHead>
                <TableHead>댓글</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell>{post.profiles?.display_name || post.profiles?.email}</TableCell>
                  <TableCell>{post.likes_count}</TableCell>
                  <TableCell>{post.replies_count}</TableCell>
                  <TableCell>
                    {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/community/${post.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;