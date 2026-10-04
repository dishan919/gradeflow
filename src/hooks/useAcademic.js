import {useState} from 'react';
import * as storage from '../services/storage';
export function useAcademic(user) {
 const [semesters,setSemesters]=useState(()=>storage.getSemesters(user.id));
 const [scale,setScale]=useState(()=>storage.getScale(user.id));
 const update=data=>{storage.saveSemesters(user.id,data);setSemesters(data);};
 return {semesters,scale,save:semester=>update([...semesters.filter(s=>s.id!==semester.id),semester]),remove:id=>update(semesters.filter(s=>s.id!==id)),clear:()=>update([]),updateScale:data=>{storage.saveScale(user.id,data);setScale(data);}};
}
