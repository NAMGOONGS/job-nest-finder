import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ThumbsUp, Clock, Pin, Plus, Search, TrendingUp, Users, Star } from "lucide-react";

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const posts = [
    {
      id: 1,
      title: "Welcome to TalentConnect Community! 🎉",
      category: "announcements",
      author: "TalentConnect Team",
      authorAvatar: "TC",
      content: "We're excited to launch our new community platform where professionals can connect, share insights, and support each other's career growth.",
      likes: 45,
      replies: 12,
      timeAgo: "2 days ago",
      isPinned: true,
      tags: ["welcome", "community"]
    },
    {
      id: 2,
      title: "How I landed my dream job at Google through TalentConnect",
      category: "success-stories",
      author: "Sarah Kim",
      authorAvatar: "SK",
      content: "Sharing my journey from applying through TalentConnect to getting hired at Google. The referral system really made the difference...",
      likes: 127,
      replies: 23,
      timeAgo: "1 day ago",
      isPinned: false,
      tags: ["google", "success", "referral"]
    },
    {
      id: 3,
      title: "Q: How to negotiate salary in tech interviews?",
      category: "qa",
      author: "Alex Chen",
      authorAvatar: "AC",
      content: "I'm preparing for final round interviews and wondering about best practices for salary negotiation. Any tips from experienced folks?",
      likes: 34,
      replies: 18,
      timeAgo: "3 hours ago",
      isPinned: false,
      tags: ["salary", "negotiation", "interviews"]
    },
    {
      id: 4,
      title: "Monthly Referral Bonus Winners - October 2024",
      category: "announcements",
      author: "TalentConnect Team",
      authorAvatar: "TC",
      content: "Congratulations to our top referrers this month! Thank you for helping build our amazing talent community.",
      likes: 89,
      replies: 31,
      timeAgo: "1 week ago",
      isPinned: false,
      tags: ["referral", "bonus", "winners"]
    },
    {
      id: 5,
      title: "Best practices for remote work productivity",
      category: "qa",
      author: "Marcus Johnson",
      authorAvatar: "MJ",
      content: "As someone who's been working remotely for 3+ years, here are my top tips for staying productive and maintaining work-life balance...",
      likes: 76,
      replies: 15,
      timeAgo: "2 days ago",
      isPinned: false,
      tags: ["remote", "productivity", "tips"]
    },
    {
      id: 6,
      title: "From bootcamp to senior developer in 2 years",
      category: "success-stories",
      author: "Emily Rodriguez",
      authorAvatar: "ER",
      content: "My journey from career changer to senior developer. Sharing resources, challenges, and milestones that helped me along the way.",
      likes: 203,
      replies: 45,
      timeAgo: "3 days ago",
      isPinned: false,
      tags: ["bootcamp", "career-change", "development"]
    }
  ];

  const categories = [
    { id: "all", name: "All Posts", count: posts.length, icon: MessageSquare },
    { id: "announcements", name: "Announcements", count: 12, icon: Pin },
    { id: "qa", name: "Q&A", count: 34, icon: MessageSquare },
    { id: "success-stories", name: "Success Stories", count: 28, icon: Star },
    { id: "networking", name: "Networking", count: 19, icon: Users }
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      announcements: "bg-blue-100 text-blue-800",
      qa: "bg-green-100 text-green-800",
      "success-stories": "bg-purple-100 text-purple-800",
      networking: "bg-orange-100 text-orange-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-secondary border-b border-border">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Community</h1>
            <p className="text-subtitle">
              Connect with fellow professionals, share experiences, ask questions, 
              and celebrate career successes together.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="card-professional p-6 space-y-4">
              <h3 className="font-semibold">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="hero" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
                <Button variant="professional" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending Topics
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="card-professional p-6 space-y-4">
              <h3 className="font-semibold">Categories</h3>
              <div className="space-y-2">
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
              </div>
            </div>

            {/* Community Stats */}
            <div className="card-professional p-6 space-y-4">
              <h3 className="font-semibold">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Members</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Posts This Week</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Today</span>
                  <span className="font-medium">342</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <div className="card-professional p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="card-professional p-6 space-y-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium text-sm">
                          {post.authorAvatar}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{post.author}</span>
                          {post.isPinned && <Pin className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{post.timeAgo}</span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getCategoryColor(post.category)}`}
                          >
                            {post.category.replace("-", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.replies} replies</span>
                      </button>
                    </div>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="professional" size="lg">
                Load More Posts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;