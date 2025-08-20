
'use client'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabaseClient'
import { Plant, PlantLocation, Person, SparePart, Asset } from '../types'
import Select from './Select'

export function ReceiveForm({asset, plants, locations, personnel, onDone}:{asset:Asset; plants:Plant[]; locations:PlantLocation[]; personnel:Person[]; onDone:()=>void}){
  const {register, handleSubmit, setValue, watch} = useForm()
  const [plantId,setPlantId] = [watch('plant_id'),(v:string)=>setValue('plant_id',v)] as any
  const locs = locations.filter(l=>l.plant_id===plantId)
  return (
    <form className="space-y-3" onSubmit={handleSubmit(async (vals:any)=>{
      await supabase.from('asset_events').insert({
        asset_id: asset.id,
        event_type: 'RECEIVED',
        receiving_plant_id: vals.plant_id,
        receiving_location_id: vals.location_id,
        received_by: vals.received_by,
        received_notes: vals.received_notes
      })
      onDone()
    })}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Receiving plant</label>
          <Select options={plants.map(p=>({value:p.id,label:p.name}))} value={plantId} onChange={setPlantId} placeholder="Select plant"/>
        </div>
        <div>
          <label className="text-sm">Receiving location</label>
          <Select options={locs.map(l=>({value:l.id,label:l.name}))} value={watch('location_id')} onChange={(v)=>setValue('location_id',v)} placeholder="Select location"/>
        </div>
        <div>
          <label className="text-sm">Received by</label>
          <Select options={personnel.map(p=>({value:p.id,label:p.full_name}))} value={watch('received_by')} onChange={(v)=>setValue('received_by',v)} placeholder="Select person"/>
        </div>
        <div className="col-span-2">
          <label className="text-sm">Notes</label>
          <textarea {...register('received_notes')} className="w-full border rounded-xl p-2" placeholder="Optional"/>
        </div>
      </div>
      <button className="px-4 py-2 rounded-xl bg-black text-white">Save</button>
    </form>
  )
}

export function UnderRepairForm({asset, spareParts, personnel, onDone}:{asset:Asset; spareParts:SparePart[]; personnel:Person[]; onDone:()=>void}){
  const {register, handleSubmit, setValue, watch} = useForm()
  return (
    <form className="space-y-3" onSubmit={handleSubmit(async (vals:any)=>{
      const spares = (vals.spares_text||'').split('\n').map((line:string)=>{
        const [name,qty] = line.split(':').map((s:string)=>s.trim())
        if(!name) return null; return { name, qty: Number(qty||1) }
      }).filter(Boolean)
      await supabase.from('asset_events').insert({
        asset_id: asset.id,
        event_type: 'UNDER_REPAIR',
        issue_observed: vals.issue_observed,
        action_taken: vals.action_taken,
        spares,
        repaired_by: vals.repaired_by
      })
      onDone()
    })}>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-sm">Issue Observed</label>
          <textarea {...register('issue_observed')} className="w-full border rounded-xl p-2" required />
        </div>
        <div className="col-span-2">
          <label className="text-sm">Action Taken</label>
          <textarea {...register('action_taken')} className="w-full border rounded-xl p-2" required />
        </div>
        <div className="col-span-2">
          <label className="text-sm">Spare Parts (one per line, e.g. \"Bearing 6202:2\")</label>
          <textarea {...register('spares_text')} className="w-full border rounded-xl p-2" placeholder="Name:Qty"/>
        </div>
        <div>
          <label className="text-sm">Repaired By</label>
          <Select options={personnel.map(p=>({value:p.id,label:p.full_name}))} value={watch('repaired_by')} onChange={(v)=>setValue('repaired_by',v)} placeholder="Select person"/>
        </div>
      </div>
      <button className="px-4 py-2 rounded-xl bg-black text-white">Save</button>
    </form>
  )
}

export function ReadyForm({asset, onDone}:{asset:Asset; onDone:()=>void}){
  const {register, handleSubmit} = useForm()
  return (
    <form className="space-y-3" onSubmit={handleSubmit(async (vals:any)=>{
      await supabase.from('asset_events').insert({
        asset_id: asset.id,
        event_type: 'READY',
        ready_notes: vals.ready_notes
      })
      onDone()
    })}>
      <label className="text-sm">Notes</label>
      <textarea {...register('ready_notes')} className="w-full border rounded-xl p-2" placeholder="Optional"/>
      <button className="px-4 py-2 rounded-xl bg-black text-white">Save</button>
    </form>
  )
}

export function IssuedForm({asset, plants, locations, personnel, onDone}:{asset:Asset; plants:Plant[]; locations:PlantLocation[]; personnel:Person[]; onDone:()=>void}){
  const {register, handleSubmit, setValue, watch} = useForm()
  const [plantId,setPlantId] = [watch('issued_plant_id'),(v:string)=>setValue('issued_plant_id',v)] as any
  const locs = locations.filter(l=>l.plant_id===plantId)
  return (
    <form className="space-y-3" onSubmit={handleSubmit(async (vals:any)=>{
      await supabase.from('asset_events').insert({
        asset_id: asset.id,
        event_type: 'ISSUED',
        issued_plant_id: vals.issued_plant_id,
        issued_location_id: vals.issued_location_id,
        issued_by: vals.issued_by,
        issued_notes: vals.issued_notes
      })
      onDone()
    })}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Issued Plant</label>
          <Select options={plants.map(p=>({value:p.id,label:p.name}))} value={plantId} onChange={setPlantId} placeholder="Select plant"/>
        </div>
        <div>
          <label className="text-sm">Issued Plant Location</label>
          <Select options={locs.map(l=>({value:l.id,label:l.name}))} value={watch('issued_location_id')} onChange={(v)=>setValue('issued_location_id',v)} placeholder="Select location"/>
        </div>
        <div>
          <label className="text-sm">Issued By</label>
          <Select options={personnel.map(p=>({value:p.id,label:p.full_name}))} value={watch('issued_by')} onChange={(v)=>setValue('issued_by',v)} placeholder="Select person"/>
        </div>
        <div className="col-span-2">
          <label className="text-sm">Notes</label>
          <textarea {...register('issued_notes')} className="w-full border rounded-xl p-2" placeholder="Optional"/>
        </div>
      </div>
      <button className="px-4 py-2 rounded-xl bg-black text-white">Save</button>
    </form>
  )
}
