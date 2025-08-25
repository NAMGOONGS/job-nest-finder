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