
'use client'
import React from 'react'
type Opt = { value: string; label: string }
export default function Select({options, value, onChange, placeholder}:{options:Opt[]; value?:string; onChange:(v:string)=>void; placeholder?:string}){
  const [q,setQ] = React.useState('')
  const filtered = React.useMemo(()=> options.filter(o=>o.label.toLowerCase().includes(q.toLowerCase())),[q,options])
  return (
    <div className="border rounded-xl p-2 shadow-sm bg-white">
      <input className="w-full outline-none" placeholder={placeholder||'Search...'} value={q} onChange={e=>setQ(e.target.value)} />
      <div className="max-h-48 overflow-auto mt-2 space-y-1">
        {filtered.map(o=> (
          <button key={o.value} className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${value===o.value?'bg-gray-100':''}`} onClick={()=>onChange(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  )
}
