
'use client'
import React from 'react'
import { supabase } from '../lib/supabaseClient'

export default function History(){
  const [tag,setTag] = React.useState('')
  const [rows,setRows] = React.useState<any[]>([])
  const search = async ()=>{
    const {data:asset} = await supabase.from('assets').select('id,tag').eq('tag', tag).maybeSingle()
    if(!asset){ setRows([]); return }
    const {data} = await supabase.from('asset_events').select('*').eq('asset_id', asset.id).order('event_time', {ascending:false})
    setRows(data||[])
  }
  return (
    <div className="bg-white border rounded-2xl p-4">
      <div className="flex gap-2 items-center">
        <input value={tag} onChange={e=>setTag(e.target.value)} placeholder="Enter Tag number" className="border rounded-xl px-3 py-2"/>
        <button onClick={search} className="px-3 py-2 rounded-xl bg-black text-white">Search</button>
      </div>
      <div className="mt-4 space-y-2 max-h-80 overflow-auto">
        {rows.map((r)=> (
          <div key={r.id} className="border rounded-xl p-3">
            <div className="text-sm text-gray-500">{new Date(r.event_time).toLocaleString()} · {r.event_type}</div>
            {r.issue_observed && <div><span className="font-medium">Issue:</span> {r.issue_observed}</div>}
            {r.action_taken && <div><span className="font-medium">Action:</span> {r.action_taken}</div>}
            {r.spares && <div><span className="font-medium">Spares:</span> {JSON.stringify(r.spares)}</div>}
            {r.received_notes && <div><span className="font-medium">Notes:</span> {r.received_notes}</div>}
            {r.ready_notes && <div><span className="font-medium">Notes:</span> {r.ready_notes}</div>}
            {r.issued_notes && <div><span className="font-medium">Notes:</span> {r.issued_notes}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
