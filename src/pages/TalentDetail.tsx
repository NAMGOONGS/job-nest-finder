import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  Mail, 
  Phone, 
  Linkedin, 
  Globe,
  Award,
  Briefcase,
  GraduationCap,
  Calendar,
  Users,
  MessageSquare
} from "lucide-react";

const TalentDetail = () => {
  const { id } = useParams();

  // 실제로는 API에서 데이터를 가져와야 하지만, 여기서는 더미 데이터 사용
  const talent = {
    id: id,
    name: "김민수",
    title: "시니어 풀스택 개발자",
    location: "서울, 대한민국",
    experience: "6년",
    avatar: "KMS",
    rating: 4.9,
    availability: "Available",
    email: "minsu.kim@example.com",
    phone: "+82-10-1234-5678",
    linkedin: "linkedin.com/in/minsukim",
    website: "minsukim.dev",
    bio: "풀스택 개발에 대한 열정을 가진 시니어 개발자입니다. 현대적인 웹 기술과 클라우드 인프라에 대한 전문 지식을 바탕으로 확장 가능한 애플리케이션을 구축합니다. 팀 리더십과 멘토링 경험이 풍부합니다.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "GraphQL", "Next.js"],
    languages: ["한국어 (원어민)", "영어 (유창)", "일본어 (기초)"],
    workExperience: [
      {
        company: "네이버",
        position: "시니어 풀스택 개발자",
        duration: "2021 - 현재",
        description: "대규모 웹 애플리케이션 개발 및 팀 리드 담당. 마이크로서비스 아키텍처 설계 및 구현."
      },
      {
        company: "카카오",
        position: "풀스택 개발자",
        duration: "2019 - 2021",
        description: "모바일 앱 백엔드 API 개발 및 웹 대시보드 구축. React와 Node.js 기반 시스템 개발."
      },
      {
        company: "스타트업 ABC",
        position: "주니어 개발자",
        duration: "2018 - 2019",
        description: "웹 애플리케이션 개발 및 데이터베이스 설계. 초기 스타트업에서 다양한 기술 스택 경험."
      }
    ],
    education: [
      {
        school: "한국대학교",
        degree: "컴퓨터공학과 학사",
        duration: "2014 - 2018",
        description: "컴퓨터 사이언스 기초부터 고급 알고리즘까지 체계적으로 학습"
      }
    ],
    projects: [
      {
        name: "이커머스 플랫폼",
        description: "React, Node.js, AWS를 사용한 대규모 이커머스 플랫폼 개발",
        technologies: ["React", "Node.js", "AWS", "PostgreSQL"],
        link: "https://github.com/minsukim/ecommerce"
      },
      {
        name: "실시간 채팅 앱",
        description: "WebSocket과 Redis를 활용한 실시간 채팅 애플리케이션",
        technologies: ["Next.js", "Socket.io", "Redis", "MongoDB"],
        link: "https://github.com/minsukim/chat-app"
      }
    ],
    certifications: [
      "AWS Solutions Architect Professional",
      "Certified Kubernetes Administrator",
      "Google Cloud Professional Developer"
    ],
    recommendations: [
      {
        name: "박영희",
        position: "테크 리드 at 네이버",
        comment: "민수님은 뛰어난 기술적 역량과 팀워크를 겸비한 개발자입니다. 복잡한 문제 해결 능력이 특히 인상적입니다."
      },
      {
        name: "이철수",
        position: "CTO at 카카오",
        comment: "항상 새로운 기술에 대한 열정을 가지고 있으며, 팀원들에게 좋은 영향을 주는 개발자입니다."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary border-b border-border">
        <div className="container-custom py-6">
          <Link to="/talent">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              인재풀로 돌아가기
            </Button>
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Header */}
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">
                  {talent.avatar}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{talent.name}</h1>
                  <p className="text-xl text-muted-foreground">{talent.title}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{talent.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{talent.experience} 경력</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>{talent.rating}</span>
                  </div>
                  <Badge 
                    variant={talent.availability === "Available" ? "default" : "secondary"}
                    className={talent.availability === "Available" ? "bg-green-100 text-green-800" : ""}
                  >
                    {talent.availability === "Available" ? "구직중" : "구직중 아님"}
                  </Badge>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="hero">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    메시지 보내기
                  </Button>
                  <Button variant="professional">
                    <Users className="w-4 h-4 mr-2" />
                    팀에 추가
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>소개</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{talent.bio}</p>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>경력</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {talent.workExperience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{exp.position}</h3>
                      <Badge variant="outline">{exp.duration}</Badge>
                    </div>
                    <p className="font-medium text-primary">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>학력</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {talent.education.map((edu, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <Badge variant="outline">{edu.duration}</Badge>
                    </div>
                    <p className="font-medium text-primary">{edu.school}</p>
                    <p className="text-sm text-muted-foreground">{edu.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle>주요 프로젝트</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {talent.projects.map((project, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                      프로젝트 보기 →
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>추천사</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {talent.recommendations.map((rec, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium text-sm">
                          {rec.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{rec.name}</p>
                        <p className="text-sm text-muted-foreground">{rec.position}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{rec.comment}"</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>연락처</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{talent.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{talent.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{talent.linkedin}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{talent.website}</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>기술 스택</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>언어</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {talent.languages.map((language, index) => (
                  <p key={index} className="text-sm">{language}</p>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>자격증</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {talent.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Award className="w-3 h-3 text-primary" />
                    <span className="text-sm">{cert}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDetail;