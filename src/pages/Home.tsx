import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, ArrowRight, Star, Briefcase, Building, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const services = [
    {
      icon: Users,
      title: "인재 매칭",
      description: "AI 기반 매칭 시스템으로 최적의 인재와 기회를 연결합니다.",
      features: ["스마트 알고리즘", "스킬 평가", "문화 적합성"]
    },
    {
      icon: Target,
      title: "추천 채용",
      description: "네트워크를 활용하여 우수한 인재를 추천받는 프로그램입니다.",
      features: ["추천 보너스", "검증된 인재", "빠른 채용"]
    },
    {
      icon: Award,
      title: "커리어 성장",
      description: "전문가를 위한 커리어 발전과 성장 기회를 제공합니다.",
      features: ["멘토링", "스킬 개발", "커리어 플래닝"]
    }
  ];

  const featuredJobs = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $180k",
      tags: ["React", "TypeScript", "Remote OK"]
    },
    {
      title: "Product Manager",
      company: "InnovateLabs",
      location: "New York, NY",
      type: "Full-time",
      salary: "$140k - $200k",
      tags: ["B2B SaaS", "Growth", "Strategy"]
    },
    {
      title: "Data Scientist",
      company: "DataDriven",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$130k - $190k",
      tags: ["Python", "ML", "Analytics"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content: "TalentConnect helped me find my dream job at Google. The matching process was seamless and the support was exceptional.",
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "Hiring Manager",
      company: "Stripe",
      content: "We've hired 15+ exceptional engineers through TalentConnect. The quality of candidates is consistently outstanding.",
      avatar: "MJ"
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager",
      company: "Airbnb",
      content: "The referral program connected me with opportunities I never would have found otherwise. Highly recommend!",
      avatar: "ER"
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground">
        <div className="container-custom py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="bg-primary-light text-primary mb-4">
              🚀 지금 바로 기업을 위한 인재를 추천받아 보세요!
            </Badge>
            <h1 className="text-hero">
              전문가와 기업을 연결하는 
              <span className="block">최고의 플랫폼</span>
            </h1>
            <p className="text-subtitle max-w-2xl mx-auto">
              엑스퍼트아카데미에서 당신의 커리어를 한 단계 업그레이드하세요. 
              최고의 인재와 기업이 만나는 공간입니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Users className="w-5 h-5 mr-2" />
                인재 찾기
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Briefcase className="w-5 h-5 mr-2" />
                취업처 찾기
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm opacity-90">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>500+ 협업기업</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>10,000+ 전문가</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>95% 매칭 성공률</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">전문 서비스</h2>
            <p className="text-subtitle max-w-2xl mx-auto">
              엑스퍼트아카데미가 제공하는 차별화된 서비스를 경험해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card-professional p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {service.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="professional" className="w-full">
                  자세히 보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-secondary">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">추천 채용 공고</h2>
              <p className="text-muted-foreground">최고의 기업들과 함께할 다음 커리어를 찾아보세요</p>
            </div>
            <Link to="/jobs">
              <Button variant="professional">
                모든 채용공고 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <div key={index} className="card-professional p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <Badge variant="outline">{job.type}</Badge>
                  <span className="font-medium text-primary">{job.salary}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button variant="professional" className="w-full">
                  지원하기
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">성공 스토리</h2>
            <p className="text-subtitle max-w-2xl mx-auto">
              엑스퍼트아카데미가 어떻게 커리어와 기업을 변화시켰는지 확인해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-professional p-6 space-y-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">다음 단계로 나아갈 준비가 되셨나요?</h2>
            <p className="text-subtitle">
              엑스퍼트아카데미를 통해 완벽한 매칭을 찾은 수천 명의 전문가들과 함께하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/talent">
                <Button variant="hero" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  전문가로 참여하기
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="professional" size="lg">
                  <Building className="w-5 h-5 mr-2" />
                  채용공고 등록
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
