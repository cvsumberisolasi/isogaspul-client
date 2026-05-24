import { createClient } from '@insforge/sdk';

// InsForge Client Configuration
// Base URL: https://c8kze9fw.ap-southeast.insforge.app

export const insforge = createClient({
  baseUrl: 'https://c8kze9fw.ap-southeast.insforge.app',
  anonKey: 'ik_a2c69f99f1209ba9b4bc9ff9e7ed9762',
});

// Database operations shorthand
export const db = {
  from: (table: string) => insforge.database.from(table),
};

// Usage examples:
// import { insforge, db } from '@/lib/insforge-client';

// // Select
// const { data, error } = await insforge.database.from('products').select();

// // Insert
// const { data, error } = await insforge.database.from('products').insert({ name: 'New Product' }).select();

// // Update
// const { data, error } = await insforge.database.from('products').update({ name: 'Updated' }).eq('id', '123').select();

// // Delete
// const { error } = await insforge.database.from('products').delete().eq('id', '123');
