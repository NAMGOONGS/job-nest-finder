import { useState } from "react";
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Job Board</h1>
            <p className="text-subtitle">
              Explore exciting opportunities at leading companies. Find your perfect role 
              and take the next step in your career journey.
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
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="sf">San Francisco</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="seattle">Seattle</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Salary Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50-80">$50k - $80k</SelectItem>
                  <SelectItem value="80-120">$80k - $120k</SelectItem>
                  <SelectItem value="120-160">$120k - $160k</SelectItem>
                  <SelectItem value="160+">$160k+</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="professional">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredJobs.length} jobs</span>
            <div className="flex items-center space-x-4">
              <span>Sort by:</span>
              <Select defaultValue="recent">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
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
                  {job.remote && <Badge variant="secondary" className="ml-2 text-xs">Remote OK</Badge>}
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium text-primary">{job.salary}</span>
                </div>
                <span>Posted {job.posted}</span>
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
                  <h4 className="font-medium mb-2">Key Requirements</h4>
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
                  <h4 className="font-medium mb-2">Benefits</h4>
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
                  Apply Now
                </Button>
                <Button variant="professional" className="flex-1 sm:flex-none">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="ghost" size="sm">
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="professional" size="lg">
            Load More Jobs
          </Button>
        </div>
      </section>
    </div>
  );
};

export default JobBoard;