import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWarga() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'warga@webgis.com',
    password: 'password123'
  });

  const { data: sampahData, error: sampahErr } = await supabase.rpc('get_sampah_lokasi');
  console.log("Warga Sampah Err:", sampahErr);
}

checkWarga();
