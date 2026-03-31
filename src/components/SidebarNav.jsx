import React from 'react';
import { 
  BarChart2, 
  Layers, 
  Share2, 
  Network, 
  GitCommit, 
  Cpu,
  DownloadCloud
} from 'lucide-react';

const navItems = [
  { id: 'sorting', label: 'Sorting', icon: <BarChart2 size={20} />, active: true },
  { id: 'stack_queue', label: 'Stacks & Queues', icon: <Layers size={20} />, active: true },
  { id: 'linked_list', label: 'Linked Lists', icon: <GitCommit size={20} />, active: true },
  { id: 'trees', label: 'Trees', icon: <Share2 size={20} style={{transform: 'rotate(90deg)'}} />, active: true },
  { id: 'graphs', label: 'Graphs', icon: <Network size={20} />, active: true },
  { id: 'dp', label: 'DP', icon: <Cpu size={20} />, active: false },
  { id: 'resources', label: 'Resources', icon: <DownloadCloud size={20} />, active: true },
];

export default function SidebarNav({ activeModule, setActiveModule }) {
  return (
    <nav className="global-nav">
      <div className="nav-brand">
        <h1>DSA Portal</h1>
      </div>
      
      <div className="nav-links">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${activeModule === item.id ? 'active' : ''} ${!item.active ? 'disabled' : ''}`}
            onClick={() => item.active && setActiveModule(item.id)}
            disabled={!item.active}
            title={!item.active ? 'Coming Soon' : item.label}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
            {!item.active && <span className="coming-soon">Soon</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}
