import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Share, 
  Clock, 
  Pin,
  Heart,
  Flag,
  MoreHorizontal,
  Send,
  User,
  Edit,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_pinned: boolean;
  likes_count: number;
  replies_count: number;
  created_at: string;
  user_id: string;
}

interface PostAuthor {
  display_name: string | null;
  email: string | null;
}

const CommunityPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [author, setAuthor] = useState<PostAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      
      // 게시글 정보 가져오기
      const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) {
        console.error('Error fetching post:', postError);
        toast.error('게시글을 불러올 수 없습니다.');
        navigate('/community');
        return;
      }

      setPost(postData);

      // 작성자 정보 가져오기
      if (postData.user_id) {
        const { data: authorData, error: authorError } = await supabase
          .from('profiles')
          .select('display_name, email')
          .eq('id', postData.user_id)
          .single();

        if (authorError) {
          console.error('Error fetching author:', authorError);
        } else {
          setAuthor(authorData);
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('게시글을 불러오는 중 오류가 발생했습니다.');
      navigate('/community');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('community_post_replies')
        .select(`
          *,
          profiles:user_id (
            display_name,
            email
          )
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('community_post_replies')
        .insert({
          post_id: id,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) {
        console.error('Error creating comment:', error);
        toast.error('댓글 작성 중 오류가 발생했습니다.');
        return;
      }

      setNewComment("");
      toast.success('댓글이 작성되었습니다.');
      fetchComments();
      fetchPost(); // 댓글 수 업데이트를 위해
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!user || !post || post.user_id !== user.id) return;
    
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        toast.error('게시글 삭제 중 오류가 발생했습니다.');
        return;
      }

      toast.success('게시글이 삭제되었습니다.');
      navigate('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">게시글을 찾을 수 없습니다.</p>
          <Link to="/community">
            <Button>커뮤니티로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryInfo = (category: string) => {
    const categories = {
      notice: { name: "공지사항", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
      qa: { name: "질문&답변", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
      success_story: { name: "성공스토리", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      networking: { name: "네트워킹", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" }
    };
    return categories[category as keyof typeof categories] || { name: category, color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" };
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}일 전`;
    }
  };

  const getAuthorDisplayName = () => {
    return author?.display_name || author?.email || '사용자';
  };

  const getAuthorInitials = () => {
    const name = getAuthorDisplayName();
    return name.length >= 2 ? name.substring(0, 2).toUpperCase() : name.substring(0, 1).toUpperCase();
  };

  const categoryInfo = getCategoryInfo(post.category);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary border-b border-border">
        <div className="container-custom py-6">
          <Link to="/community">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              커뮤니티로 돌아가기
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                {/* Post Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium">
                          {getAuthorInitials()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{getAuthorDisplayName()}</span>
                          {post.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          커뮤니티 멤버
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(post.created_at)}</span>
                          <Badge className={`text-xs ${categoryInfo.color}`}>
                            {categoryInfo.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                     
                    {user && post.user_id === user.id && (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/community/${id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleDeletePost}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Post Content */}
                <div className="prose prose-gray max-w-none mb-8">
                  <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {post.content}
                  </div>
                </div>
                
                {/* Post Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                      <span>{post.likes_count}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span>{post.replies_count}개 댓글</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Share className="w-5 h-5" />
                      <span>공유</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>댓글 ({post.replies_count})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Write Comment */}
                {user && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <Textarea 
                          placeholder="댓글을 작성해보세요..." 
                          className="min-h-[80px]"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="flex justify-end">
                          <Button 
                            variant="hero" 
                            size="sm"
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim() || submittingComment}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {submittingComment ? '작성 중...' : '댓글 작성'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Comments List */}
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3 p-4 rounded-lg bg-secondary/50">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-xs font-medium">
                            {comment.profiles?.display_name?.substring(0, 2).toUpperCase() || 
                             comment.profiles?.email?.substring(0, 2).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">
                                {comment.profiles?.display_name || comment.profiles?.email || '사용자'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(comment.created_at)}
                              </span>
                            </div>
                            {user && comment.user_id === user.id && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={async () => {
                                  if (window.confirm('댓글을 삭제하시겠습니까?')) {
                                    try {
                                      const { error } = await supabase
                                        .from('community_post_replies')
                                        .delete()
                                        .eq('id', comment.id);
                                      
                                      if (error) throw error;
                                      
                                      toast.success('댓글이 삭제되었습니다.');
                                      fetchComments();
                                      fetchPost();
                                    } catch (error) {
                                      console.error('Error deleting comment:', error);
                                      toast.error('댓글 삭제 중 오류가 발생했습니다.');
                                    }
                                  }
                                }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle>작성자 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium">
                      {getAuthorInitials()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{getAuthorDisplayName()}</div>
                    <div className="text-sm text-muted-foreground">
                      커뮤니티 멤버
                    </div>
                  </div>
                </div>
                <Button variant="professional" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  메시지 보내기
                </Button>
              </CardContent>
            </Card>

            {/* Post Stats */}
            <Card>
              <CardHeader>
                <CardTitle>게시물 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">좋아요</span>
                  <span className="font-medium">{post.likes_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">댓글</span>
                  <span className="font-medium">{post.replies_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">조회수</span>
                  <span className="font-medium">-</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card>
              <CardHeader>
                <CardTitle>관련 게시물</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: 2, title: "아마존 면접 후기 공유합니다", category: "success-stories" },
                  { id: 3, title: "시스템 디자인 면접 준비 팁", category: "qa" },
                  { id: 4, title: "개발자 네트워킹 모임 안내", category: "networking" }
                ].map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/community/${relatedPost.id}`}
                    className="block p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                  >
                    <h4 className="font-medium text-sm">{relatedPost.title}</h4>
                    <Badge variant="outline" className="text-xs mt-1">
                      {getCategoryInfo(relatedPost.category).name}
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPost;