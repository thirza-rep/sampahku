import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const tables = ['profiles', 'warga', 'sampah', 'pengangkutan', 'pembayaran'];
  console.log("Mengecek database Supabase Anda...\n");
  console.log("=== HASIL PENGECEKAN TABEL ===");
  
  let allGood = true;

  for (const table of tables) {
    // Mencoba melakukan query ke masing-masing tabel
    const { data, error } = await supabase.from(table).select('*').limit(1);
    
    if (error) {
      // Jika error karena tabel tidak ditemukan
      if (error.message.includes('Could not find the table') || error.message.includes('does not exist')) {
         console.log(`❌ Tabel '${table}' BELUM ADA.`);
         allGood = false;
      } else {
         // Tabel ada, tapi mungkin diblokir oleh RLS (Ini wajar jika policy sudah aktif)
         console.log(`✅ Tabel '${table}' SUDAH ADA (Terlindungi oleh RLS Policy).`);
      }
    } else {
      // Tabel ada dan bisa diakses
      console.log(`✅ Tabel '${table}' SUDAH ADA (Akses RLS terbuka / data kosong).`);
    }
  }
  
  console.log("==============================\n");
  if (allGood) {
    console.log("Kesimpulan: Skrip SQL Anda BERHASIL dieksekusi di Supabase!");
    console.log("Semua tabel yang dibutuhkan untuk modul sudah tersedia.");
  } else {
    console.log("Kesimpulan: Ada tabel yang belum terbuat. Pastikan Anda sudah menjalankan seluruh kode SQL di SQL Editor Supabase.");
  }
}

checkTables();
