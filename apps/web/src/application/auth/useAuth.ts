import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';

export interface UserProfile {
  id: string;
  email?: string;
  role: 'DOCTOR' | 'EMPLOYER' | null;
  firstName?: string;
  lastName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'DOCTOR' | 'EMPLOYER' | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const meta = session.user.user_metadata || {};
          setRole(meta.role || null);
          setFirstName(meta.firstName || '');
          setLastName(meta.lastName || '');
        } else {
          setUser(null);
          setRole(null);
          setFirstName('');
          setLastName('');
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        const meta = session.user.user_metadata || {};
        setRole(meta.role || null);
        setFirstName(meta.firstName || '');
        setLastName(meta.lastName || '');
      } else {
        setUser(null);
        setRole(null);
        setFirstName('');
        setLastName('');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    role,
    firstName,
    lastName,
    loading,
    isAuthenticated: !!user,
    logout: async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/';
    }
  };
}
