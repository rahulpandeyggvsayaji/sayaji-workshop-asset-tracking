
'use client'
import React from 'react'
export function Modal({open,onClose,children,title}:{open:boolean; onClose:()=>void; children:React.ReactNode; title:string}){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm px-3 py-1 rounded-full border">Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}
