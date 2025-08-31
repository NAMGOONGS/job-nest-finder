import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserRole } from '../hooks/useUserRole';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  ArrowLeft, 
  MessageSquare, 
  Heart, 
  Trash2, 
  Edit,
  Image as ImageIcon,
  X
} from 'lucide-react';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  replies_count: number;
  images?: string[];
  user: {
    display_name: string;
    avatar_url?: string;
  };
}

interface Reply {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: {
    display_name: string;
    avatar_url?: string;
  };
}

const CommunityPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRole } = useUserRole();
  
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchReplies();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          user:public_profiles(display_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const { data, error } = await supabase
        .from('community_post_replies')
        .select(`
          *,
          user:public_profiles(display_name, avatar_url)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleSubmitReply = async () => {
    if (!user || !replyContent.trim()) return;

    try {
      setSubmittingReply(true);
      
      const { error } = await supabase
        .from('community_post_replies')
        .insert({
          post_id: id,
          user_id: user.id,
          content: replyContent.trim()
        });

      if (error) throw error;

      setReplyContent('');
      fetchReplies(); // 댓글 목록 새로고침
      
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleEditReply = async (replyId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('community_post_replies')
        .update({ content: editContent.trim() })
        .eq('id', replyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setEditingReply(null);
      setEditContent('');
      fetchReplies();
      
    } catch (error) {
      console.error('Error editing reply:', error);
      alert('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteReply = async (replyId: string, replyUserId: string) => {
    // 댓글 작성자 또는 관리자만 삭제 가능
    if (user?.id !== replyUserId && userRole !== 'admin') {
      alert('삭제 권한이 없습니다.');
      return;
    }

    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('community_post_replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;

      fetchReplies();
      
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 이미 좋아요를 눌렀는지 확인
      const { data: existingLike } = await supabase
        .from('community_post_likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // 좋아요 취소
        await supabase
          .from('community_post_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);
      } else {
        // 좋아요 추가
        await supabase
          .from('community_post_likes')
          .insert({
            post_id: id,
            user_id: user.id
          });
      }

      fetchPost(); // 좋아요 수 새로고침
      
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다</h2>
          <Button onClick={() => navigate('/community')}>
            커뮤니티로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 뒤로가기 버튼 */}
      <Button
        variant="outline"
        onClick={() => navigate('/community')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        커뮤니티로 돌아가기
      </Button>

      {/* 게시글 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.user?.avatar_url} />
                <AvatarFallback>
                  {post.user?.display_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{post.user?.display_name || '익명'}</span>
                  <span>{formatDate(post.created_at)}</span>
                  {post.updated_at !== post.created_at && (
                    <span className="text-gray-500">(수정됨)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* 이미지 표시 */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.images.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`게시글 이미지 ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 좋아요 버튼 */}
          <div className="flex items-center space-x-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className="flex items-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span>{post.likes_count}</span>
            </Button>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MessageSquare className="h-4 w-4" />
              <span>댓글 {replies.length}개</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 작성 */}
      {user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">댓글 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="댓글을 입력하세요..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitReply}
                  disabled={submittingReply || !replyContent.trim()}
                >
                  {submittingReply ? '작성 중...' : '댓글 작성'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 댓글 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">댓글 ({replies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={reply.user?.avatar_url} />
                      <AvatarFallback>
                        {reply.user?.display_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {reply.user?.display_name || '익명'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(reply.created_at)}
                          </span>
                          {reply.updated_at !== reply.created_at && (
                            <span className="text-xs text-gray-400">(수정됨)</span>
                          )}
                        </div>
                        
                        {/* 댓글 작성자 또는 관리자만 수정/삭제 가능 */}
                        {(user?.id === reply.user_id || userRole === 'admin') && (
                          <div className="flex items-center space-x-2">
                            {editingReply === reply.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleEditReply(reply.id)}
                                >
                                  저장
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingReply(null);
                                    setEditContent('');
                                  }}
                                >
                                  취소
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingReply(reply.id);
                                    setEditContent(reply.content);
                                  }}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  수정
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteReply(reply.id, reply.user_id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  삭제
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {editingReply === reply.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={2}
                          />
                        </div>
                      ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityPost;