import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, MessageSquare, Heart, Pin, TrendingUp, Calendar, Plus } from "lucide-react";
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

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "전체", count: posts.length, icon: MessageSquare },
    { id: "notice", name: "공지사항", count: posts.filter(p => p.category === 'notice').length, icon: Pin },
    { id: "qa", name: "질문&답변", count: posts.filter(p => p.category === 'qa').length, icon: MessageSquare },
    { id: "success_story", name: "성공스토리", count: posts.filter(p => p.category === 'success_story').length, icon: TrendingUp },
    { id: "networking", name: "네트워킹", count: posts.filter(p => p.category === 'networking').length, icon: Users }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "notice": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "qa": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "success_story": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "networking": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "notice": return "공지사항";
      case "qa": return "질문&답변";
      case "success_story": return "성공스토리";
      case "networking": return "네트워킹";
      default: return category;
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">커뮤니티</h1>
          <Link to="/community/write">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              글쓰기
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/community/write">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    새 게시물
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  인기 주제
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">카테고리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <category.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">커뮤니티 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">전체 게시물</span>
                  <span className="font-medium">{posts.length}개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">이번 주 게시물</span>
                  <span className="font-medium">
                    {posts.filter(p => {
                      const postDate = new Date(p.created_at);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return postDate > weekAgo;
                    }).length}개
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">총 좋아요</span>
                  <span className="font-medium">
                    {posts.reduce((sum, post) => sum + post.likes_count, 0)}개
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="게시물, 태그 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Community Posts */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">게시글을 불러오는 중...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">게시글이 없습니다.</p>
                  {user && (
                    <Link to="/community/write">
                      <Button variant="outline" className="mt-4">
                        첫 번째 게시글 작성하기
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>사용자</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {post.is_pinned && (
                                <Pin className="w-4 h-4 text-red-500" />
                              )}
                              <Badge className={getCategoryColor(post.category)}>
                                {getCategoryName(post.category)}
                              </Badge>
                            </div>
                            
                            <Link 
                              to={`/community/${post.id}`}
                              className="block hover:text-primary"
                            >
                              <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                                {post.title}
                              </h3>
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {post.content.substring(0, 150)}...
                              </p>
                            </Link>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{formatTimeAgo(post.created_at)}</span>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Heart className="w-4 h-4" />
                                  <span>{post.likes_count}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{post.replies_count}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Load More Button */}
            {filteredPosts.length > 0 && (
              <div className="text-center">
                <Button variant="outline" size="lg">
                  더 많은 게시물 보기
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;