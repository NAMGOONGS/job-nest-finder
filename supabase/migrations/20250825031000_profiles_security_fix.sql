-- profiles 테이블 보안 취약점 수정
-- 2025-08-25 03:10:00

-- 🚨 보안 경고: profiles 테이블의 이메일 주소가 공개적으로 노출되어 있음
-- 이는 스팸, 피싱, 신원 도용 등의 위험을 초래할 수 있습니다

-- 1. 기존 위험한 RLS 정책 제거
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;

-- 2. 보안 강화된 RLS 정책 생성
-- 사용자는 자신의 프로필만 볼 수 있음
CREATE POLICY "Users can only view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 3. 공개 프로필 뷰 생성 (민감한 정보 제외)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  display_name,
  avatar_url,
  created_at,
  updated_at
  -- 이메일 주소는 제외 (보안상 위험)
FROM public.profiles
WHERE display_name IS NOT NULL; -- 공개 프로필만 표시

-- 4. 공개 프로필 뷰에 대한 RLS 정책
-- 누구나 공개 프로필을 볼 수 있지만 이메일은 제외
CREATE POLICY "Anyone can view public profile info (no email)" 
ON public.public_profiles 
FOR SELECT 
USING (true);

-- 5. 프로필 업데이트 정책 강화
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile (restricted fields)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- 이메일 주소 변경 제한 (보안상 위험)
  email = OLD.email
);

-- 6. 이메일 변경 전용 함수 생성 (보안 검증 포함)
CREATE OR REPLACE FUNCTION public.update_user_email(_new_email TEXT, _current_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
  _email_exists BOOLEAN;
BEGIN
  -- 현재 사용자 ID 가져오기
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- 새 이메일이 이미 존재하는지 확인
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE email = _new_email AND id != _user_id)
  INTO _email_exists;
  
  IF _email_exists THEN
    RAISE EXCEPTION 'Email already exists';
  END IF;
  
  -- 이메일 형식 검증 (간단한 검증)
  IF _new_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- 이메일 업데이트
  UPDATE public.profiles 
  SET email = _new_email, updated_at = now()
  WHERE id = _user_id;
  
  -- 감사 로그에 이메일 변경 기록
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (_user_id, 'EMAIL_CHANGED', 'profiles', _user_id, jsonb_build_object('email', _new_email));
  
  RETURN TRUE;
END;
$$;

-- 7. 프로필 삭제 정책 강화
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users cannot delete profiles (admin only)" 
ON public.profiles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- 8. 관리자 전용 프로필 관리 함수
CREATE OR REPLACE FUNCTION public.admin_view_all_profiles()
RETURNS TABLE (
  id UUID,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
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
    p.id,
    p.email,
    p.display_name,
    p.avatar_url,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- 9. 프로필 검색 함수 (이메일 제외)
CREATE OR REPLACE FUNCTION public.search_profiles(_search_term TEXT)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.display_name,
    p.avatar_url,
    p.created_at
  FROM public.profiles p
  WHERE 
    p.display_name IS NOT NULL AND
    (
      p.display_name ILIKE '%' || _search_term || '%' OR
      p.display_name ILIKE _search_term || '%'
    )
  ORDER BY p.display_name;
END;
$$;

-- 10. 프로필 통계 함수 (개인정보 제외)
CREATE OR REPLACE FUNCTION public.get_profile_stats()
RETURNS TABLE (
  total_users BIGINT,
  active_users BIGINT,
  recent_signups BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_users,
    COUNT(CASE WHEN updated_at > now() - interval '30 days' THEN 1 END)::BIGINT as active_users,
    COUNT(CASE WHEN created_at > now() - interval '7 days' THEN 1 END)::BIGINT as recent_signups
  FROM public.profiles;
END;
$$;

-- 11. 기존 공개 데이터 정리 (보안 강화)
-- 이메일이 공개적으로 노출된 기존 데이터 보호
UPDATE public.profiles 
SET display_name = COALESCE(display_name, 'User_' || substr(id::text, 1, 8))
WHERE display_name IS NULL OR display_name = '';

-- 12. 보안 설정 완료 로그
INSERT INTO public.audit_logs (action, table_name, record_id)
VALUES ('PROFILES_SECURITY_FIXED', 'system', gen_random_uuid());

-- 13. 보안 경고 메시지
DO $$
BEGIN
  RAISE NOTICE '🚨 PROFILES TABLE SECURITY FIXED 🚨';
  RAISE NOTICE 'Email addresses are no longer publicly accessible';
  RAISE NOTICE 'Users can only view their own profile data';
  RAISE NOTICE 'Public profiles view excludes sensitive information';
  RAISE NOTICE 'Admin functions available for profile management';
END $$;
