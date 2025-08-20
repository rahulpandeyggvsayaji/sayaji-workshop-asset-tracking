
export type AssetStatus = 'RECEIVED'|'UNDER_REPAIR'|'READY'|'ISSUED'
export type Asset = {
  id: string; tag: string; category?: string|null; model?: string|null; item_code?: string|null; item_name?: string|null; equipment?: string|null;
}
export type BoardItem = Asset & { status: AssetStatus|null; status_time?: string|null; issued_plant_id?: string|null; issued_location_id?: string|null }
export type Plant = { id: string; name: string }
export type PlantLocation = { id: string; plant_id: string; name: string }
export type Person = { id: string; full_name: string }
export type SparePart = { id: string; name: string; item_code?: string|null; uom?: string|null; qty: number }
