import {NavLink,Outlet} from 'react-router-dom';
import {House,Calculator,Layers,TrendingUp,UserRound,LockKeyhole} from 'lucide-react';
import {Brand} from './UI';
const links=[['/',House,'Home'],['/calculator',Calculator,'Calculator'],['/history',Layers,'History'],['/planner',TrendingUp,'Planner'],['/profile',UserRound,'Profile']];
export default function Layout(){return <div className="app-shell"><div className="topbar"><Brand/><span className="local-badge"><LockKeyhole size={12}/> ON YOUR DEVICE</span></div><main><Outlet/></main><nav className="bottom-nav" aria-label="Main navigation">{links.map(([to,Icon,label])=><NavLink key={to} to={to} end={to==='/'}><Icon size={21}/><span>{label}</span></NavLink>)}</nav></div>}
