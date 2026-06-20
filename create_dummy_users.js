import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

const dummyUsers = [
  {
    email: 'admin@webgis.com',
    password: 'password123',
    namaLengkap: 'Bapak Admin',
    role: 'admin'
  },
  {
    email: 'warga@webgis.com',
    password: 'password123',
    namaLengkap: 'Siti Warga',
    role: 'warga'
  },
  {
    email: 'transporter@webgis.com',
    password: 'password123',
    namaLengkap: 'Tono Transporter',
    role: 'transporter'
  }
];

async function createDummies() {
  console.log("Membuat akun dummy di Supabase...\n");

  for (const u of dummyUsers) {
    const { error } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
      options: {
        data: {
          nama_lengkap: u.namaLengkap,
          role: u.role
        }
      }
    });

    if (error) {
      console.log(`❌ Gagal membuat ${u.email}: ${error.message}`);
    } else {
      console.log(`✅ Berhasil membuat akun [${u.role.toUpperCase()}]: ${u.email}`);
    }
  }

  console.log("\nPastikan 'Auto Confirm Email' AKTIF di Supabase (Authentication -> Providers -> Email).");
  console.log("Semua akun ini memiliki password yang sama: password123");
}

createDummies();
