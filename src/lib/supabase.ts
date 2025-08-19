import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Clean Supabase integration layer
 * 모든 Supabase 관련 기능을 중앙 집중화하여 관리
 */

// 인증 관련 기능
export const authService = {
  // 이메일/비밀번호로 로그인
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // 이메일/비밀번호로 회원가입
  async signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) throw error;
    return data;
  },

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 현재 사용자 정보 가져오기
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // 현재 세션 정보 가져오기
  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // 인증 상태 변화 감지
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// 데이터베이스 관련 기능 (나중에 확장 예정)
export const dbService = {
  // 사용자 프로필 관련 기능들이 여기에 추가될 예정
  // 인재 풀 관련 기능들이 여기에 추가될 예정
  // 채용 공고 관련 기능들이 여기에 추가될 예정
  // 커뮤니티 관련 기능들이 여기에 추가될 예정
};

// 스토리지 관련 기능 (나중에 확장 예정)
export const storageService = {
  // 파일 업로드 관련 기능들이 여기에 추가될 예정
  // 이미지 관리 관련 기능들이 여기에 추가될 예정
};

export { supabase };