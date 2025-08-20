
'use client'
import { BoardItem } from '../types'
export default function AssetCard({item, onClick}:{item:BoardItem; onClick?:()=>void}){
  return (
    <button onClick={onClick} className="w-full text-left border rounded-xl p-3 bg-white hover:shadow transition">
      <div className="text-sm text-gray-500">{item.category} · {item.model}</div>
      <div className="text-lg font-semibold">{item.tag}</div>
      <div className="text-xs text-gray-500 mt-1">{item.item_name || item.equipment || item.item_code}</div>
    </button>
  )
}
