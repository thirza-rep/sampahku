import { createClient } from '@supabase/supabase-js';
const supabase = createClient("https://guglipcudxmvizjwaywv.supabase.co", "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee");

async function run() {
  const { data, error } = await supabase
    .rpc('admin_get_users'); // Wait, I can't do raw SQL via client
  console.log("We need to use PostgREST schema introspection");
}
run();
