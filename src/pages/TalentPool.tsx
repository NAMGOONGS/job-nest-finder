import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, Star, ExternalLink, Filter } from "lucide-react";

const TalentPool = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const talents = [
    {
      id: 1,
      name: "Alex Thompson",
      title: "Senior Full-Stack Developer",
      location: "San Francisco, CA",
      experience: "5+ years",
      skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
      bio: "Passionate full-stack developer with expertise in modern web technologies and cloud infrastructure.",
      rating: 4.9,
      availability: "Available",
      avatar: "AT"
    },
    {
      id: 2,
      name: "Sarah Kim",
      title: "UX/UI Designer",
      location: "New York, NY",
      experience: "4+ years",
      skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
      bio: "Creative designer focused on user-centered design and creating intuitive digital experiences.",
      rating: 4.8,
      availability: "Available",
      avatar: "SK"
    },
    {
      id: 3,
      name: "Marcus Rodriguez",
      title: "Data Scientist",
      location: "Seattle, WA",
      experience: "6+ years",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Analytics"],
      bio: "Data scientist with expertise in ML models and statistical analysis for business insights.",
      rating: 5.0,
      availability: "Busy",
      avatar: "MR"
    },
    {
      id: 4,
      name: "Emily Chen",
      title: "Product Manager",
      location: "Austin, TX",
      experience: "7+ years",
      skills: ["Product Strategy", "Agile", "Analytics", "User Research"],
      bio: "Strategic product manager with a track record of launching successful B2B and B2C products.",
      rating: 4.7,
      availability: "Available",
      avatar: "EC"
    },
    {
      id: 5,
      name: "David Wilson",
      title: "DevOps Engineer",
      location: "Remote",
      experience: "5+ years",
      skills: ["Kubernetes", "CI/CD", "AWS", "Terraform", "Monitoring"],
      bio: "DevOps engineer specializing in cloud infrastructure and automated deployment pipelines.",
      rating: 4.9,
      availability: "Available",
      avatar: "DW"
    },
    {
      id: 6,
      name: "Lisa Zhang",
      title: "Mobile Developer",
      location: "Los Angeles, CA",
      experience: "4+ years",
      skills: ["React Native", "iOS", "Android", "Flutter", "Firebase"],
      bio: "Mobile developer with cross-platform expertise and focus on performance optimization.",
      rating: 4.6,
      availability: "Available",
      avatar: "LZ"
    }
  ];

  const filteredTalents = talents.filter(talent =>
    talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    talent.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-secondary border-b border-border">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">인재풀</h1>
            <p className="text-subtitle">
              다음 기회를 기다리는 뛰어난 전문가들을 만나보세요. 
              다양한 산업과 기술 분야의 최고 인재들과 연결하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container-custom">
        <div className="card-professional p-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름, 직책, 또는 기술로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="경력 수준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">주니어 (1-3년)</SelectItem>
                  <SelectItem value="mid">미드레벨 (3-5년)</SelectItem>
                  <SelectItem value="senior">시니어 (5년 이상)</SelectItem>
                  <SelectItem value="lead">리드/프린시펄 (8년 이상)</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">원격근무</SelectItem>
                  <SelectItem value="seoul">서울</SelectItem>
                  <SelectItem value="busan">부산</SelectItem>
                  <SelectItem value="daegu">대구</SelectItem>
                  <SelectItem value="incheon">인천</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="가능 여부" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">가능</SelectItem>
                  <SelectItem value="busy">바쁨</SelectItem>
                  <SelectItem value="not-looking">구직중 아님</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="professional">
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredTalents.length}명의 전문가 표시</span>
            <div className="flex items-center space-x-4">
              <span>정렬:</span>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">관련성</SelectItem>
                  <SelectItem value="rating">평점</SelectItem>
                  <SelectItem value="experience">경력</SelectItem>
                  <SelectItem value="availability">가능 여부</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Talent Grid */}
      <section className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTalents.map((talent) => (
            <div key={talent.id} className="card-professional p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {talent.avatar}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{talent.name}</h3>
                    <p className="text-muted-foreground">{talent.title}</p>
                  </div>
                </div>
                <Badge 
                  variant={talent.availability === "Available" ? "default" : "secondary"}
                  className={talent.availability === "Available" ? "bg-green-100 text-green-800" : ""}
                >
                  {talent.availability === "Available" ? "가능" : talent.availability === "Busy" ? "바쁨" : "구직중 아님"}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{talent.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{talent.experience}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>{talent.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {talent.bio}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <div className="text-sm font-medium">핵심 기술</div>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="hero" className="flex-1">
                  프로필 보기
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="professional" className="flex-1">
                  메시지 보내기
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="professional" size="lg">
            더 많은 인재 보기
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TalentPool;