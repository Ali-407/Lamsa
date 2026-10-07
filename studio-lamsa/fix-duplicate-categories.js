import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2023-01-01' })

async function fixDuplicateCategories() {
  console.log('Starting category cleanup...');

  // 1. Ensure cat-woody-earthy exists
  await client.createOrReplace({
    _id: 'cat-woody-earthy',
    _type: 'category',
    title: 'Woody & Earthy',
    slug: { _type: 'slug', current: 'woody-earthy' },
    description: 'Deep, grounding forest accords crafted from aged barks, vetiver, and precious timbers. Masculine and meditative.'
  });
  console.log('Ensured cat-woody-earthy exists.');

  // Update existing cat-* category descriptions to be detailed
  await client.patch('cat-amber-rich').set({
    description: 'Warm, opulent elixirs infused with rare resins, precious ambers, and seductive spice accords. Deep, sensual, and unforgettable.'
  }).commit();

  await client.patch('cat-citrus-fresh').set({
    description: 'Crisp, uplifting compositions inspired by morning dew, Mediterranean citrus groves, and sea-kissed breezes.'
  }).commit();

  await client.patch('cat-floral-delicate').set({
    description: 'Radiant botanical bouquets brimming with elegance and timeless feminine charm. Jasmine, rose, and peony in their most refined expressions.'
  }).commit();

  // 2. Remap product references
  const remap = {
    'category-amber-rich': 'cat-amber-rich',
    'category-citrus-fresh': 'cat-citrus-fresh',
    'category-floral-delicate': 'cat-floral-delicate',
    'category-woody-earthy': 'cat-woody-earthy',
  };

  const products = await client.fetch(`*[_type == "product" && category._ref in $oldIds]`, {
    oldIds: Object.keys(remap)
  });

  console.log(`Found ${products.length} products to re-link to canonical categories.`);

  for (const prod of products) {
    const oldRef = prod.category._ref;
    const newRef = remap[oldRef];
    if (newRef) {
      await client.patch(prod._id).set({
        'category._ref': newRef
      }).commit();
      console.log(`Re-linked product ${prod._id} (${prod.name || prod.title || 'Product'}) from ${oldRef} to ${newRef}`);
    }
  }

  // 3. Delete duplicate/unused category documents
  const idsToDelete = [
    'category-amber-rich',
    'category-citrus-fresh',
    'category-floral-delicate',
    'category-woody-earthy',
    '72b0e1e9-57b7-48a0-9dc3-e696768716a5'
  ];

  for (const id of idsToDelete) {
    try {
      await client.delete(id);
      console.log(`Deleted duplicate category: ${id}`);
    } catch (err) {
      console.error(`Failed to delete ${id}:`, err.message);
    }
  }

  console.log('Category cleanup finished successfully!');
}

fixDuplicateCategories().catch(console.error);
