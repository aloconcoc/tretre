import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const email = process.argv[2];
if (!email) {
  console.error('Usage: tsx scripts/promote-admin.ts <email>');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('email', email)
    .select()
    .single();

  if (error) throw error;
  console.log(`Promoted ${data.email} to admin.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
