import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  try {
    console.log('📦 Reading migration file...')
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql')
    const sql = readFileSync(migrationPath, 'utf-8')

    console.log('🚀 Running migration...')
    console.log('\n⚠️  Note: This requires a Service Role Key, not Anon Key.')
    console.log('Please run this SQL manually in Supabase Dashboard:\n')
    console.log('https://supabase.com/dashboard/project/hsiqxdsedrxwhnzvkweg/sql/new\n')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

runMigration()