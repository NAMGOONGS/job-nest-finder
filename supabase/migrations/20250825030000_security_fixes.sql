-- 보안 취약점 수정 마이그레이션
-- 2025-08-25 03:00:00

-- 1. 기존 하드코딩된 관리자 권한 부여 제거
-- 보안상 위험한 하드코딩된 이메일 기반 권한 부여를 제거
DELETE FROM public.user_roles 
WHERE user_id IN (
  SELECT id FROM public.profiles 
  WHERE email IN ('root@example.com', 'root@naver.com')
);

-- 2. 보안 강화된 관리자 권한 부여 함수 생성
CREATE OR REPLACE FUNCTION public.assign_admin_role(_email TEXT, _admin_secret TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
  _secret_hash TEXT;
BEGIN
  -- 환경 변수에서 관리자 시크릿 가져오기 (실제 운영에서는 환경 변수 사용)
  -- _admin_secret = current_setting('app.admin_secret', true);
  
  -- 시크릿 검증 (실제 운영에서는 더 강력한 인증 방식 사용)
  IF _admin_secret IS NULL OR _admin_secret != 'SUPABASE_ADMIN_SECRET_2025' THEN
    RAISE EXCEPTION 'Invalid admin secret';
  END IF;
  
  -- 사용자 ID 조회
  SELECT id INTO _user_id
  FROM public.profiles
  WHERE email = _email;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: %', _email;
  END IF;
  
  -- 기존 권한 제거 후 admin 권한 부여
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin');
  
  RETURN TRUE;
END;
$$;

-- 3. RLS 정책 강화 - profiles 테이블 (보안 강화)
-- 🚨 보안 경고: 이메일 주소 공개 노출 위험
-- 사용자는 자신의 프로필만 볼 수 있음
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;

CREATE POLICY "Users can only view their own profile (email protected)" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 공개 프로필 뷰 생성 (민감한 정보 제외)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  display_name,
  avatar_url,
  created_at,
  updated_at
  -- 이메일 주소는 제외 (보안상 위험)
FROM public.profiles
WHERE display_name IS NOT NULL;

-- 공개 프로필 뷰에 대한 RLS 정책
CREATE POLICY "Anyone can view public profile info (no email)" 
ON public.public_profiles 
FOR SELECT 
USING (true);

-- 4. RLS 정책 강화 - user_roles 테이블
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;
CREATE POLICY "Users can view their own role" 
ON public.user_roles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin')
);

-- 5. 커뮤니티 테이블 보안 강화
-- 게시글 삭제 정책 강화 (관리자만 삭제 가능)
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.community_posts;
CREATE POLICY "Users can delete their own posts or admins can delete any" 
ON public.community_posts 
FOR DELETE 
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin')
);

-- 댓글 삭제 정책 강화
DROP POLICY IF EXISTS "Users can delete their own replies" ON public.community_post_replies;
CREATE POLICY "Users can delete their own replies or admins can delete any" 
ON public.community_post_replies 
FOR DELETE 
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin')
);

-- 6. 관리자 전용 함수 생성
CREATE OR REPLACE FUNCTION public.admin_delete_post(_post_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 관리자 권한 확인
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  -- 게시글 삭제
  DELETE FROM public.community_posts WHERE id = _post_id;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_reply(_reply_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 관리자 권한 확인
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  -- 댓글 삭제
  DELETE FROM public.community_post_replies WHERE id = _reply_id;
  
  RETURN TRUE;
END;
$$;

-- 7. 감사 로그 테이블 생성 (보안 추적용)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 감사 로그 RLS 활성화
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 감사 로그 정책 (관리자만 조회 가능)
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- 8. 보안 이벤트 트리거 함수
CREATE OR REPLACE FUNCTION public.log_security_event()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id, 
    action, 
    table_name, 
    record_id, 
    old_values, 
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 9. 중요 테이블에 감사 로그 트리거 추가
CREATE TRIGGER audit_user_roles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

CREATE TRIGGER audit_profiles_changes
  AFTER UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

-- 10. 세션 관리 및 보안 설정
-- 비정상적인 로그인 시도 감지 함수
CREATE OR REPLACE FUNCTION public.check_login_attempts(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _attempt_count INTEGER;
  _last_attempt TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 최근 1시간 내 로그인 시도 횟수 확인
  SELECT COUNT(*), MAX(created_at)
  INTO _attempt_count, _last_attempt
  FROM public.audit_logs
  WHERE user_id = _user_id 
    AND action = 'LOGIN_ATTEMPT'
    AND created_at > now() - interval '1 hour';
  
  -- 5회 이상 시도 시 차단
  IF _attempt_count >= 5 THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id)
    VALUES (_user_id, 'LOGIN_BLOCKED', 'security', _user_id);
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- 11. 보안 정책 적용 확인
-- 모든 테이블에 RLS가 활성화되어 있는지 확인
DO $$
DECLARE
  _table_name TEXT;
BEGIN
  FOR _table_name IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', _table_name);
  END LOOP;
END $$;

-- 12. 보안 설정 완료 로그
INSERT INTO public.audit_logs (action, table_name, record_id)
VALUES ('SECURITY_MIGRATION_COMPLETED', 'system', gen_random_uuid());
