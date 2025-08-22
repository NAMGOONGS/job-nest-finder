import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'moderator' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user'); // 기본값
        } else {
          setRole(data.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user'); // 기본값
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return {
    role,
    isAdmin: role === 'admin',
    isModerator: role === 'moderator',
    isUser: role === 'user',
    isLoading,
  };
};