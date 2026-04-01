import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fcvhzmbfkhybqtnxdfoq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Ul9sC9RLF4c8j0MU1pS48Q_qlBHSL4o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
