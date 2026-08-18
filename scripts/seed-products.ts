import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
import products from '../src/data/products.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    name_en: p.nameEn,
    collection: p.collection,
    category: p.category,
    price: p.price,
    price_usd: p.priceUSD,
    images: p.images,
    description: p.description,
    description_en: p.descriptionEn,
    long_description: p.longDescription,
    material: p.material,
    specifications: p.specifications ?? {},
    bestseller: p.bestseller,
    premium: p.premium,
    in_stock: p.inStock,
    quantity: p.quantity,
  }));

  const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
  console.log(`Seeded ${rows.length} products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
