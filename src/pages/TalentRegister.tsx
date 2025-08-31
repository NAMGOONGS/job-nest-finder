import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { X, Upload, FileText, Briefcase, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TalentFormData {
  title: string;
  summary: string;
  skills: string[];
  experience_years: number;
  education: string;
  certifications: string[];
  portfolio_url: string;
  location: string;
  salary_expectation_min: number;
  salary_expectation_max: number;
  work_type: string;
  remote_preference: string;
}

const TalentRegister: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentCertification, setCurrentCertification] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');

  const [formData, setFormData] = useState<TalentFormData>({
    title: '',
    summary: '',
    skills: [],
    experience_years: 0,
    education: '',
    certifications: [],
    portfolio_url: '',
    location: '',
    salary_expectation_min: 0,
    salary_expectation_max: 0,
    work_type: 'fulltime',
    remote_preference: 'hybrid'
  });

  const handleInputChange = (field: keyof TalentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    if (currentCertification.trim() && !formData.certifications.includes(currentCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, currentCertification.trim()]
      }));
      setCurrentCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleFileUpload = (file: File, type: 'resume' | 'portfolio') => {
    if (type === 'resume') {
      setResumeFile(file);
    } else {
      setPortfolioFile(file);
    }
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${bucket}/${fileName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('File upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (formData.skills.length === 0) {
      alert('최소 하나의 기술 스택을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      // 1. 인재 프로필 생성
      const { data: profileData, error: profileError } = await supabase.rpc('create_talent_profile', {
        title: formData.title,
        summary: formData.summary,
        skills: formData.skills,
        experience_years: formData.experience_years,
        education: formData.education || null,
        certifications: formData.certifications.length > 0 ? formData.certifications : null,
        portfolio_url: formData.portfolio_url || null,
        location: formData.location || null,
        salary_expectation_min: formData.salary_expectation_min || null,
        salary_expectation_max: formData.salary_expectation_max || null,
        work_type: formData.work_type,
        remote_preference: formData.remote_preference
      });

      if (profileError) throw profileError;

      const talentProfileId = profileData;

      // 2. 이력서 파일 업로드
      if (resumeFile) {
        const resumeUrl = await uploadFile(resumeFile, 'resumes');
        if (resumeUrl) {
          await supabase.from('talent_resumes').insert({
            talent_profile_id: talentProfileId,
            resume_file_url: resumeUrl,
            resume_text: resumeText
          });
        }
      }

      // 3. 포트폴리오 파일 업로드
      if (portfolioFile) {
        const portfolioUrl = await uploadFile(portfolioFile, 'portfolios');
        if (portfolioUrl) {
          // 포트폴리오 URL을 프로필에 업데이트
          await supabase.from('talent_profiles')
            .update({ portfolio_url: portfolioUrl })
            .eq('id', talentProfileId);
        }
      }

      alert('인재 프로필이 성공적으로 등록되었습니다. 관리자 승인 후 공개됩니다.');
      navigate('/mypage');

    } catch (error) {
      console.error('Error creating talent profile:', error);
      alert('인재 프로필 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">인재 등록</h1>
        <p className="text-gray-600">자신의 기술과 경험을 소개하고 새로운 기회를 찾아보세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>기본 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">직무 제목 *</Label>
                <Input
                  id="title"
                  placeholder="예: 풀스택 개발자, UI/UX 디자이너"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="experience_years">경력 연차 *</Label>
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.experience_years}
                  onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="summary">자기소개 *</Label>
              <Textarea
                id="summary"
                placeholder="자신의 기술과 경험을 간단히 소개해주세요"
                rows={4}
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>기술 스택 *</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="기술명을 입력하세요"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 학력 및 자격증 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>학력 및 자격증</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="education">학력</Label>
              <Input
                id="education"
                placeholder="예: 컴퓨터공학 학사"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
              />
            </div>

            <div>
              <Label>자격증</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="자격증명을 입력하세요"
                  value={currentCertification}
                  onChange={(e) => setCurrentCertification(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                />
                <Button type="button" onClick={addCertification} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(cert)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 근무 조건 */}
        <Card>
          <CardHeader>
            <CardTitle>근무 조건</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="work_type">근무 형태 *</Label>
                <Select value={formData.work_type} onValueChange={(value) => handleInputChange('work_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fulltime">정규직</SelectItem>
                    <SelectItem value="parttime">파트타임</SelectItem>
                    <SelectItem value="contract">계약직</SelectItem>
                    <SelectItem value="freelance">프리랜서</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="remote_preference">원격 근무 선호도 *</Label>
                <Select value={formData.remote_preference} onValueChange={(value) => handleInputChange('remote_preference', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">사무실 출근</SelectItem>
                    <SelectItem value="hybrid">하이브리드</SelectItem>
                    <SelectItem value="remote">원격 근무</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="location">희망 근무지</Label>
                <Input
                  id="location"
                  placeholder="예: 서울시 강남구"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="salary_min">희망 연봉 최소</Label>
                <Input
                  id="salary_min"
                  type="number"
                  placeholder="30000000"
                  value={formData.salary_expectation_min || ''}
                  onChange={(e) => handleInputChange('salary_expectation_min', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="salary_max">희망 연봉 최대</Label>
                <Input
                  id="salary_max"
                  type="number"
                  placeholder="50000000"
                  value={formData.salary_expectation_max || ''}
                  onChange={(e) => handleInputChange('salary_expectation_max', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 파일 업로드 */}
        <Card>
          <CardHeader>
            <CardTitle>파일 업로드</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="resume">이력서 파일</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
                <Button type="button" variant="outline" onClick={() => setResumeFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">PDF, DOC, DOCX 파일만 업로드 가능합니다.</p>
            </div>

            <div>
              <Label htmlFor="resume_text">이력서 내용 (텍스트)</Label>
              <Textarea
                id="resume_text"
                placeholder="이력서 내용을 텍스트로 입력하거나 파일을 업로드하세요"
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="portfolio">포트폴리오 파일</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  id="portfolio"
                  type="file"
                  accept=".pdf,.zip,.rar"
                  onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)}
                />
                <Button type="button" variant="outline" onClick={() => setPortfolioFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">PDF, ZIP, RAR 파일만 업로드 가능합니다.</p>
            </div>

            <div>
              <Label htmlFor="portfolio_url">포트폴리오 URL</Label>
              <Input
                id="portfolio_url"
                type="url"
                placeholder="https://github.com/username/portfolio"
                value={formData.portfolio_url}
                onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/mypage')}>
            취소
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? '등록 중...' : '인재 등록하기'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TalentRegister;
