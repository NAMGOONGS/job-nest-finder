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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Talent Pool</h1>
            <p className="text-subtitle">
              Discover exceptional professionals ready for their next opportunity. 
              Connect with top talent across various industries and skill sets.
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
                placeholder="Search by name, title, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                  <SelectItem value="mid">Mid-level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5+ years)</SelectItem>
                  <SelectItem value="lead">Lead/Principal (8+ years)</SelectItem>
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
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="not-looking">Not Looking</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="professional">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredTalents.length} professionals</span>
            <div className="flex items-center space-x-4">
              <span>Sort by:</span>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
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
                  {talent.availability}
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
                <div className="text-sm font-medium">Core Skills</div>
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
                  View Profile
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="professional" className="flex-1">
                  Send Message
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="professional" size="lg">
            Load More Talent
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TalentPool;