import { createClient } from '@supabase/supabase-js';

export const SUPABASE_ADMIN_CLIENT = 'SUPABASE_ADMIN_CLIENT';

export const supabaseAdminClientProvider = {
  provide: SUPABASE_ADMIN_CLIENT,
  useFactory: () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('Supabase admin credentials are not set');
    }
    return createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  },
};
