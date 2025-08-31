-- 인재채용 시스템 및 마이페이지 구축
-- 2025-08-25 03:20:00

-- 1. 인재 정보 테이블 생성
CREATE TABLE public.talent_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- 인재 제목 (예: "풀스택 개발자", "UI/UX 디자이너")
  summary TEXT NOT NULL, -- 인재 요약
  skills TEXT[] NOT NULL DEFAULT '{}', -- 기술 스택
  experience_years INTEGER NOT NULL CHECK (experience_years >= 0), -- 경력 연차
  education TEXT, -- 학력
  certifications TEXT[], -- 자격증
  portfolio_url TEXT, -- 포트폴리오 URL
  location TEXT, -- 희망 근무지
  salary_expectation_min INTEGER, -- 희망 연봉 최소
  salary_expectation_max INTEGER, -- 희망 연봉 최대
  work_type TEXT NOT NULL CHECK (work_type IN ('fulltime', 'parttime', 'contract', 'freelance')), -- 근무 형태
  remote_preference TEXT NOT NULL CHECK (remote_preference IN ('onsite', 'hybrid', 'remote')), -- 원격 근무 선호도
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')), -- 승인 상태
  admin_notes TEXT, -- 관리자 메모
  approved_at TIMESTAMP WITH TIME ZONE, -- 승인 일시
  approved_by UUID REFERENCES public.profiles(id), -- 승인자
  expires_at TIMESTAMP WITH TIME ZONE, -- 만료 일시
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. 인재 이력서 테이블 생성
CREATE TABLE public.talent_resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_profile_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  resume_file_url TEXT, -- 이력서 파일 URL
  resume_text TEXT, -- 이력서 텍스트 내용
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. 인재 경력사항 테이블
CREATE TABLE public.talent_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_profile_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE, -- NULL이면 현재 재직중
  description TEXT,
  skills_used TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. 인재 프로젝트 테이블
CREATE TABLE public.talent_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_profile_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_url TEXT,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. 인재 지원 현황 테이블
CREATE TABLE public.talent_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_profile_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  job_posting_id UUID, -- 채용공고 ID (향후 확장용)
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'reviewing', 'interviewed', 'offered', 'rejected')),
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. 마이페이지 설정 테이블
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  profile_visibility TEXT NOT NULL DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'contacts_only')),
  job_alerts BOOLEAN DEFAULT true,
  newsletter_subscription BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. RLS 활성화
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- 8. RLS 정책 생성

-- talent_profiles 정책
CREATE POLICY "Users can view approved talent profiles" 
ON public.talent_profiles 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can manage their own talent profiles" 
ON public.talent_profiles 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all talent profiles" 
ON public.talent_profiles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- talent_resumes 정책
CREATE POLICY "Users can manage their own resumes" 
ON public.talent_resumes 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.talent_profiles WHERE id = talent_profile_id
  )
);

CREATE POLICY "Admins can view all resumes" 
ON public.talent_resumes 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- talent_experiences 정책
CREATE POLICY "Users can manage their own experiences" 
ON public.talent_experiences 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.talent_profiles WHERE id = talent_profile_id
  )
);

CREATE POLICY "Users can view approved experiences" 
ON public.talent_experiences 
FOR SELECT 
USING (
  talent_profile_id IN (
    SELECT id FROM public.talent_profiles WHERE status = 'approved'
  )
);

-- talent_projects 정책
CREATE POLICY "Users can manage their own projects" 
ON public.talent_projects 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.talent_profiles WHERE id = talent_profile_id
  )
);

CREATE POLICY "Users can view approved projects" 
ON public.talent_projects 
FOR SELECT 
USING (
  talent_profile_id IN (
    SELECT id FROM public.talent_profiles WHERE status = 'approved'
  )
);

-- talent_applications 정책
CREATE POLICY "Users can manage their own applications" 
ON public.talent_applications 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.talent_profiles WHERE id = talent_profile_id
  )
);

-- user_preferences 정책
CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- 9. 인덱스 생성 (성능 최적화)
CREATE INDEX idx_talent_profiles_user_id ON public.talent_profiles(user_id);
CREATE INDEX idx_talent_profiles_status ON public.talent_profiles(status);
CREATE INDEX idx_talent_profiles_skills ON public.talent_profiles USING GIN(skills);
CREATE INDEX idx_talent_profiles_experience_years ON public.talent_profiles(experience_years);
CREATE INDEX idx_talent_profiles_work_type ON public.talent_profiles(work_type);
CREATE INDEX idx_talent_profiles_remote_preference ON public.talent_profiles(remote_preference);
CREATE INDEX idx_talent_profiles_created_at ON public.talent_profiles(created_at);

CREATE INDEX idx_talent_experiences_profile_id ON public.talent_experiences(talent_profile_id);
CREATE INDEX idx_talent_projects_profile_id ON public.talent_projects(talent_profile_id);
CREATE INDEX idx_talent_applications_profile_id ON public.talent_applications(talent_profile_id);

