import { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { StudioPage } from './components/StudioPage';

function currentView(){return window.location.pathname.startsWith('/studio')?'studio':'landing'}
export default function App(){
 const [view,setView]=useState<'landing'|'studio'>(currentView());
 useEffect(()=>{const f=()=>setView(currentView());window.addEventListener('popstate',f);return()=>window.removeEventListener('popstate',f)},[]);
 const go=(next:'landing'|'studio')=>{window.history.pushState({},'',next==='studio'?'/studio':'/');setView(next);window.scrollTo({top:0,behavior:'auto'})};
 return view==='studio'?<StudioPage onGoHome={()=>go('landing')}/>:<LandingPage onEnterStudio={()=>go('studio')}/>;
}
