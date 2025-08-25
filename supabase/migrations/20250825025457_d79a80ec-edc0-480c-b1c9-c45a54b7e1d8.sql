-- root@naver.com 계정에 admin 권한 부여
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM public.profiles 
  WHERE email = 'root@naver.com'
);

-- 만약 user_roles 레코드가 없다면 새로 생성
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'admin'::app_role
FROM public.profiles p
WHERE p.email = 'root@naver.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id
);

-- 확인용 쿼리: root@naver.com 계정의 권한 조회
SELECT 
  p.email,
  p.display_name,
  ur.role,
  ur.created_at as role_assigned_at
FROM public.profiles p
JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email = 'root@naver.com';