import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Manual .env.local parsing for standalone script
if (fs.existsSync('.env.local')) {
  const envFile = fs.readFileSync('.env.local', 'utf8')
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    const value = valueParts.join('=')
    if (key && value) process.env[key.trim()] = value.trim()
  })
}

async function testFetch() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('--- Testing Supabase Connection ---')
  console.log('URL:', supabaseUrl)
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing environment variables!')
    return
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    console.log('\n--- Fetching Properties with Joined Rooms (Exact App Logic) ---')
    const { data: joinedData, error: joinError } = await supabase
      .from('properties')
      .select(`
        *,
        rooms (price_per_night, capacity),
        reviews (rating)
      `)
      .eq('status', 'approved')
    
    if (joinError) {
      console.error('Error fetching joined data:', joinError.message)
    } else {
      console.log(`Found ${joinedData?.length || 0} approved properties.`)
      joinedData?.forEach((p: any) => {
        console.log(` - ${p.name}: ${p.rooms?.length || 0} rooms found.`)
        if (p.rooms?.length === 0) {
          console.warn(`   WARNING: ${p.name} has NO rooms and will be filtered out by the UI!`)
        } else {
          const roomPrices = p.rooms?.map((r: any) => r.price_per_night) || []
          console.log(`   Prices: [${roomPrices.join(', ')}]`)
        }
      })
    }

    console.log('\n--- Checking for ANY properties (all statuses) ---')
    const { data: allProps, error: propError } = await supabase
      .from('properties')
      .select('id, name, status')
      .limit(5)
    
    if (propError) {
      console.error('Error fetching properties:', propError.message)
    } else {
      console.log(`Total properties found in table (all statuses, max 5): ${allProps?.length || 0}`)
      allProps?.forEach(p => console.log(` - ${p.name} [${p.status}]`))
    }

    console.log('\n--- Checking for Profiles ---')
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .limit(5)
    
    if (profError) {
      // profError.message is likely a permission error due to RLS
      console.log('Profile fetch result:', profError.message)
    } else {
      console.log(`Found ${profiles?.length || 0} profiles:`)
      profiles?.forEach(p => console.log(` - ${p.full_name} [${p.role}]`))
    }

  } catch (err: any) {
    console.error('\nUNEXPECTED ERROR:', err.message)
  }
}

testFetch()
