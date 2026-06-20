import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log("Data di tabel profiles:");
  console.log(data, error);
}

checkProfiles();
