import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign,
  Users,
  Calendar,
  Bookmark,
  Share,
  ExternalLink,
  CheckCircle,
  Star,
  Award,
  Heart
} from "lucide-react";

const JobDetail = () => {
  const { id } = useParams();

  // 실제로는 API에서 데이터를 가져와야 하지만, 여기서는 더미 데이터 사용
  const job = {
    id: id,
    title: "시니어 프론트엔드 개발자",
    company: "테크코프",
    companyLogo: "TC",
    location: "서울, 대한민국",
    type: "정규직",
    remote: true,
    salary: "6,000만원 - 9,000만원",
    posted: "2일 전",
    deadline: "2024년 2월 15일",
    applicants: 47,
    views: 234,
    description: "테크코프에서 최신 웹 기술을 활용하여 혁신적인 사용자 경험을 만들어갈 시니어 프론트엔드 개발자를 찾고 있습니다. React, TypeScript, 그리고 현대적인 개발 방법론에 대한 깊은 이해를 바탕으로 팀과 함께 성장할 수 있는 분을 기다립니다.",
    responsibilities: [
      "React 기반 웹 애플리케이션 개발 및 유지보수",
      "TypeScript를 활용한 타입 안전한 코드 작성",
      "컴포넌트 라이브러리 설계 및 구축",
      "성능 최적화 및 사용자 경험 개선",
      "주니어 개발자 멘토링 및 코드 리뷰",
      "제품 팀과의 협업을 통한 기능 기획 및 구현",
      "테스트 코드 작성 및 CI/CD 파이프라인 관리"
    ],
    requirements: [
      "React 5년 이상 실무 경험",
      "TypeScript 숙련도",
      "웹 표준 및 접근성에 대한 이해",
      "Git을 활용한 협업 경험",
      "테스트 프레임워크 사용 경험 (Jest, React Testing Library 등)",
      "웹팩, Vite 등 번들러 사용 경험",
      "Agile/Scrum 개발 프로세스 경험"
    ],
    preferred: [
      "Next.js 사용 경험",
      "GraphQL 사용 경험",
      "모바일 앱 개발 경험 (React Native)",
      "디자인 시스템 구축 경험",
      "AWS 클라우드 서비스 사용 경험",
      "오픈소스 기여 경험",
      "기술 블로그 또는 발표 경험"
    ],
    benefits: [
      "경쟁력 있는 연봉 및 스톡옵션",
      "유연 근무제 (재택근무 50% 이상 가능)",
      "최고 사양 장비 및 개발 환경 제공",
      "교육비 및 컨퍼런스 참가비 지원",
      "건강검진 및 의료비 지원",
      "점심 식대 및 간식 제공",
      "휴가비 지원 (연 100만원)",
      "자기계발 도서비 지원",
      "팀 빌딩 및 워크샵 정기 개최",
      "육아휴직 및 출산 지원금"
    ],
    techStack: ["React", "TypeScript", "Next.js", "GraphQL", "AWS", "Docker", "Jest", "Webpack"],
    companyInfo: {
      name: "테크코프",
      industry: "핀테크",
      size: "100-200명",
      founded: "2018년",
      description: "금융 기술 혁신을 통해 더 나은 금융 서비스를 제공하는 핀테크 스타트업입니다. 사용자 중심의 제품을 만들며 빠르게 성장하고 있습니다.",
      culture: "수평적 조직 문화, 빠른 의사결정, 지속적인 학습과 성장을 추구합니다.",
      website: "https://techcorp.com",
      funding: "Series B 50억원 투자 유치"
    },
    process: [
      {
        step: 1,
        title: "서류 전형",
        description: "이력서 및 포트폴리오 검토",
        duration: "3-5일"
      },
      {
        step: 2,
        title: "1차 면접",
        description: "기술 면접 및 과제 리뷰",
        duration: "1시간"
      },
      {
        step: 3,
        title: "2차 면접",
        description: "팀 컬처핏 및 최종 면접",
        duration: "1시간"
      },
      {
        step: 4,
        title: "최종 결과",
        description: "처우 협의 및 입사 일정 조율",
        duration: "2-3일"
      }
    ],
    relatedJobs: [
      {
        id: 2,
        title: "백엔드 개발자",
        company: "테크코프",
        salary: "5,500만원 - 8,500만원"
      },
      {
        id: 3,
        title: "풀스택 개발자",
        company: "테크코프",
        salary: "6,500만원 - 9,500만원"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary border-b border-border">
        <div className="container-custom py-6">
          <Link to="/jobs">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              채용공고로 돌아가기
            </Button>
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-lg">
                  {job.companyLogo}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <p className="text-xl text-muted-foreground">{job.company}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                    {job.remote && <Badge variant="secondary" className="ml-2 text-xs">원격근무 가능</Badge>}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium text-primary">{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>마감일: {job.deadline}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="hero" size="lg">
                    지원하기
                  </Button>
                  <Button variant="professional" size="lg">
                    <Bookmark className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button variant="ghost" size="lg">
                    <Share className="w-4 h-4 mr-2" />
                    공유
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{job.applicants}명 지원</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <ExternalLink className="w-4 h-4" />
                  <span>{job.views}회 조회</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{job.posted} 게시</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>채용 공고</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>주요 업무</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>필수 요구사항</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Star className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Preferred */}
            <Card>
              <CardHeader>
                <CardTitle>우대사항</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.preferred.map((pref, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{pref}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>복리후생</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Selection Process */}
            <Card>
              <CardHeader>
                <CardTitle>전형 과정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {job.process.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {step.step}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                        <Badge variant="outline" className="text-xs">{step.duration}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 지원</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="hero" className="w-full" size="lg">
                  지금 지원하기
                </Button>
                <Button variant="professional" className="w-full">
                  관심 목록에 추가
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  마감일: {job.deadline}
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card>
              <CardHeader>
                <CardTitle>기술 스택</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>회사 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{job.companyInfo.name}</h3>
                  <p className="text-sm text-muted-foreground">{job.companyInfo.industry}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">규모:</span>
                    <span>{job.companyInfo.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">설립:</span>
                    <span>{job.companyInfo.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">투자:</span>
                    <span>{job.companyInfo.funding}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{job.companyInfo.description}</p>
                
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  회사 웹사이트
                </Button>
              </CardContent>
            </Card>

            {/* Related Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>관련 채용공고</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.relatedJobs.map((relatedJob) => (
                  <Link 
                    key={relatedJob.id} 
                    to={`/jobs/${relatedJob.id}`}
                    className="block p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                  >
                    <h4 className="font-medium">{relatedJob.title}</h4>
                    <p className="text-sm text-muted-foreground">{relatedJob.company}</p>
                    <p className="text-sm text-primary">{relatedJob.salary}</p>
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

export default JobDetail;