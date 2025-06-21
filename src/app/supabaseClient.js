import { createClient } from '@supabase/supabase-js';

      
/*
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
*/
export const supabase = createClient(
 "https://tmnsjojcksjeociimree.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtbnNqb2pja3NqZW9jaWltcmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMDkyMzcsImV4cCI6MjA2NTc4NTIzN30.NXK17YWX4MYibxV92xn2XU8YR-k6KABopp0ZTPUVfiA"
)

