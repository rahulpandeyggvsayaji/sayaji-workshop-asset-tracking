
import { ReactNode } from 'react'
export default function Card({title,children,footer}:{title:string;children:ReactNode;footer?:ReactNode}){
  return (
    <div className="bg-white rounded-2xl shadow p-4 border">
      <div className="font-semibold mb-2 text-gray-800">{title}</div>
      <div>{children}</div>
      {footer && <div className="pt-3 mt-3 border-t">{footer}</div>}
    </div>
  )
}
