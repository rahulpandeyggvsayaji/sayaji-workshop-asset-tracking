
'use client'
import React from 'react'
import Scoreboard from '../components/Scoreboard'
import Kanban from '../components/Kanban'
import History from '../components/History'
import Card from '../components/Card'
import { supabase } from '../lib/supabaseClient'

export default function Page(){
  const [assetsCount,setAssetsCount] = React.useState(0)
  React.useEffect(()=>{
    supabase.from('assets').select('*', {count: 'exact', head: true}).then(({count})=>setAssetsCount(count||0))
  },[])
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-2">Workshop assets in use</h2>
        <Scoreboard/>
      </section>

      <Kanban/>

      <section>
        <h2 className="text-lg font-semibold mb-2">Asset History by Tag number</h2>
        <History/>
      </section>

      <section className="grid md:grid-cols-3 gap-4" id="all-issued">
        <Card title="Asset Repository">
          <a className="underline" href="#" onClick={async (e)=>{e.preventDefault();
            const tag = prompt('New asset tag no.?'); if(!tag) return;
            await supabase.from('assets').insert({tag})
            alert('Asset created. Use Kanban to set status.')
          }}>Add new asset</a>
        </Card>
        <Card title="Plant & Plant location repository">
          <a className="underline" href="#" onClick={async (e)=>{e.preventDefault();
            const name = prompt('New plant name?'); if(!name) return;
            await supabase.from('plants').insert({name})
            alert('Plant added')
          }}>Add plant</a>
          <div className="mt-2"/>
          <a className="underline" href="#" onClick={async (e)=>{e.preventDefault();
            const plants = (await supabase.from('plants').select('id,name').order('name')).data||[]
            const first = plants[0]
            const name = prompt('New location name?'); if(!name || !first) return;
            await supabase.from('plant_locations').insert({plant_id:first.id, name})
            alert('Location added to '+first.name)
          }}>Add location</a>
        </Card>
        <Card title="Personnel Repository">
          <a className="underline" href="#" onClick={async (e)=>{e.preventDefault();
            const name = prompt('Person full name?'); if(!name) return;
            await supabase.from('personnel').insert({full_name:name})
            alert('Person added')
          }}>Add person</a>
        </Card>
      </section>
    </div>
  )
}
