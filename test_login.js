import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@webgis.com',
    password: 'password123'
  });

  if (authErr) {
    console.log("Login error:", authErr.message);
    return;
  }

  const { data: roleData, error: roleErr } = await supabase.rpc('get_my_role');
  console.log("Role untuk admin@webgis.com:", roleData);
}

testLogin();
