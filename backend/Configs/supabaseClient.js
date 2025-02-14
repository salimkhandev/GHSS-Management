const { createClient } = require('@supabase/supabase-js');
// Replace with your Supabase project details
const supabaseUrl = 'https://tincbebbtpaavhpdxetz.supabase.co'; // Replace with your project URL
const anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpbmNiZWJidHBhYXZocGR4ZXR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzEwMDc5MywiZXhwIjoyMDM4Njc2NzkzfQ.-YtohH5QKsJgRfGu3lo3jlmGkPggj-jA8LIzDtL_nbE';
const supabase = createClient(supabaseUrl, anon);
// export it
module.exports = supabase;