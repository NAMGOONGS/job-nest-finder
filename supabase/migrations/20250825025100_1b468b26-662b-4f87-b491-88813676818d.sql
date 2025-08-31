-- ⚠️ 보안 경고: 이 파일은 보안상 위험합니다
-- 하드코딩된 이메일로 관리자 권한을 부여하는 것은 보안 취약점입니다
-- 대신 새로운 보안 마이그레이션 파일(20250825030000_security_fixes.sql)을 사용하세요

-- 이 파일의 실행을 중단하고 보안 마이그레이션을 먼저 실행하세요
-- SELECT 'SECURITY_WARNING: This migration is deprecated due to security vulnerabilities' as warning;

-- 기존 코드는 주석 처리 (보안상 위험)
/*
-- root 계정에 admin 권한 부여
-- 먼저 회원가입을 완료한 후 아래 쿼리에서 이메일을 실제 가입한 이메일로 변경하세요
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM public.profiles 
  WHERE email = 'root@example.com' -- 실제 가입한 이메일로 변경
);

-- 만약 user_roles 레코드가 없다면 새로 생성
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'admin'::app_role
FROM public.profiles p
WHERE p.email = 'root@example.com' -- 실제 가입한 이메일로 변경
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id
);
*/

-- 보안 마이그레이션 실행 확인
DO $$
BEGIN
  RAISE NOTICE 'This migration is deprecated. Please run 20250825030000_security_fixes.sql instead.';
END $$;
