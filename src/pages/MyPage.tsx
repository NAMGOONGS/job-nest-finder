import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserRole } from '../hooks/useUserRole';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { 
  User, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Plus,
  Edit,
  Eye,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';

interface TalentProfile {
  id: string;
  title: string;
  summary: string;
  skills: string[];
  experience_years: number;
  education?: string;
  location?: string;
  salary_expectation_min?: number;
  salary_expectation_max?: number;
  work_type: string;
  remote_preference: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  likes_count: number;
  replies_count: number;
}

interface TalentApplication {
  id: string;
  company_name: string;
  position: string;
  status: string;
  applied_at: string;
  notes?: string;
}

const MyPage: React.FC = () => {
  const { user } = useAuth();
  const { userRole } = useUserRole();
  const [talentProfile, setTalentProfile] = useState<TalentProfile | null>(null);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // 사용자 대시보드 데이터 조회
      const { data, error } = await supabase.rpc('get_user_dashboard_data', {
        user_id: user?.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const dashboardData = data[0];
        setTalentProfile(dashboardData.talent_profile);
        setApplications(dashboardData.applications || []);
      }

      // 커뮤니티 작성글 조회
      const { data: posts, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setCommunityPosts(posts || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '승인 대기', variant: 'secondary' as const },
      approved: { label: '승인됨', variant: 'default' as const },
      rejected: { label: '거부됨', variant: 'destructive' as const },
      expired: { label: '만료됨', variant: 'outline' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getApplicationStatusBadge = (status: string) => {
    const statusConfig = {
      applied: { label: '지원완료', variant: 'secondary' as const },
      reviewing: { label: '검토중', variant: 'default' as const },
      interviewed: { label: '면접', variant: 'default' as const },
      offered: { label: '제안', variant: 'default' as const },
      rejected: { label: '거절', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
        <p className="text-gray-600">내 정보와 활동 내역을 확인하고 관리하세요</p>
      </div>

      {/* 사용자 정보 카드 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user?.user_metadata?.full_name || user?.email}</CardTitle>
              <p className="text-gray-600">{user?.email}</p>
              <Badge variant="outline" className="mt-2">
                {userRole === 'admin' ? '관리자' : '일반 사용자'}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 인재 프로필 섹션 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>인재 프로필</span>
            </CardTitle>
            <div className="flex space-x-2">
              {!talentProfile ? (
                <Button onClick={() => window.location.href = '/talent/register'}>
                  <Plus className="h-4 w-4 mr-2" />
                  인재 등록
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => window.location.href = '/talent/edit'}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </Button>
                  <Button onClick={() => window.location.href = '/talent/view'}>
                    <Eye className="h-4 w-4 mr-2" />
                    보기
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {talentProfile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{talentProfile.title}</h3>
                {getStatusBadge(talentProfile.status)}
              </div>
              <p className="text-gray-600">{talentProfile.summary}</p>
              
              <div className="flex flex-wrap gap-2">
                {talentProfile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{talentProfile.experience_years}년 경력</span>
                </div>
                {talentProfile.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{talentProfile.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span>{talentProfile.work_type}</span>
                </div>
                {talentProfile.salary_expectation_min && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>{talentProfile.salary_expectation_min.toLocaleString()}원 ~</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">아직 인재 프로필을 등록하지 않았습니다.</p>
              <Button onClick={() => window.location.href = '/talent/register'}>
                <Plus className="h-4 w-4 mr-2" />
                인재 등록하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">지원 현황</TabsTrigger>
          <TabsTrigger value="community">커뮤니티</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        {/* 지원 현황 탭 */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>지원 현황</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{application.position}</h4>
                        {getApplicationStatusBadge(application.status)}
                      </div>
                      <p className="text-gray-600 mb-2">{application.company_name}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>지원일: {formatDate(application.applied_at)}</span>
                        {application.notes && (
                          <span className="text-gray-600">{application.notes}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  아직 지원한 기업이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 커뮤니티 탭 */}
        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>내가 작성한 글</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {communityPosts.length > 0 ? (
                <div className="space-y-4">
                  {communityPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                         onClick={() => window.location.href = `/community/${post.id}`}>
                      <h4 className="font-semibold mb-2">{post.title}</h4>
                      <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(post.created_at)}</span>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.replies_count}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>❤️</span>
                            <span>{post.likes_count}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  아직 작성한 글이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 설정 탭 */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>계정 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  프로필 수정
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  이력서 관리
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  포트폴리오 관리
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyPage;
