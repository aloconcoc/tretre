import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import vouchers from '../src/data/vouchers.json';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const rows = vouchers.map((v) => ({
    code: v.code.toUpperCase(),
    type: v.type,
    value: v.value,
    min_order_value: v.minOrderValue,
    max_uses: v.maxUses,
    used_count: v.usedCount,
    valid_from: v.validFrom,
    valid_until: v.validUntil,
    active: v.active,
    description: v.description,
  }));

  const { error } = await supabase.from('vouchers').upsert(rows, { onConflict: 'code' });
  if (error) throw error;
  console.log(`Seeded ${rows.length} vouchers.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
