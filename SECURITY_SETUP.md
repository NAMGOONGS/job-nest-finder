# 🔒 Job Nest Finder 보안 설정 가이드

## 📋 목차
1. [보안 마이그레이션 적용](#보안-마이그레이션-적용)
2. [환경 변수 설정](#환경-변수-설정)
3. [데이터베이스 보안 설정](#데이터베이스-보안-설정)
4. [사용자 권한 관리](#사용자-권한-관리)
5. [감사 로그 모니터링](#감사-로그-모니터링)
6. [새로운 보안 마이그레이션](#새로운-보안-마이그레이션)
7. [🎯 인재채용 시스템 구축 완료](#-인재채용-시스템-구축-완료)
8. [🔧 프로필 접근 문제 해결](#-프로필-접근-문제-해결)

## 🚀 보안 마이그레이션 적용

### 1단계: Supabase CLI 설치 및 로그인
```bash
# Supabase CLI 설치
npm install -g supabase

# Supabase 로그인
supabase login

# 프로젝트 링크
supabase link --project-ref YOUR_PROJECT_REF
```

### 2단계: 마이그레이션 적용
```bash
# 마이그레이션 적용
supabase db push

# 또는 특정 마이그레이션만 적용
supabase db reset
```

## 🔑 환경 변수 설정

### `.env` 파일 생성
```bash
# 프로젝트 루트에 .env 파일 생성
touch .env
```

### 필수 환경 변수
```env
# Supabase 설정
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 관리자 설정
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_SECRET=your-secure-admin-secret

# 보안 설정
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

## 🛡️ 데이터베이스 보안 설정

### RLS (Row Level Security) 활성화
```sql
-- 모든 테이블에 RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_replies ENABLE ROW LEVEL SECURITY;
```

### 보안 정책 확인
```sql
-- RLS 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 👥 사용자 권한 관리

### 관리자 역할 할당
```sql
-- 관리자 역할 할당 (환경 변수 사용)
SELECT public.assign_admin_role('admin@yourdomain.com');
```

### 사용자 권한 확인
```sql
-- 사용자 권한 확인
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY ur.created_at DESC;
```

## 📊 감사 로그 모니터링

### 감사 로그 조회
```sql
-- 최근 보안 이벤트 조회
SELECT 
  action,
  table_name,
  user_id,
  created_at,
  new_values
FROM public.audit_logs
ORDER BY created_at DESC
LIMIT 50;
```

### 보안 이벤트 필터링
```sql
-- 특정 사용자의 보안 이벤트
SELECT * FROM public.audit_logs 
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC;
```

## 🔄 새로운 보안 마이그레이션

### 20250825030000_security_fixes.sql
- **목적**: 전반적인 보안 강화
- **주요 변경사항**:
  - 하드코딩된 관리자 할당 제거
  - `assign_admin_role` 함수 생성
  - `profiles` 및 `user_roles` 테이블 RLS 강화
  - 삭제 정책 강화
  - `audit_logs` 테이블 및 트리거 추가

### 20250825031000_profiles_security_fix.sql
- **목적**: `profiles` 테이블 이메일 노출 보안 취약점 해결
- **주요 변경사항**:
  - `profiles` 테이블 RLS 정책 변경: "사용자는 자신의 프로필만 조회 가능"
  - `public.public_profiles` 뷰 생성 (이메일 제외)
  - `UPDATE` 정책 강화
  - `update_user_email` 함수 생성
  - 프로필 삭제는 관리자만 가능
  - 관리자 전용 함수들 생성

### 20250825032000_talent_recruitment_system.sql
- **목적**: 인재채용 시스템 보안 테이블 및 정책 구축
- **주요 변경사항**:
  - `talent_profiles`, `talent_resumes`, `talent_experiences` 등 테이블 생성
  - 모든 테이블에 RLS 활성화
  - 사용자별 데이터 접근 제어
  - 승인 시스템을 위한 상태 관리

### 20250825033000_talent_api_functions.sql
- **목적**: 인재채용 시스템 API 함수 및 보안 로직 구현
- **주요 변경사항**:
  - `create_talent_profile`, `approve_talent_profile` 등 함수 생성
  - 모든 함수에 사용자 인증 및 권한 검증
  - 감사 로그 기록
  - `SECURITY DEFINER` 설정으로 안전한 실행

### 20250825034000_fix_profile_access.sql
- **목적**: 프로필 접근 시 발생하는 406 및 PGRST116 오류 해결
- **주요 변경사항**:
  - `search_talents` 함수: `profiles` → `public_profiles` 뷰 사용
  - `get_user_dashboard_data` 함수: `profiles` → `public_profiles` 뷰 사용
  - `get_admin_dashboard_data` 함수: `profiles` → `public_profiles` 뷰 사용
  - `get_user_profile_safe` 헬퍼 함수 생성
  - 성능 향상을 위한 인덱스 생성
  - 모든 함수에 적절한 권한 부여

## 🎯 인재채용 시스템 구축 완료

### 🏗️ 시스템 구조
- **사용자 관리**: 프로필, 권한, 설정
- **인재 프로필**: 기본정보, 경력, 프로젝트, 이력서
- **승인 시스템**: 관리자 승인 후 공개
- **지원 관리**: 기업별 지원 현황 추적
- **검색 및 매칭**: AI 기반 인재 검색

### 🔒 보안 기능
- **RLS 정책**: 사용자별 데이터 접근 제어
- **승인 워크플로우**: 관리자 승인 후 공개
- **감사 로그**: 모든 보안 관련 이벤트 기록
- **권한 관리**: 역할 기반 접근 제어

### 📱 프론트엔드 기능
- **마이페이지**: 사용자 정보 및 활동 내역
- **인재 등록**: 프로필 작성 및 파일 업로드
- **인재풀**: 승인된 인재 검색 및 필터링
- **커뮤니티**: 게시글 및 댓글 시스템
- **관리자 대시보드**: 승인 관리 및 통계

## 🔧 프로필 접근 문제 해결

### ❌ 발생했던 문제들
1. **406 (Not Acceptable) 오류**: `profiles` 테이블 RLS 정책으로 인한 접근 거부
2. **PGRST116 오류**: "Cannot coerce the result to a single JSON object"
3. **댓글 작성자 정보 누락**: 프로필 접근 실패로 인한 사용자명 표시 불가
4. **인재 검색 실패**: 프로필 정보 JOIN 실패로 인한 검색 오류

### ✅ 해결 방법
1. **`public_profiles` 뷰 사용**: 민감한 정보(이메일) 제외하고 안전한 프로필 정보 제공
2. **함수 수정**: 모든 데이터베이스 함수에서 `profiles` → `public_profiles` 뷰 사용
3. **권한 부여**: 인증된 사용자에게 필요한 함수 실행 권한 부여
4. **성능 최적화**: 인덱스 생성으로 검색 성능 향상

### 🔄 수정된 함수들
- `search_talents`: 인재 검색 시 프로필 정보 안전하게 가져오기
- `get_user_dashboard_data`: 마이페이지 데이터 안전하게 가져오기
- `get_admin_dashboard_data`: 관리자 대시보드 데이터 안전하게 가져오기
- `get_user_profile_safe`: 댓글 및 게시글 작성자 정보 안전하게 가져오기

### 📊 적용 결과
- ✅ 콘솔 오류 해결 (406, PGRST116)
- ✅ 댓글 작성자 정보 정상 표시
- ✅ 인재 검색 및 프로필 조회 정상 작동
- ✅ 보안 강화 (민감한 정보 노출 방지)
- ✅ 성능 향상 (인덱스 및 최적화된 쿼리)

## 🚨 보안 주의사항

### 1. 정기적인 감사 로그 확인
```sql
-- 일일 보안 이벤트 요약
SELECT 
  DATE(created_at) as event_date,
  action,
  COUNT(*) as event_count
FROM public.audit_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at), action
ORDER BY event_date DESC;
```

### 2. 사용자 권한 모니터링
```sql
-- 관리자 권한 확인
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

### 3. RLS 정책 테스트
```sql
-- 보안 테스트 스크립트 실행
\i supabase/security_test.sql
```

## 📞 지원 및 문의

보안 관련 문제나 추가 설정이 필요한 경우:
1. 감사 로그 확인
2. RLS 정책 검증
3. 사용자 권한 확인
4. 데이터베이스 함수 실행 권한 확인

---

**⚠️ 중요**: 이 가이드의 모든 설정은 프로덕션 환경에서 테스트 후 적용하세요.
