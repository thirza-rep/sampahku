import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

async function getUsers() {
  const users = ['admin@webgis.com', 'warga@webgis.com', 'transporter@webgis.com'];
  for(let u of users) {
    const { data } = await supabase.auth.signInWithPassword({ email: u, password: 'password123' });
    if (data?.user?.id) {
       console.log(`-- ${u}`);
       const role = u.split('@')[0];
       console.log(`INSERT INTO profiles (id, role, nama_lengkap) VALUES ('${data.user.id}', '${role}', '${role} user') ON CONFLICT (id) DO UPDATE SET role = '${role}';`);
    }
  }
}
getUsers();
