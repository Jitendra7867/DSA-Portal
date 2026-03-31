import React, { useState } from 'react';
import SidebarNav from './components/SidebarNav';
import SortingVisualizer from './components/SortingVisualizer';
import StackQueueVisualizer from './components/StackQueueVisualizer';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import TreeVisualizer from './components/TreeVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import Resources from './components/Resources';
import './index.css';

function App() {
  const [activeModule, setActiveModule] = useState('sorting');

  return (
    <div className="portal-layout">
      <SidebarNav activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <main className="portal-main">
        {activeModule === 'sorting' && <SortingVisualizer />}
        {activeModule === 'stack_queue' && <StackQueueVisualizer />}
        {activeModule === 'linked_list' && <LinkedListVisualizer />}
        {activeModule === 'trees' && <TreeVisualizer />}
        {activeModule === 'graphs' && <GraphVisualizer />}
        {activeModule === 'resources' && <Resources />}
      </main>
    </div>
  );
}

export default App;
