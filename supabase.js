import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://vywmydbojxjbropdasik.supabase.co' // Your Project URL
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5d215ZGJvanhqYnJvcGRhc2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NzM1MTAsImV4cCI6MjEwNjI0OTUxMH0.QCToh05QaIVII6AZdJoUKx-vC_vhfce11GfdR6voWUM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
