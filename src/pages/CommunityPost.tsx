import { useParams, Link } from "react-router-dom";
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
  User
} from "lucide-react";

const CommunityPost = () => {
  const { id } = useParams();

  // 실제로는 API에서 데이터를 가져와야 하지만, 여기서는 더미 데이터 사용
  const post = {
    id: id,
    title: "구글 취업 성공기 - 엑스퍼트아카데미 추천으로 꿈을 이뤘습니다!",
    category: "success-stories",
    author: "김사라",
    authorAvatar: "KS",
    authorRole: "소프트웨어 엔지니어",
    authorCompany: "Google",
    content: `안녕하세요, 엑스퍼트아카데미 커뮤니티 여러분!

오늘은 제가 어떻게 엑스퍼트아카데미의 추천 시스템을 통해 구글에 입사하게 되었는지 경험을 공유하고자 합니다.

## 시작

저는 3년 차 프론트엔드 개발자로 스타트업에서 일하고 있었습니다. 더 큰 도전과 성장을 위해 이직을 고민하던 중, 엑스퍼트아카데미를 알게 되었습니다.

## 엑스퍼트아카데미와의 만남

처음에는 단순히 채용정보를 확인하기 위해 가입했는데, 여기서 제공하는 추천 시스템이 정말 놀라웠습니다. 

### 주요 장점들:
1. **개인화된 매칭**: 제 스킬과 경험에 맞는 포지션을 정확히 추천해주었습니다
2. **내부 추천**: 실제 구글 직원분이 저를 추천해주셨습니다
3. **면접 준비**: 커뮤니티에서 공유되는 면접 팁들이 정말 도움이 되었습니다

## 면접 과정

구글 면접은 총 4단계였습니다:

1. **전화 스크리닝** (45분)
   - 기본적인 기술 질문과 경험 확인

2. **기술 면접 1차** (1시간)
   - 라이브 코딩과 알고리즘 문제

3. **기술 면접 2차** (1시간)
   - 시스템 디자인과 프로젝트 경험

4. **최종 면접** (45분)
   - 팀 컬처핏과 리더십 경험

각 단계마다 엑스퍼트아카데미 커뮤니티에서 얻은 정보들이 큰 도움이 되었습니다.

## 합격 후

현재 구글에서 일한 지 3개월이 되었는데, 정말 꿈같습니다. 동료들도 훌륭하고, 배울 것이 정말 많습니다.

## 조언

엑스퍼트아카데미를 활용하시는 분들께 드리는 조언:

- **프로필을 꼼꼼히 작성하세요**: 상세할수록 더 정확한 매칭이 가능합니다
- **커뮤니티에 적극 참여하세요**: 정말 많은 인사이트를 얻을 수 있습니다  
- **네트워킹을 소홀히 하지 마세요**: 추천의 힘은 정말 강력합니다

엑스퍼트아카데미 덕분에 꿈을 이룰 수 있었습니다. 감사합니다!

질문이나 궁금한 점이 있으시면 언제든 댓글로 남겨주세요. 최대한 도움을 드리겠습니다! 💪`,
    likes: 342,
    shares: 28,
    timeAgo: "1일 전",
    lastEdited: null,
    isPinned: false,
    tags: ["구글", "성공스토리", "취업", "추천", "면접"],
    replies: [
      {
        id: 1,
        author: "박민수",
        authorAvatar: "PM",
        content: "정말 축하드립니다! 저도 구글 지원을 준비 중인데, 혹시 알고리즘 문제는 어떤 수준이었나요?",
        timeAgo: "23시간 전",
        likes: 12,
        isAuthor: false
      },
      {
        id: 2,
        author: "김사라",
        authorAvatar: "KS",
        content: "감사합니다! 알고리즘은 LeetCode Medium 수준이었어요. 특히 트리와 그래프 문제가 많이 나왔습니다. 꾸준히 연습하시면 충분히 가능하실 거예요!",
        timeAgo: "22시간 전",
        likes: 25,
        isAuthor: true
      },
      {
        id: 3,
        author: "이정훈",
        authorAvatar: "LJ",
        content: "엑스퍼트아카데미에서 추천받으신 건가요? 저도 관심이 있는데 추천 시스템이 어떻게 작동하는지 궁금합니다.",
        timeAgo: "20시간 전",
        likes: 8,
        isAuthor: false
      },
      {
        id: 4,
        author: "김사라",
        authorAvatar: "KS",
        content: "네 맞습니다! 프로필을 등록하면 AI가 스킬과 경험을 분석해서 적합한 포지션을 추천해주고, 해당 회사 직원분들이 직접 추천도 해주시더라고요. 정말 효과적이었습니다!",
        timeAgo: "19시간 전",
        likes: 18,
        isAuthor: true
      },
      {
        id: 5,
        author: "최영희",
        authorAvatar: "CY",
        content: "와 정말 대단하세요! 저도 용기를 내서 도전해봐야겠어요. 혹시 면접 준비는 얼마나 걸리셨나요?",
        timeAgo: "18시간 전",
        likes: 5,
        isAuthor: false
      }
    ]
  };

  const getCategoryInfo = (category: string) => {
    const categories = {
      announcements: { name: "공지사항", color: "bg-blue-100 text-blue-800" },
      qa: { name: "질문 & 답변", color: "bg-green-100 text-green-800" },
      "success-stories": { name: "성공 스토리", color: "bg-purple-100 text-purple-800" },
      networking: { name: "네트워킹", color: "bg-orange-100 text-orange-800" }
    };
    return categories[category as keyof typeof categories] || { name: category, color: "bg-gray-100 text-gray-800" };
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
                          {post.authorAvatar}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{post.author}</span>
                          {post.isPinned && <Pin className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {post.authorRole} at {post.authorCompany}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{post.timeAgo}</span>
                          <Badge className={`text-xs ${categoryInfo.color}`}>
                            {categoryInfo.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
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
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span>{post.replies.length}개 댓글</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Share className="w-5 h-5" />
                      <span>{post.shares}</span>
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
                <CardTitle>댓글 ({post.replies.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Write Comment */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <Textarea 
                        placeholder="댓글을 작성해보세요..." 
                        className="min-h-[80px]"
                      />
                      <div className="flex justify-end">
                        <Button variant="hero" size="sm">
                          <Send className="w-4 h-4 mr-2" />
                          댓글 작성
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comments List */}
                <div className="space-y-6">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium text-xs">
                          {reply.authorAvatar}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{reply.author}</span>
                          {reply.isAuthor && (
                            <Badge variant="secondary" className="text-xs">작성자</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{reply.timeAgo}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {reply.content}
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{reply.likes}</span>
                          </button>
                          <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                            답글
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                      {post.authorAvatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{post.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {post.authorRole}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {post.authorCompany}
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
                  <span className="font-medium">{post.likes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">댓글</span>
                  <span className="font-medium">{post.replies.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">공유</span>
                  <span className="font-medium">{post.shares}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">조회수</span>
                  <span className="font-medium">1,234</span>
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