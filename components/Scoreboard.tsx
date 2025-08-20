
'use client'
import React from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Scoreboard(){
  const [rows,setRows] = React.useState<{plant:string; in_use:number}[]>([])
  const load = async ()=>{
    const {data} = await supabase.from('assets_in_use_by_plant').select('*')
    setRows(data||[])
  }
  React.useEffect(()=>{ load();
    const channel = supabase.channel('scoreboard')
      .on('postgres_changes', {event:'*', schema:'public', table:'asset_events'}, load)
      .subscribe()
    return ()=>{ supabase.removeChannel(channel) }
  },[])
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {rows.map((r)=> (
        <div key={r.plant} className="bg-white border rounded-2xl p-4 text-center">
          <div className="text-sm text-gray-500">{r.plant}</div>
          <div className="text-2xl font-bold">{r.in_use}</div>
        </div>
      ))}
    </div>
  )
}
