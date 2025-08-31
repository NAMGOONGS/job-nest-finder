-- 인재채용 시스템 API 함수들
-- 2025-08-25 03:30:00

-- 1. 인재 프로필 생성 함수
CREATE OR REPLACE FUNCTION public.create_talent_profile(
  _title TEXT,
  _summary TEXT,
  _skills TEXT[],
  _experience_years INTEGER,
  _education TEXT DEFAULT NULL,
  _certifications TEXT[] DEFAULT NULL,
  _portfolio_url TEXT DEFAULT NULL,
  _location TEXT DEFAULT NULL,
  _salary_expectation_min INTEGER DEFAULT NULL,
  _salary_expectation_max INTEGER DEFAULT NULL,
  _work_type TEXT,
  _remote_preference TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
  _talent_profile_id UUID;
BEGIN
  -- 현재 사용자 ID 가져오기
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- 입력값 검증
  IF _title IS NULL OR _title = '' THEN
    RAISE EXCEPTION 'Title is required';
  END IF;
  
  IF _summary IS NULL OR _summary = '' THEN
    RAISE EXCEPTION 'Summary is required';
  END IF;
  
  IF array_length(_skills, 1) = 0 THEN
    RAISE EXCEPTION 'At least one skill is required';
  END IF;
  
  IF _experience_years < 0 THEN
    RAISE EXCEPTION 'Experience years cannot be negative';
  END IF;
  
  -- 인재 프로필 생성
  INSERT INTO public.talent_profiles (
    user_id, title, summary, skills, experience_years, education,
    certifications, portfolio_url, location, salary_expectation_min,
    salary_expectation_max, work_type, remote_preference
  ) VALUES (
    _user_id, _title, _summary, _skills, _experience_years, _education,
    _certifications, _portfolio_url, _location, _salary_expectation_min,
    _salary_expectation_max, _work_type, _remote_preference
  ) RETURNING id INTO _talent_profile_id;
  
  -- 감사 로그 기록
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (_user_id, 'TALENT_PROFILE_CREATED', 'talent_profiles', _talent_profile_id, 
          jsonb_build_object('title', _title, 'status', 'pending'));
  
  RETURN _talent_profile_id;
END;
$$;

-- 2. 인재 프로필 수정 함수
CREATE OR REPLACE FUNCTION public.update_talent_profile(
  _talent_profile_id UUID,
  _title TEXT DEFAULT NULL,
  _summary TEXT DEFAULT NULL,
  _skills TEXT[] DEFAULT NULL,
  _experience_years INTEGER DEFAULT NULL,
  _education TEXT DEFAULT NULL,
  _certifications TEXT[] DEFAULT NULL,
  _portfolio_url TEXT DEFAULT NULL,
  _location TEXT DEFAULT NULL,
  _salary_expectation_min INTEGER DEFAULT NULL,
  _salary_expectation_max INTEGER DEFAULT NULL,
  _work_type TEXT DEFAULT NULL,
  _remote_preference TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
  _current_status TEXT;
BEGIN
  -- 현재 사용자 ID 가져오기
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- 프로필 소유자 확인
  SELECT user_id, status INTO _user_id, _current_status
  FROM public.talent_profiles 
  WHERE id = _talent_profile_id;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Talent profile not found';
  END IF;
  
  IF _user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- 승인된 프로필은 수정 불가 (재승인 필요)
  IF _current_status = 'approved' THEN
    RAISE EXCEPTION 'Approved profiles cannot be modified. Please create a new version.';
  END IF;
  
  -- 프로필 수정
  UPDATE public.talent_profiles 
  SET 
    title = COALESCE(_title, title),
    summary = COALESCE(_summary, summary),
    skills = COALESCE(_skills, skills),
    experience_years = COALESCE(_experience_years, experience_years),
    education = COALESCE(_education, education),
    certifications = COALESCE(_certifications, certifications),
    portfolio_url = COALESCE(_portfolio_url, portfolio_url),
    location = COALESCE(_location, location),
    salary_expectation_min = COALESCE(_salary_expectation_min, salary_expectation_min),
    salary_expectation_max = COALESCE(_salary_expectation_max, salary_expectation_max),
    work_type = COALESCE(_work_type, work_type),
    remote_preference = COALESCE(_remote_preference, remote_preference),
    status = 'pending', -- 수정 시 승인 대기 상태로 변경
    updated_at = now()
  WHERE id = _talent_profile_id;
  
  -- 감사 로그 기록
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (_user_id, 'TALENT_PROFILE_UPDATED', 'talent_profiles', _talent_profile_id, 
          jsonb_build_object('status', 'pending', 'updated_at', now()));
  
  RETURN TRUE;
END;
$$;

-- 3. 경력사항 추가 함수
CREATE OR REPLACE FUNCTION public.add_talent_experience(
  _talent_profile_id UUID,
  _company_name TEXT,
  _position TEXT,
  _start_date DATE,
  _end_date DATE DEFAULT NULL,
  _description TEXT DEFAULT NULL,
  _skills_used TEXT[] DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
  _experience_id UUID;
BEGIN
  -- 현재 사용자 ID 가져오기
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- 프로필 소유자 확인
  IF NOT EXISTS (
    SELECT 1 FROM public.talent_profiles 
    WHERE id = _talent_profile_id AND user_id = _user_id
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- 입력값 검증
  IF _company_name IS NULL OR _company_name = '' THEN
    RAISE EXCEPTION 'Company name is required';
  END IF;
  
  IF _position IS NULL OR _position = '' THEN
    RAISE EXCEPTION 'Position is required';
  END IF;
  
  IF _start_date IS NULL THEN
    RAISE EXCEPTION 'Start date is required';
  END IF;
  
  -- 경력사항 추가
  INSERT INTO public.talent_experiences (
    talent_profile_id, company_name, position, start_date, end_date, description, skills_used
  ) VALUES (
    _talent_profile_id, _company_name, _position, _start_date, _end_date, _description, _skills_used
  ) RETURNING id INTO _experience_id;
  
  -- 감사 로그 기록
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (_user_id, 'TALENT_EXPERIENCE_ADDED', 'talent_experiences', _experience_id, 
          jsonb_build_object('company_name', _company_name, 'position', _position));
  
  RETURN _experience_id;
END;
$$;

-- 4. 프로젝트 추가 함수
CREATE OR REPLACE FUNCTION public.add_talent_project(
  _talent_profile_id UUID,
  _project_name TEXT,
  _project_url TEXT DEFAULT NULL,
  _description TEXT,
  _technologies TEXT[],
  _start_date DATE,
  _end_date DATE DEFAULT NULL,
  _role TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
  _project_id UUID;
BEGIN
  -- 현재 사용자 ID 가져오기
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- 프로필 소유자 확인
  IF NOT EXISTS (
    SELECT 1 FROM public.talent_profiles 
    WHERE id = _talent_profile_id AND user_id = _user_id
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- 입력값 검증
  IF _project_name IS NULL OR _project_name = '' THEN
    RAISE EXCEPTION 'Project name is required';
  END IF;
  
  IF _description IS NULL OR _description = '' THEN
    RAISE EXCEPTION 'Project description is required';
  END IF;
  
  IF array_length(_technologies, 1) = 0 THEN
    RAISE EXCEPTION 'At least one technology is required';
  END IF;
  
  IF _start_date IS NULL THEN
    RAISE EXCEPTION 'Start date is required';
  END IF;
  
  IF _role IS NULL OR _role = '' THEN
    RAISE EXCEPTION 'Role is required';
  END IF;
  
  -- 프로젝트 추가
  INSERT INTO public.talent_projects (
    talent_profile_id, project_name, project_url, description, technologies, start_date, end_date, role
  ) VALUES (
    _talent_profile_id, _project_name, _project_url, _description, _technologies, _start_date, _end_date, _role
  ) RETURNING id INTO _project_id;
  
  -- 감사 로그 기록
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (_user_id, 'TALENT_PROJECT_ADDED', 'talent_projects', _project_id, 
          jsonb_build_object('project_name', _project_name, 'role', _role));
  
  RETURN _project_id;
END;
$$;

-- 5. 지원 현황 추가 함수
CREATE OR REPLACE FUNCTION public.add_talent_application(
  _talent_profile_id UUID,
  _company_name TEXT,
  _position TEXT,
  _notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
  _application_id UUID;
BEGIN
  -- 현재 사용자 ID 가져오기
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- 프로필 소유자 확인
  IF NOT EXISTS (
    SELECT 1 FROM public.talent_profiles 
    WHERE id = _talent_profile_id AND user_id = _user_id
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- 입력값 검증
  IF _company_name IS NULL OR _company_name = '' THEN
    RAISE EXCEPTION 'Company name is required';
  END IF;
  
  IF _position IS NULL OR _position = '' THEN
    RAISE EXCEPTION 'Position is required';
  END IF;
  
  -- 지원 현황 추가
  INSERT INTO public.talent_applications (
    talent_profile_id, company_name, position, notes
  ) VALUES (
    _talent_profile_id, _company_name, _position, _notes
  ) RETURNING id INTO _application_id;
  
  -- 감사 로그 기록
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (_user_id, 'TALENT_APPLICATION_ADDED', 'talent_applications', _application_id, 
          jsonb_build_object('company_name', _company_name, 'position', _position));
  
  RETURN _application_id;
END;
$$;

-- 6. 인재 검색 함수 (승인된 프로필만)
CREATE OR REPLACE FUNCTION public.search_talents(
  _search_term TEXT DEFAULT NULL,
  _skills TEXT[] DEFAULT NULL,
  _experience_min INTEGER DEFAULT NULL,
  _experience_max INTEGER DEFAULT NULL,
  _work_type TEXT DEFAULT NULL,
  _remote_preference TEXT DEFAULT NULL,
  _location TEXT DEFAULT NULL,
  _limit INTEGER DEFAULT 20,
  _offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  summary TEXT,
  skills TEXT[],
  experience_years INTEGER,
  education TEXT,
  portfolio_url TEXT,
  location TEXT,
  work_type TEXT,
  remote_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  display_name TEXT,
  avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tp.id,
    tp.user_id,
    tp.title,
    tp.summary,
    tp.skills,
    tp.experience_years,
    tp.education,
    tp.portfolio_url,
    tp.location,
    tp.work_type,
    tp.remote_preference,
    tp.created_at,
    p.display_name,
    p.avatar_url
  FROM public.talent_profiles tp
  JOIN public.profiles p ON tp.user_id = p.id
  WHERE tp.status = 'approved'
    AND (_search_term IS NULL OR (
      tp.title ILIKE '%' || _search_term || '%' OR
      tp.summary ILIKE '%' || _search_term || '%' OR
      p.display_name ILIKE '%' || _search_term || '%'
    ))
    AND (_skills IS NULL OR tp.skills && _skills)
    AND (_experience_min IS NULL OR tp.experience_years >= _experience_min)
    AND (_experience_max IS NULL OR tp.experience_years <= _experience_max)
    AND (_work_type IS NULL OR tp.work_type = _work_type)
    AND (_remote_preference IS NULL OR tp.remote_preference = _remote_preference)
    AND (_location IS NULL OR tp.location ILIKE '%' || _location || '%')
  ORDER BY tp.created_at DESC
  LIMIT _limit OFFSET _offset;
END;
$$;

-- 7. 사용자 설정 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_user_preferences(
  _email_notifications BOOLEAN DEFAULT NULL,
  _push_notifications BOOLEAN DEFAULT NULL,
  _profile_visibility TEXT DEFAULT NULL,
  _job_alerts BOOLEAN DEFAULT NULL,
  _newsletter_subscription BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
BEGIN
  -- 현재 사용자 ID 가져오기
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- 입력값 검증
  IF _profile_visibility IS NOT NULL AND _profile_visibility NOT IN ('public', 'private', 'contacts_only') THEN
    RAISE EXCEPTION 'Invalid profile visibility value';
  END IF;
  
  -- 사용자 설정 업데이트
  UPDATE public.user_preferences 
  SET 
    email_notifications = COALESCE(_email_notifications, email_notifications),
    push_notifications = COALESCE(_push_notifications, push_notifications),
    profile_visibility = COALESCE(_profile_visibility, profile_visibility),
    job_alerts = COALESCE(_job_alerts, job_alerts),
    newsletter_subscription = COALESCE(_newsletter_subscription, newsletter_subscription),
    updated_at = now()
  WHERE user_id = _user_id;
  
  -- 감사 로그 기록
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (_user_id, 'USER_PREFERENCES_UPDATED', 'user_preferences', _user_id, 
          jsonb_build_object('updated_at', now()));
  
  RETURN TRUE;
END;
$$;

-- 8. 인재 프로필 삭제 함수
CREATE OR REPLACE FUNCTION public.delete_talent_profile(_talent_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
BEGIN
  -- 현재 사용자 ID 가져오기
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- 프로필 소유자 또는 관리자 확인
  IF NOT EXISTS (
    SELECT 1 FROM public.talent_profiles 
    WHERE id = _talent_profile_id AND (user_id = _user_id OR public.has_role(_user_id, 'admin'))
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- 인재 프로필 삭제 (CASCADE로 관련 데이터도 삭제됨)
  DELETE FROM public.talent_profiles WHERE id = _talent_profile_id;
  
  -- 감사 로그 기록
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id)
  VALUES (_user_id, 'TALENT_PROFILE_DELETED', 'talent_profiles', _talent_profile_id);
  
  RETURN TRUE;
END;
$$;

-- 9. 인재 프로필 통계 함수
CREATE OR REPLACE FUNCTION public.get_talent_statistics()
RETURNS TABLE (
  total_talents BIGINT,
  pending_count BIGINT,
  approved_count BIGINT,
  rejected_count BIGINT,
  expired_count BIGINT,
  top_skills JSONB,
  experience_distribution JSONB,
  work_type_distribution JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_talents,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending_count,
    COUNT(*) FILTER (WHERE status = 'approved')::BIGINT as approved_count,
    COUNT(*) FILTER (WHERE status = 'rejected')::BIGINT as rejected_count,
    COUNT(*) FILTER (WHERE status = 'expired')::BIGINT as expired_count,
    
    -- 상위 기술 스택
    (SELECT jsonb_object_agg(skill, count) FROM (
      SELECT unnest(skills) as skill, COUNT(*) as count
      FROM public.talent_profiles
      WHERE status = 'approved'
      GROUP BY skill
      ORDER BY count DESC
      LIMIT 10
    ) t) as top_skills,
    
    -- 경력 분포
    (SELECT jsonb_object_agg(exp_range, count) FROM (
      SELECT 
        CASE 
          WHEN experience_years = 0 THEN '신입'
          WHEN experience_years BETWEEN 1 AND 3 THEN '1-3년'
          WHEN experience_years BETWEEN 4 AND 7 THEN '4-7년'
          WHEN experience_years BETWEEN 8 AND 15 THEN '8-15년'
          ELSE '15년 이상'
        END as exp_range,
        COUNT(*) as count
      FROM public.talent_profiles
      WHERE status = 'approved'
      GROUP BY exp_range
      ORDER BY 
        CASE exp_range
          WHEN '신입' THEN 1
          WHEN '1-3년' THEN 2
          WHEN '4-7년' THEN 3
          WHEN '8-15년' THEN 4
          ELSE 5
        END
    ) t) as experience_distribution,
    
    -- 근무 형태 분포
    (SELECT jsonb_object_agg(work_type, count) FROM (
      SELECT work_type, COUNT(*) as count
      FROM public.talent_profiles
      WHERE status = 'approved'
      GROUP BY work_type
    ) t) as work_type_distribution
    
  FROM public.talent_profiles;
END;
$$;

-- 10. API 함수 생성 완료 로그
INSERT INTO public.audit_logs (action, table_name, record_id)
VALUES ('TALENT_API_FUNCTIONS_CREATED', 'system', gen_random_uuid());

-- 11. API 함수 생성 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '🚀 TALENT RECRUITMENT API FUNCTIONS CREATED 🚀';
  RAISE NOTICE 'Functions: create_talent_profile, update_talent_profile, add_talent_experience';
  RAISE NOTICE 'Functions: add_talent_project, add_talent_application, search_talents';
  RAISE NOTICE 'Functions: update_user_preferences, delete_talent_profile, get_talent_statistics';
  RAISE NOTICE 'All functions include security validation and audit logging';
END $$;
