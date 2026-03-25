import { createClient } from '@supabase/supabase-js'
import util from 'util'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data: room } = await supabase.from('rooms').select('id, property_id').limit(1).single()
  if (!room) return console.log('No rooms')

  const { error } = await supabase.from('bookings').insert({
    property_id: room.property_id,
    room_id: room.id,
    user_id: '450a7bbb-a6f8-4cb6-abf2-9f686ca9964c',
    check_in: '2025-06-01',
    check_out: '2025-06-05',
    guests: 1,
    total_price: 300,
    status: 'confirmed'
  })

  if (error) {
    console.log('FULL ERROR:', util.inspect(error, { depth: null, colors: false }))
  } else {
    console.log('SUCCESS')
  }
}

test()
