import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Building, Clock, DollarSign, Filter, Bookmark, ExternalLink } from "lucide-react";

const JobBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp",
      companyLogo: "TC",
      location: "San Francisco, CA",
      type: "Full-time",
      remote: true,
      salary: "$120k - $180k",
      posted: "2 days ago",
      description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern development practices.",
      requirements: ["5+ years React experience", "TypeScript proficiency", "Experience with testing"],
      benefits: ["Health Insurance", "401k", "Remote Work", "Unlimited PTO"],
      tags: ["React", "TypeScript", "Frontend", "Remote"]
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateLabs",
      companyLogo: "IL",
      location: "New York, NY",
      type: "Full-time",
      remote: false,
      salary: "$140k - $200k",
      posted: "1 day ago",
      description: "Lead product strategy and execution for our B2B SaaS platform, working closely with engineering and design teams.",
      requirements: ["5+ years PM experience", "B2B SaaS background", "Data-driven approach"],
      benefits: ["Equity Package", "Health Benefits", "Professional Development"],
      tags: ["Product Management", "B2B SaaS", "Strategy", "Leadership"]
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "DataDriven Inc",
      companyLogo: "DD",
      location: "Seattle, WA",
      type: "Full-time",
      remote: true,
      salary: "$130k - $190k",
      posted: "3 days ago",
      description: "Apply machine learning and statistical analysis to solve complex business problems and drive data-informed decisions.",
      requirements: ["PhD or Masters in quantitative field", "Python/R expertise", "ML experience"],
      benefits: ["Research Budget", "Conference Attendance", "Flexible Hours"],
      tags: ["Data Science", "Machine Learning", "Python", "Analytics"]
    },
    {
      id: 4,
      title: "UX Designer",
      company: "DesignStudio",
      companyLogo: "DS",
      location: "Austin, TX",
      type: "Full-time",
      remote: true,
      salary: "$85k - $130k",
      posted: "1 week ago",
      description: "Design intuitive user experiences for mobile and web applications, collaborating with product and engineering teams.",
      requirements: ["3+ years UX design", "Figma proficiency", "User research experience"],
      benefits: ["Creative Freedom", "Design Budget", "Work-Life Balance"],
      tags: ["UX Design", "Figma", "User Research", "Mobile"]
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudScale",
      companyLogo: "CS",
      location: "Remote",
      type: "Full-time",
      remote: true,
      salary: "$110k - $160k",
      posted: "5 days ago",
      description: "Build and maintain scalable cloud infrastructure, implement CI/CD pipelines, and ensure system reliability.",
      requirements: ["AWS/GCP experience", "Kubernetes knowledge", "Infrastructure as Code"],
      benefits: ["Home Office Setup", "Certification Support", "Flexible Schedule"],
      tags: ["DevOps", "AWS", "Kubernetes", "CI/CD"]
    },
    {
      id: 6,
      title: "Marketing Manager",
      company: "GrowthCo",
      companyLogo: "GC",
      location: "Los Angeles, CA",
      type: "Full-time",
      remote: false,
      salary: "$90k - $140k",
      posted: "4 days ago",
      description: "Lead digital marketing initiatives, manage campaigns across multiple channels, and drive customer acquisition.",
      requirements: ["4+ years marketing experience", "Digital marketing expertise", "Analytics skills"],
      benefits: ["Marketing Budget", "Team Events", "Growth Opportunities"],
      tags: ["Marketing", "Digital", "Growth", "Analytics"]
    }
  ];

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-secondary border-b border-border">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">채용 공고</h1>
            <p className="text-subtitle">
              선도 기업들의 흥미진진한 기회를 탐색해보세요. 완벽한 역할을 찾고 
              커리어 여정의 다음 단계로 나아가세요.
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
                placeholder="채용공고, 회사명, 또는 기술로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="고용 형태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">정규직</SelectItem>
                  <SelectItem value="part-time">파트타임</SelectItem>
                  <SelectItem value="contract">계약직</SelectItem>
                  <SelectItem value="internship">인턴십</SelectItem>
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
                  <SelectValue placeholder="연봉 범위" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3000-5000">3,000만원 - 5,000만원</SelectItem>
                  <SelectItem value="5000-7000">5,000만원 - 7,000만원</SelectItem>
                  <SelectItem value="7000-10000">7,000만원 - 1억원</SelectItem>
                  <SelectItem value="10000+">1억원 이상</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="professional">
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredJobs.length}개의 채용공고 표시</span>
            <div className="flex items-center space-x-4">
              <span>정렬:</span>
              <Select defaultValue="recent">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">최신순</SelectItem>
                  <SelectItem value="salary">연봉순</SelectItem>
                  <SelectItem value="relevance">관련성</SelectItem>
                  <SelectItem value="company">회사명</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="container-custom">
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="card-professional p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {job.companyLogo}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl hover:text-primary cursor-pointer">
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>

              {/* Job Details */}
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
                <span>{job.posted} 게시</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {job.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Requirements & Benefits Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2">주요 요구사항</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {job.requirements.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">혜택</h4>
                  <div className="flex flex-wrap gap-1">
                    {job.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                <Button variant="hero" className="flex-1 sm:flex-none">
                  지원하기
                </Button>
                <Link to={`/jobs/${job.id}`}>
                  <Button variant="professional" className="flex-1 sm:flex-none">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    상세보기
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  공유
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="professional" size="lg">
            더 많은 채용공고 보기
          </Button>
        </div>
      </section>
    </div>
  );
};

export default JobBoard;