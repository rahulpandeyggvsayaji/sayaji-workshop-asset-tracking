
'use client'
import React from 'react'
import { supabase } from '../lib/supabaseClient'
import { BoardItem, Asset, Plant, PlantLocation, Person } from '../types'
import AssetCard from './AssetCard'
import Card from './Card'
import { Modal } from './Modals'
import { ReceiveForm, UnderRepairForm, ReadyForm, IssuedForm } from './Forms'

function Column({title, items, onOpen}:{title:string; items:BoardItem[]; onOpen:(a:Asset)=>void}){
  return (
    <Card title={title}>
      <div className="space-y-2">
        {items.map(x=> <AssetCard key={x.id} item={x as any} onClick={()=>onOpen(x as any)}/>) }
      </div>
    </Card>
  )
}

export default function Kanban(){
  const [board,setBoard] = React.useState<BoardItem[]>([])
  const [plants,setPlants] = React.useState<Plant[]>([])
  const [locations,setLocations] = React.useState<PlantLocation[]>([])
  const [people,setPeople] = React.useState<Person[]>([])
  const [modal,setModal] = React.useState<null | {asset:Asset; mode:'RECEIVED'|'UNDER_REPAIR'|'READY'|'ISSUED'}>(null)

  const load = async ()=>{
    const {data:boardRows} = await supabase.from('asset_board').select('*').order('status_time', {ascending:false})
    setBoard((boardRows||[]) as any)
    const [p,l,pr] = await Promise.all([
      supabase.from('plants').select('*').order('name'),
      supabase.from('plant_locations').select('*').order('name'),
      supabase.from('personnel').select('id,full_name').eq('active', true).order('full_name')
    ])
    setPlants(p.data||[]); setLocations(l.data||[]); setPeople(pr.data||[])
  }

  React.useEffect(()=>{ load();
    const ch = supabase.channel('kanban')
      .on('postgres_changes', {event:'*', schema:'public', table:'asset_events'}, load)
      .on('postgres_changes', {event:'*', schema:'public', table:'assets'}, load)
      .subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  },[])

  const openFor = (asset:Asset)=>{
    const status = board.find((b:any)=>b.id===asset.id)?.status || 'RECEIVED'
    const next = status==='RECEIVED' ? 'UNDER_REPAIR' : status==='UNDER_REPAIR' ? 'READY' : 'ISSUED'
    setModal({asset, mode: next as any})
  }

  const by = (s:any)=> board.filter((b:any)=>b.status===s)
  const issued = by('ISSUED').slice(0,6)

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Column title="Asset Receive by workshop" items={by('RECEIVED') as any} onOpen={openFor} />
      <Column title="Asset Under Repair" items={by('UNDER_REPAIR') as any} onOpen={openFor} />
      <Column title="Asset Ready" items={by('READY') as any} onOpen={openFor} />
      <Card title="Asset Issued" footer={<a href="#all-issued" className="text-sm">See all the issued</a>}>
        <div className="space-y-2">
          {issued.map((x:any)=> <AssetCard key={x.id} item={x} onClick={()=>{}}/>) }
        </div>
      </Card>

      <Modal open={!!modal} onClose={()=>{ setModal(null); }} title={modal?`Update ${modal.asset.tag} → ${modal.mode.replace('_',' ')}`:''}>
        {modal?.mode==='RECEIVED' && <ReceiveForm asset={modal.asset} plants={plants} locations={locations} personnel={people} onDone={()=>{ setModal(null); load() }} />}
        {modal?.mode==='UNDER_REPAIR' && <UnderRepairForm asset={modal.asset} spareParts={[]} personnel={people} onDone={()=>{ setModal(null); load() }} />}
        {modal?.mode==='READY' && <ReadyForm asset={modal.asset} onDone={()=>{ setModal(null); load() }} />}
        {modal?.mode==='ISSUED' && <IssuedForm asset={modal.asset} plants={plants} locations={locations} personnel={people} onDone={()=>{ setModal(null); load() }} />}
      </Modal>
    </div>
  )
}