-- 10. 관리자 승인 함수 생성
CREATE OR REPLACE FUNCTION public.approve_talent_profile(
  _talent_profile_id UUID,
  _admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _admin_id UUID;
BEGIN
  -- 관리자 권한 확인
  _admin_id := auth.uid();
  
  IF NOT public.has_role(_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  -- 인재 프로필 승인
  UPDATE public.talent_profiles 
  SET 
    status = 'approved',
    admin_notes = COALESCE(_admin_notes, admin_notes),
    approved_at = now(),
    approved_by = _admin_id,
    expires_at = now() + interval '6 months' -- 6개월 유효기간
  WHERE id = _talent_profile_id;
  
  -- 감사 로그 기록
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (_admin_id, 'TALENT_PROFILE_APPROVED', 'talent_profiles', _talent_profile_id, 
          jsonb_build_object('status', 'approved', 'approved_at', now(), 'approved_by', _admin_id));
  
  RETURN TRUE;
END;
$$;

-- 11. 인재 프로필 거부 함수
CREATE OR REPLACE FUNCTION public.reject_talent_profile(
  _talent_profile_id UUID,
  _admin_notes TEXT NOT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _admin_id UUID;
BEGIN
  -- 관리자 권한 확인
  _admin_id := auth.uid();
  
  IF NOT public.has_role(_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  -- 인재 프로필 거부
  UPDATE public.talent_profiles 
  SET 
    status = 'rejected',
    admin_notes = _admin_notes,
    approved_at = NULL,
    approved_by = NULL
  WHERE id = _talent_profile_id;
  
  -- 감사 로그 기록
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (_admin_id, 'TALENT_PROFILE_REJECTED', 'talent_profiles', _talent_profile_id, 
          jsonb_build_object('status', 'rejected', 'admin_notes', _admin_notes));
  
  RETURN TRUE;
END;
$$;

-- 12. 인재 프로필 만료 처리 함수
CREATE OR REPLACE FUNCTION public.expire_talent_profiles()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _expired_count INTEGER;
BEGIN
  -- 만료된 인재 프로필 처리
  UPDATE public.talent_profiles 
  SET status = 'expired'
  WHERE status = 'approved' AND expires_at < now();
  
  GET DIAGNOSTICS _expired_count = ROW_COUNT;
  
  -- 감사 로그 기록
  INSERT INTO public.audit_logs (action, table_name, record_id)
  SELECT 'TALENT_PROFILE_EXPIRED', 'talent_profiles', id
  FROM public.talent_profiles 
  WHERE status = 'expired' AND updated_at = now();
  
  RETURN _expired_count;
END;
$$;

-- 13. 마이페이지 데이터 조회 함수
CREATE OR REPLACE FUNCTION public.get_user_dashboard_data(_user_id UUID)
RETURNS TABLE (
  profile_data JSONB,
  talent_profile JSONB,
  experiences JSONB,
  projects JSONB,
  applications JSONB,
  preferences JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 사용자 본인 또는 관리자만 접근 가능
  IF auth.uid() != _user_id AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN QUERY
  SELECT 
    -- 프로필 정보
    (SELECT to_jsonb(p.*) FROM public.profiles p WHERE p.id = _user_id) as profile_data,
    
    -- 인재 프로필
    (SELECT to_jsonb(tp.*) FROM public.talent_profiles tp WHERE tp.user_id = _user_id ORDER BY tp.created_at DESC LIMIT 1) as talent_profile,
    
    -- 경력사항
    (SELECT jsonb_agg(to_jsonb(te.*)) FROM public.talent_experiences te 
     JOIN public.talent_profiles tp ON te.talent_profile_id = tp.id 
     WHERE tp.user_id = _user_id ORDER BY te.start_date DESC) as experiences,
    
    -- 프로젝트
    (SELECT jsonb_agg(to_jsonb(tp.*)) FROM public.talent_projects tp 
     JOIN public.talent_profiles tprof ON tp.talent_profile_id = tprof.id 
     WHERE tprof.user_id = _user_id ORDER BY tp.start_date DESC) as projects,
    
    -- 지원 현황
    (SELECT jsonb_agg(to_jsonb(ta.*)) FROM public.talent_applications ta 
     JOIN public.talent_profiles tp ON ta.talent_profile_id = tp.id 
     WHERE tp.user_id = _user_id ORDER BY ta.applied_at DESC) as applications,
    
    -- 사용자 설정
    (SELECT to_jsonb(up.*) FROM public.user_preferences up WHERE up.user_id = _user_id) as preferences;
END;
$$;

-- 14. 관리자 대시보드 데이터 조회 함수
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_data()
RETURNS TABLE (
  pending_talents JSONB,
  approved_talents JSONB,
  rejected_talents JSONB,
  expired_talents JSONB,
  stats JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 관리자 권한 확인
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  RETURN QUERY
  SELECT 
    -- 승인 대기 인재
    (SELECT jsonb_agg(
      jsonb_build_object(
        'id', tp.id,
        'user_id', tp.user_id,
        'title', tp.title,
        'summary', tp.summary,
        'skills', tp.skills,
        'experience_years', tp.experience_years,
        'created_at', tp.created_at,
        'user_display_name', pp.display_name
      )
    ) FROM public.talent_profiles tp
    JOIN public.public_profiles pp ON tp.user_id = pp.id
    WHERE tp.status = 'pending'
    ORDER BY tp.created_at ASC) as pending_talents,
    
    -- 승인된 인재
    (SELECT jsonb_agg(
      jsonb_build_object(
        'id', tp.id,
        'user_id', tp.user_id,
        'title', tp.title,
        'summary', tp.summary,
        'skills', tp.skills,
        'approved_at', tp.approved_at,
        'expires_at', tp.expires_at,
        'user_display_name', pp.display_name
      )
    ) FROM public.talent_profiles tp
    JOIN public.public_profiles pp ON tp.user_id = pp.id
    WHERE tp.status = 'approved'
    ORDER BY tp.approved_at DESC) as approved_talents,
    
    -- 거부된 인재
    (SELECT jsonb_agg(
      jsonb_build_object(
        'id', tp.id,
        'user_id', tp.user_id,
        'title', tp.title,
        'admin_notes', tp.admin_notes,
        'created_at', tp.created_at,
        'user_display_name', pp.display_name
      )
    ) FROM public.talent_profiles tp
    JOIN public.public_profiles pp ON tp.user_id = pp.id
    WHERE tp.status = 'rejected'
    ORDER BY tp.created_at DESC) as rejected_talents,
    
    -- 만료된 인재
    (SELECT jsonb_agg(
      jsonb_build_object(
        'id', tp.id,
        'user_id', tp.user_id,
        'title', tp.title,
        'approved_at', tp.approved_at,
        'expires_at', tp.expires_at,
        'user_display_name', pp.display_name
      )
    ) FROM public.talent_profiles tp
    JOIN public.public_profiles pp ON tp.user_id = pp.id
    WHERE tp.status = 'expired'
    ORDER BY tp.expires_at DESC) as expired_talents,
    
    -- 통계 정보
    (SELECT jsonb_build_object(
      'total_talents', COUNT(*),
      'pending_count', COUNT(*) FILTER (WHERE status = 'pending'),
      'approved_count', COUNT(*) FILTER (WHERE status = 'approved'),
      'rejected_count', COUNT(*) FILTER (WHERE status = 'rejected'),
      'expired_count', COUNT(*) FILTER (WHERE status = 'expired'),
      'total_users', (SELECT COUNT(*) FROM public.public_profiles),
      'total_applications', (SELECT COUNT(*) FROM public.talent_applications)
    ) FROM public.talent_profiles) as stats;
END;
$$;

-- 15. 트리거 함수 생성
CREATE OR REPLACE FUNCTION public.update_talent_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 16. 트리거 생성
CREATE TRIGGER update_talent_profiles_updated_at
  BEFORE UPDATE ON public.talent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_talent_profiles_updated_at();

CREATE TRIGGER update_talent_resumes_updated_at
  BEFORE UPDATE ON public.talent_resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_talent_experiences_updated_at
  BEFORE UPDATE ON public.talent_experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_talent_projects_updated_at
  BEFORE UPDATE ON public.talent_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_talent_applications_updated_at
  BEFORE UPDATE ON public.talent_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 17. 자동 만료 처리 스케줄러 (매일 자정 실행)
-- 실제 운영에서는 cron job이나 Supabase Edge Functions 사용 권장
CREATE OR REPLACE FUNCTION public.schedule_talent_profile_expiration()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- 만료된 프로필 처리
  PERFORM public.expire_talent_profiles();
END;
$$;

-- 18. 초기 데이터 삽입 (테스트용)
-- 사용자 설정 기본값 자동 생성 트리거
CREATE OR REPLACE FUNCTION public.create_user_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_preferences();

-- 19. 보안 설정 완료 로그
INSERT INTO public.audit_logs (action, table_name, record_id)
VALUES ('TALENT_RECRUITMENT_SYSTEM_CREATED', 'system', gen_random_uuid());

-- 20. 시스템 생성 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '🎯 TALENT RECRUITMENT SYSTEM CREATED 🎯';
  RAISE NOTICE 'Tables: talent_profiles, talent_resumes, talent_experiences, talent_projects, talent_applications, user_preferences';
  RAISE NOTICE 'Functions: approve_talent_profile, reject_talent_profile, get_user_dashboard_data, get_admin_dashboard_data';
  RAISE NOTICE 'RLS policies applied for all tables';
  RAISE NOTICE 'Admin approval system ready';
END $$;
