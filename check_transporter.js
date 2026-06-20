import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTransporter() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'transporter@webgis.com',
    password: 'password123'
  });

  if (authErr) {
    console.log("Login error:", authErr.message);
    return;
  }

  const { data: roleData } = await supabase.rpc('get_my_role');
  console.log("Role:", roleData);

  const { data: sampahData, error: sampahErr } = await supabase.rpc('get_sampah_lokasi');
  console.log("Sampah Data:", sampahData);
  if (sampahErr) console.log("Sampah Err:", sampahErr);
}

checkTransporter();
