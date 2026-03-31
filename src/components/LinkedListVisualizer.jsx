import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Activity } from 'lucide-react';

const LL_CODE = [
  "class LinkedList {",
  "  insertHead(value) {",
  "    const newNode = new Node(value);",
  "    newNode.next = this.head;",
  "    this.head = newNode;",
  "    if (!this.tail) this.tail = newNode;",
  "  }",
  "  insertTail(value) {",
  "    const newNode = new Node(value);",
  "    if (!this.head) {",
  "      this.head = newNode; this.tail = newNode;",
  "    } else {",
  "      this.tail.next = newNode;",
  "      this.tail = newNode;",
  "    }",
  "  }",
  "  deleteHead() {",
  "    if (!this.head) return;",
  "    this.head = this.head.next;",
  "    if (!this.head) this.tail = null;",
  "  }",
  "  deleteTail() {",
  "    if (!this.head) return;",
  "    if (this.head === this.tail) {",
  "      this.head = null; this.tail = null; return;",
  "    }",
  "    let curr = this.head;",
  "    while (curr.next !== this.tail) curr = curr.next;",
  "    curr.next = null;",
  "    this.tail = curr;",
  "  }",
  "}"
];

export default function LinkedListVisualizer() {
  const [list, setList] = useState([]); // Simplified to array for visual mapping
  const [inputValue, setInputValue] = useState('');
  const [activeLines, setActiveLines] = useState([]);
  const [message, setMessage] = useState("Select a Linked List operation.");
  const [variables, setVariables] = useState({});

  useEffect(() => {
    if (activeLines.length > 0) {
      const timer = setTimeout(() => {
        setActiveLines([]);
        setVariables({});
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [activeLines]);

  const insertHead = () => {
      let val = inputValue.trim() || Math.floor(Math.random() * 100).toString();
      if (list.length >= 8) return setMessage("List is full (max 8) for visualization.");
      
      setActiveLines([2, 3, 4, 5]);
      setVariables({ value: val, 'new_head': val });
      setMessage(`Inserted ${val} at the Head. The new node points to the old head.`);
      setList([val, ...list]);
      setInputValue('');
  };

  const insertTail = () => {
      let val = inputValue.trim() || Math.floor(Math.random() * 100).toString();
      if (list.length >= 8) return setMessage("List is full (max 8) for visualization.");
      
      setActiveLines([8, 9, 12, 13]);
      setVariables({ value: val, 'old_tail.next': val, 'new_tail': val });
      setMessage(`Inserted ${val} at the Tail. The old tail now points to this new node.`);
      setList([...list, val]);
      setInputValue('');
  };

  const deleteHead = () => {
      if (list.length === 0) return setMessage("List is already empty.");
      
      const removed = list[0];
      setActiveLines([17, 18, 19]);
      setVariables({ removed_val: removed, 'new_head': list[1] || 'null' });
      setMessage(`Deleted the Head node (${removed}). The head pointer shifts to the next node.`);
      setList(list.slice(1));
  };

  const deleteTail = () => {
      if (list.length === 0) return setMessage("List is already empty.");
      
      const removed = list[list.length - 1];
      setActiveLines([22, 26, 27, 28, 29]);
      setVariables({ removed_val: removed, 'new_tail': list[list.length - 2] || 'null' });
      setMessage(`Deleted the Tail node (${removed}) by traversing to the second-to-last node and severing its pointer.`);
      setList(list.slice(0, -1));
  };

  return (
    <div className="app-layout">
      <div className="control-bar stack-controls" style={{background: 'rgba(30, 41, 59, 0.9)', zIndex: 100}}>
        <div className="brand" style={{background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)', WebkitBackgroundClip: 'text'}}>
          <Activity size={24} color="#f43f5e" />
          <span>Linked List Visualizer</span>
        </div>
        
        <div className="controls-group">
            <div className="input-group" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                   <label>Node Value</label>
                   <input 
                      type="text" 
                      value={inputValue} 
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Random"
                      className="custom-input"
                      style={{width: '70px'}}
                  />
                </div>
                
                <button className="btn btn-primary" onClick={insertHead} style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none'}}>
                    Insert Head
                </button>
                <button className="btn btn-primary" onClick={insertTail} style={{background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)', border: 'none'}}>
                    Insert Tail
                </button>
                <div style={{width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)', margin: '0 0.5rem'}}></div>
                <button className="btn btn-danger" onClick={deleteHead} style={{background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e'}}>
                    Del Head
                </button>
                <button className="btn btn-danger" onClick={deleteTail} style={{background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e'}}>
                    Del Tail
                </button>
            </div>
        </div>
        
        <div className="controls-group">
            <button className="btn" onClick={() => setList([])}>
                <RotateCcw size={16} /> Clear
            </button>
        </div>
      </div>

      <div className="main-content">
          <div className="visualizer-container ll-container" style={{alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
            
            <div className="stats-overlay" style={{top: '1rem', left: '1rem'}}>
                <div className="stat-row">
                    <span className="stat-label">Nodes</span>
                    <span className="stat-value">{list.length}</span>
                </div>
                <div className="stat-row">
                    <span className="stat-label">Head</span>
                    <span className="stat-value" style={{color: '#10b981'}}>{list[0] || 'null'}</span>
                </div>
                <div className="stat-row">
                    <span className="stat-label">Tail</span>
                    <span className="stat-value" style={{color: '#818cf8'}}>{list[list.length - 1] || 'null'}</span>
                </div>
            </div>
            
            <div className="ll-canvas">
                {list.length === 0 && (
                    <div className="empty-text">List is empty. head -&gt; null</div>
                )}
                
                {list.length > 0 && <div className="ll-pointer head-pointer" style={{color: '#10b981', fontWeight: 'bold', marginRight: '1rem', display: 'flex', alignItems: 'center'}}>HEAD &rarr;</div>}
                
                {list.map((val, idx) => {
                    const isHead = idx === 0;
                    const isTail = idx === list.length - 1;
                    
                    return (
                        <div key={idx} style={{display: 'flex', alignItems: 'center'}}>
                            <div className="ll-node-wrapper slide-in">
                                {isHead && <span className="ll-badge badge-head">HEAD</span>}
                                {isTail && !isHead && <span className="ll-badge badge-tail">TAIL</span>}
                                {isHead && isTail && <span className="ll-badge badge-tail" style={{top: '-45px'}}>TAIL</span>}
                                
                                <div className="ll-node data-box">
                                    <span className="ll-val">{val}</span>
                                    <span className="ll-next-dot"></span>
                                </div>
                            </div>
                            
                            {/* Pointer Arrow */}
                            <div className="ll-pointer arrow">
                                <div className="arrow-line"></div>
                                <div className="arrow-head"></div>
                            </div>
                        </div>
                    );
                })}
                
                {list.length > 0 && (
                   <div className="ll-node null-node slide-in">null</div>
                )}
            </div>
            
          </div>

          <aside className="teacher-sidebar">
              <div className="sidebar-header">
                  <h3>Linked List Operations</h3>
              </div>
              
              <div className="code-block" style={{maxHeight: '40vh', overflowY: 'auto'}}>
                  {LL_CODE.map((line, idx) => (
                      <div key={idx} className={`code-line ${activeLines.includes(idx) ? 'active-line' : ''}`}>
                          <span className="line-num">{idx + 1}</span>
                          <pre>{line}</pre>
                      </div>
                  ))}
              </div>

              <div className="teacher-panel">
                  <div className="teacher-message">
                      <span className="badge">Execution Trace</span>
                      <p>{message}</p>
                  </div>
                  
                  <div className="variables-watch">
                       <span className="badge">Variables Tracker</span>
                       <div className="var-grid">
                           {Object.entries(variables).map(([key, val]) => (
                               <div key={key} className="var-box">
                                   <span className="var-name">{key}</span>
                                   <span className="var-val">{val}</span>
                               </div>
                           ))}
                           {Object.keys(variables).length === 0 && (
                               <div className="var-box" style={{gridColumn: 'span 2', textAlign: 'center', opacity: 0.5}}>Waiting for operation...</div>
                           )}
                       </div>
                  </div>
              </div>
          </aside>
      </div>
    </div>
  );
}
