async function getOpenAPI() {
  const res = await fetch("https://guglipcudxmvizjwaywv.supabase.co/rest/v1/?apikey=sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee");
  const data = await res.json();
  console.log("Tables available:", Object.keys(data.definitions || {}));
}
getOpenAPI();
