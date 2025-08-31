import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Briefcase, 
  ExternalLink,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TalentProfile {
  id: string;
  user_id: string;
  title: string;
  summary: string;
  skills: string[];
  experience_years: number;
  education?: string;
  portfolio_url?: string;
  location?: string;
  work_type: string;
  remote_preference: string;
  created_at: string;
  display_name: string;
  avatar_url?: string;
}

const TalentPool: React.FC = () => {
  const navigate = useNavigate();
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experienceMin, setExperienceMin] = useState<number | null>(null);
  const [experienceMax, setExperienceMax] = useState<number | null>(null);
  const [workType, setWorkType] = useState<string>('');
  const [remotePreference, setRemotePreference] = useState<string>('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      
      // 승인된 인재 프로필만 조회
      const { data, error } = await supabase.rpc('search_talents', {
        _search_term: searchTerm || null,
        _skills: selectedSkills.length > 0 ? selectedSkills : null,
        _experience_min: experienceMin,
        _experience_max: experienceMax,
        _work_type: workType || null,
        _remote_preference: remotePreference || null,
        _location: location || null,
        _limit: 50,
        _offset: 0
      });

      if (error) throw error;
      setTalents(data || []);

    } catch (error) {
      console.error('Error fetching talents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTalents();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setExperienceMin(null);
    setExperienceMax(null);
    setWorkType('');
    setRemotePreference('');
    setLocation('');
    fetchTalents();
  };

  const getWorkTypeLabel = (workType: string) => {
    const labels = {
      fulltime: '정규직',
      parttime: '파트타임',
      contract: '계약직',
      freelance: '프리랜서'
    };
    return labels[workType as keyof typeof labels] || workType;
  };

  const getRemotePreferenceLabel = (preference: string) => {
    const labels = {
      onsite: '사무실 출근',
      hybrid: '하이브리드',
      remote: '원격 근무'
    };
    return labels[preference as keyof typeof labels] || preference;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">인재풀</h1>
        <p className="text-gray-600">우수한 인재들을 찾아보세요</p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>인재 검색</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 검색어 */}
          <div className="flex space-x-2">
            <Input
              placeholder="직무, 기술, 이름으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>

          {/* 필터 옵션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">경력</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="최소"
                  value={experienceMin || ''}
                  onChange={(e) => setExperienceMin(parseInt(e.target.value) || null)}
                />
                <Input
                  type="number"
                  placeholder="최대"
                  value={experienceMax || ''}
                  onChange={(e) => setExperienceMax(parseInt(e.target.value) || null)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">근무 형태</label>
              <Select value={workType} onValueChange={setWorkType}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">전체</SelectItem>
                  <SelectItem value="fulltime">정규직</SelectItem>
                  <SelectItem value="parttime">파트타임</SelectItem>
                  <SelectItem value="contract">계약직</SelectItem>
                  <SelectItem value="freelance">프리랜서</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">원격 근무</label>
              <Select value={remotePreference} onValueChange={setRemotePreference}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">전체</SelectItem>
                  <SelectItem value="onsite">사무실 출근</SelectItem>
                  <SelectItem value="hybrid">하이브리드</SelectItem>
                  <SelectItem value="remote">원격 근무</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">지역</label>
              <Input
                placeholder="지역명"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* 필터 초기화 */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              필터 초기화
            </Button>
            <span className="text-sm text-gray-600">
              총 {talents.length}명의 인재
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 인재 목록 */}
      {talents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent) => (
            <Card key={talent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={talent.avatar_url} />
                      <AvatarFallback>
                        {talent.display_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{talent.title}</CardTitle>
                      <p className="text-sm text-gray-600">{talent.display_name}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/talent/${talent.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    상세보기
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 line-clamp-3">{talent.summary}</p>
                
                {/* 기술 스택 */}
                <div className="flex flex-wrap gap-2">
                  {talent.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {talent.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{talent.skills.length - 5}
                    </Badge>
                  )}
                </div>

                {/* 상세 정보 */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{talent.experience_years}년 경력</span>
                  </div>
                  
                  {talent.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{talent.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{getWorkTypeLabel(talent.work_type)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span>🌐</span>
                    <span>{getRemotePreferenceLabel(talent.remote_preference)}</span>
                  </div>
                </div>

                {/* 포트폴리오 링크 */}
                {talent.portfolio_url && (
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(talent.portfolio_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      포트폴리오 보기
                    </Button>
                  </div>
                )}

                <div className="text-xs text-gray-500 text-right">
                  등록일: {formatDate(talent.created_at)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-4">
              검색 조건을 변경하거나 필터를 초기화해보세요
            </p>
            <Button variant="outline" onClick={clearFilters}>
              필터 초기화
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TalentPool;