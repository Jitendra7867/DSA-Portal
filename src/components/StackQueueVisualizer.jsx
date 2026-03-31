import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Activity } from 'lucide-react';

const STACK_CODE = [
  "class Stack {",
  "  push(value) {",
  "    this.items.push(value);",
  "  }",
  "  pop() {",
  "    if (this.isEmpty()) return null;",
  "    return this.items.pop();",
  "  }",
  "  peek() {",
  "    if (this.isEmpty()) return null;",
  "    return this.items[this.items.length - 1];",
  "  }",
  "  isEmpty() {",
  "    return this.items.length === 0;",
  "  }",
  "  getSize() {",
  "    return this.items.length;",
  "  }",
  "}"
];

const QUEUE_CODE = [
  "class Queue {",
  "  enqueue(value) {",
  "    this.items.push(value);",
  "  }",
  "  dequeue() {",
  "    if (this.isEmpty()) return null;",
  "    return this.items.shift();",
  "  }",
  "  peek() {",
  "    if (this.isEmpty()) return null;",
  "    return this.items[0];",
  "  }",
  "  isEmpty() {",
  "    return this.items.length === 0;",
  "  }",
  "  getSize() {",
  "    return this.items.length;",
  "  }",
  "}"
];

export default function StackQueueVisualizer() {
  const [mode, setMode] = useState('stack');
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeLines, setActiveLines] = useState([]);
  const [message, setMessage] = useState("Select an operation to begin.");
  const [variables, setVariables] = useState({});

  const containerRef = useRef(null);

  useEffect(() => {
    if (activeLines.length > 0) {
      const timer = setTimeout(() => {
        setActiveLines([]);
        setVariables({});
      }, 2000); // 2000ms duration for traces
      return () => clearTimeout(timer);
    }
  }, [activeLines]);

  const handlePushEnqueue = () => {
    let val = inputValue.trim();
    if (!val) val = Math.floor(Math.random() * 100).toString();
    
    if (items.length >= 10) {
      setMessage(`Container is full! Cannot ${mode === 'stack' ? 'push' : 'enqueue'}.`);
      return;
    }

    if (mode === 'stack') {
      setActiveLines([2]);
      setVariables({ value: val, stack_size: items.length + 1 });
      setMessage(`Pushing ${val} onto the top of the Stack.`);
      setItems([...items, val]);
    } else {
      setActiveLines([2]);
      setVariables({ value: val, queue_size: items.length + 1 });
      setMessage(`Enqueueing ${val} to the back of the Queue.`);
      setItems([...items, val]);
    }
    setInputValue('');
  };

  const handlePopDequeue = () => {
    if (items.length === 0) {
      setMessage(`Container is empty! Cannot ${mode === 'stack' ? 'pop' : 'dequeue'}.`);
      setActiveLines(mode === 'stack' ? [5] : [5]);
      return;
    }

    if (mode === 'stack') {
      const popped = items[items.length - 1];
      setActiveLines([6]);
      setVariables({ popped_value: popped, new_size: items.length - 1 });
      setMessage(`Popped ${popped} from the top of the Stack.`);
      setItems(items.slice(0, -1));
    } else {
      const dequeued = items[0];
      setActiveLines([6]);
      setVariables({ dequeued_value: dequeued, new_size: items.length - 1 });
      setMessage(`Dequeued ${dequeued} from the front of the Queue.`);
      setItems(items.slice(1));
    }
  };

  const handlePeek = () => {
      if (items.length === 0) {
          setMessage(`Container is empty! Peek returns null.`);
          setActiveLines([9]);
          setVariables({ result: 'null' });
          return;
      }
      
      const peeked = mode === 'stack' ? items[items.length - 1] : items[0];
      setActiveLines([10]);
      setVariables({ [mode === 'stack' ? 'top_value' : 'front_value']: peeked });
      setMessage(`Peeked at the ${mode === 'stack' ? 'top' : 'front'} element: ${peeked}. It was not removed.`);
  };

  const handleIsEmpty = () => {
      const empty = items.length === 0;
      setActiveLines([13]);
      setVariables({ 'items.length': items.length, result: empty.toString() });
      setMessage(`Checked if container is empty: ${empty}.`);
  };

  const handleGetSize = () => {
      const size = items.length;
      setActiveLines([16]);
      setVariables({ size: size });
      setMessage(`Requested size of the container. The current size is ${size}.`);
  };

  const currentCode = mode === 'stack' ? STACK_CODE : QUEUE_CODE;

  return (
    <div className="app-layout">
      <div className="control-bar stack-controls">
        <div className="brand" style={{background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text'}}>
          <Activity size={24} color="#10b981" />
          <span>{mode === 'stack' ? 'Stack Visualizer' : 'Queue Visualizer'}</span>
        </div>
        
        <div className="controls-group">
            <select 
                value={mode} 
                onChange={(e) => {
                    setMode(e.target.value);
                    setItems([]);
                    setMessage(`Switched to ${e.target.value} mode.`);
                }}
                className="select-input"
            >
                <option value="stack">Stack (LIFO)</option>
                <option value="queue">Queue (FIFO)</option>
            </select>

            <div className="input-group" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                   <label>Value</label>
                   <input 
                      type="text" 
                      value={inputValue} 
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Add..."
                      className="custom-input"
                      style={{width: '60px'}}
                  />
                </div>
                
                <button className="btn btn-primary" onClick={handlePushEnqueue}>
                    {mode === 'stack' ? 'Push' : 'Enqueue'}
                </button>
                <button className="btn btn-danger" onClick={handlePopDequeue} style={{background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white'}}>
                    {mode === 'stack' ? 'Pop' : 'Dequeue'}
                </button>
                <button className="btn" onClick={handlePeek} style={{background: 'rgba(129, 140, 248, 0.2)', color: '#818cf8'}}>Peek</button>
                <button className="btn" onClick={handleIsEmpty} style={{background: 'rgba(255, 255, 255, 0.05)', color: '#fff'}}>IsEmpty</button>
                <button className="btn" onClick={handleGetSize} style={{background: 'rgba(255, 255, 255, 0.05)', color: '#fff'}}>Size</button>
            </div>
        </div>

        <div className="controls-group hidden-mobile">
            <button className="btn" onClick={() => setItems([])}>
                <RotateCcw size={16} /> Clear
            </button>
        </div>
      </div>

      <div className="main-content">
          <div className="visualizer-container" ref={containerRef} style={{flexDirection: mode === 'stack' ? 'column-reverse' : 'row', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
            
            <div className="stats-overlay" style={{top: '1rem', left: '1rem'}}>
                <div className="stat-row">
                    <span className="stat-label">Size</span>
                    <span className="stat-value">{items.length} / 10</span>
                </div>
                <div className="stat-row">
                    <span className="stat-label">Type</span>
                    <span className="stat-value" style={{color: '#10b981', textTransform: 'uppercase'}}>{mode === 'stack' ? 'LIFO' : 'FIFO'}</span>
                </div>
            </div>
            
            <div className={`data-container ${mode}`}>
                {items.length === 0 && <span className="empty-text">Empty {mode}</span>}
                {items.map((val, idx) => {
                    const isPeeked = activeLines.includes(10) && ((mode === 'stack' && idx === items.length - 1) || (mode === 'queue' && idx === 0));
                    return (
                        <div 
                            key={idx} 
                            className={`data-node slide-in ${isPeeked ? 'peeked' : ''}`}
                            style={{
                                boxShadow: isPeeked ? '0 0 20px #818cf8' : '',
                                transform: isPeeked ? 'scale(1.1)' : ''
                            }}
                        >
                            {val}
                            <span className="node-index">{idx}</span>
                        </div>
                    );
                })}
            </div>
            
          </div>

          <aside className="teacher-sidebar">
              <div className="sidebar-header">
                  <h3>{mode === 'stack' ? 'Stack Operations' : 'Queue Operations'}</h3>
              </div>
              
              <div className="code-block" style={{maxHeight: '40vh', overflowY: 'auto'}}>
                  {currentCode.map((line, idx) => (
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
