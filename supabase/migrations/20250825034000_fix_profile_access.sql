-- Fix profile access issues by using public_profiles view instead of profiles table
-- This migration resolves 406 errors and PGRST116 errors when accessing user profile data

-- 1. Fix search_talents function to use public_profiles view
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
    pp.display_name,
    pp.avatar_url
  FROM public.talent_profiles tp
  JOIN public.public_profiles pp ON tp.user_id = pp.id
  WHERE tp.status = 'approved'
    AND (_search_term IS NULL OR (
      tp.title ILIKE '%' || _search_term || '%' OR
      tp.summary ILIKE '%' || _search_term || '%' OR
      pp.display_name ILIKE '%' || _search_term || '%'
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

-- 2. Fix get_user_dashboard_data function to use public_profiles view
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
    -- 프로필 정보 (public_profiles 뷰 사용)
    (SELECT to_jsonb(pp.*) FROM public.public_profiles pp WHERE pp.id = _user_id) as profile_data,
    
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

-- 3. Fix get_admin_dashboard_data function to use public_profiles view
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

-- 4. Create a helper function to safely get user profile data for comments and posts
CREATE OR REPLACE FUNCTION public.get_user_profile_safe(_user_id UUID)
RETURNS TABLE (
  display_name TEXT,
  avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT pp.display_name, pp.avatar_url
  FROM public.public_profiles pp
  WHERE pp.id = _user_id;
END;
$$;

-- 5. Update audit logging for profile access changes
INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'system@job-nest-finder.com' LIMIT 1),
  'MIGRATION_APPLIED',
  'functions',
  gen_random_uuid(),
  jsonb_build_object(
    'migration', '20250825034000_fix_profile_access',
    'description', 'Fixed profile access issues by using public_profiles view',
    'functions_updated', ARRAY['search_talents', 'get_user_dashboard_data', 'get_admin_dashboard_data', 'get_user_profile_safe'],
    'applied_at', now()
  )
);

-- 6. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.search_talents TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_dashboard_data TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_data TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profile_safe TO authenticated;

-- 7. Create indexes for better performance on public_profiles view
CREATE INDEX IF NOT EXISTS idx_public_profiles_id ON public.public_profiles(id);
CREATE INDEX IF NOT EXISTS idx_public_profiles_display_name ON public.public_profiles(display_name);

-- 8. Add comments for documentation
COMMENT ON FUNCTION public.search_talents IS 'Search approved talent profiles using public_profiles view for secure access';
COMMENT ON FUNCTION public.get_user_dashboard_data IS 'Get user dashboard data using public_profiles view for secure access';
COMMENT ON FUNCTION public.get_admin_dashboard_data IS 'Get admin dashboard data using public_profiles view for secure access';
COMMENT ON FUNCTION public.get_user_profile_safe IS 'Safely get user profile data for comments and posts using public_profiles view';

-- 9. Final notice
DO $$
BEGIN
  RAISE NOTICE 'Profile access migration completed successfully';
  RAISE NOTICE 'Functions updated: search_talents, get_user_dashboard_data, get_admin_dashboard_data';
  RAISE NOTICE 'New function created: get_user_profile_safe';
  RAISE NOTICE 'All profile access now uses public_profiles view for security';
END $$;
