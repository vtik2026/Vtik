const SUPABASE_URL = "https://jkdqrjshgoofcmpyizfm.supabase.co"

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZHFyanNoZ29vZmNtcHlpemZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzI5MjQsImV4cCI6MjA4OTEwODkyNH0.RmQHVFb2MponYT-BxSgdLueYbkTOM33QRLJrU5AvWVM"

window.supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)
