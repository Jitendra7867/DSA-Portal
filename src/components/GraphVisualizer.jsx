import React, { useState, useEffect } from 'react';
import { RotateCcw, Activity } from 'lucide-react';

const ALGO_CODES = {
  BFS: [
    "// Breadth-First Search (BFS)",
    "function bfs(graph, start) {",
    "  let queue = [start];",
    "  let visited = new Set([start]);",
    "  while (queue.length > 0) {",
    "    let node = queue.shift();",
    "    process(node);",
    "    for (let neighbor of graph[node]) {",
    "      if (!visited.has(neighbor)) {",
    "        visited.add(neighbor);",
    "        queue.push(neighbor);",
    "      }",
    "    }",
    "  }",
    "}"
  ],
  DFS: [
    "// Depth-First Search (DFS)",
    "function dfs(graph, start) {",
    "  let stack = [start];",
    "  let visited = new Set([start]);",
    "  while (stack.length > 0) {",
    "    let node = stack.pop();",
    "    process(node);",
    "    for (let neighbor of graph[node]) {",
    "      if (!visited.has(neighbor)) {",
    "        visited.add(neighbor);",
    "        stack.push(neighbor);",
    "      }",
    "    }",
    "  }",
    "}"
  ],
  DIJKSTRA: [
    "// Dijkstra's Shortest Path",
    "function dijkstra(graph, start) {",
    "  let dist = {};",
    "  for (let node of graph.nodes) dist[node] = Infinity;",
    "  dist[start] = 0;",
    "  let pq = [{node: start, cost: 0}];",
    "  while (pq.length > 0) {",
    "    let {node, cost} = pq.shift(); // extract-min",
    "    for (let neighbor of graph[node]) {",
    "      let newCost = cost + neighbor.weight;",
    "      if (newCost < dist[neighbor.to]) {",
    "        dist[neighbor.to] = newCost;",
    "        pq.push({node: neighbor.to, cost: newCost});",
    "      }",
    "    }",
    "  }",
    "}"
  ],
  PRIM: [
    "// Prim's Minimum Spanning Tree (MST)",
    "function primmst(graph, start) {",
    "  let visited = new Set([start]);",
    "  let mstEdges = [];",
    "  while (visited.size < graph.nodes.length) {",
    "    let minEdge = getMinEdgeFromVisited(visited);",
    "    if (!minEdge) break;",
    "    visited.add(minEdge.to);",
    "    mstEdges.push(minEdge);",
    "  }",
    "  return mstEdges;",
    "}"
  ],
  KRUSKAL: [
    "// Kruskal's Minimum Spanning Tree (MST)",
    "function kruskal(graph) {",
    "  let sortedEdges = graph.edges.sort((a,b) => a.weight - b.weight);",
    "  let uf = new UnionFind(graph.nodes);",
    "  let mst = [];",
    "  for (let edge of sortedEdges) {",
    "    if (uf.find(edge.u) !== uf.find(edge.v)) {",
    "      uf.union(edge.u, edge.v);",
    "      mst.push(edge);",
    "    }",
    "  }",
    "  return mst;",
    "}"
  ]
};

const SVG_WIDTH = 800;
const SVG_HEIGHT = 500;
const CONST_RADIUS = 200;

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState([]); // ['A', 'B', 'C']
  const [edges, setEdges] = useState([]); // [{u: 'A', v: 'B', weight: 10}]
  
  // Input fields
  const [nodeInput, setNodeInput] = useState('');
  const [edgeU, setEdgeU] = useState('');
  const [edgeV, setEdgeV] = useState('');
  const [edgeW, setEdgeW] = useState('');
  
  // Engine State
  const [activeAlgo, setActiveAlgo] = useState('BFS');
  const [activeLines, setActiveLines] = useState([]);
  const [message, setMessage] = useState("Add nodes and edges to build a graph.");
  const [variables, setVariables] = useState({});
  const [activeNodes, setActiveNodes] = useState(new Set()); // currently bright glowing nodes
  const [activeEdges, setActiveEdges] = useState(new Set()); // currently highlighted edges
  const [nodeDistances, setNodeDistances] = useState({}); // For Dijkstra's

  // Map nodes to circular positions
  const getCoordinates = () => {
      const coords = {};
      const total = nodes.length;
      const cntrX = SVG_WIDTH / 2;
      const cntrY = SVG_HEIGHT / 2;
      
      nodes.forEach((node, i) => {
          const angle = (Math.PI * 2 * i) / total - Math.PI / 2; // start at top (-90deg)
          coords[node] = {
              x: cntrX + CONST_RADIUS * Math.cos(angle),
              y: cntrY + CONST_RADIUS * Math.sin(angle)
          };
      });
      return coords;
  };
  
  const coords = getCoordinates();

  // Reset Highlights when selecting new algo
  useEffect(() => {
     setActiveNodes(new Set());
     setActiveEdges(new Set());
     setNodeDistances({});
     setActiveLines([]);
     setVariables({});
     setMessage(`Switched to ${activeAlgo}. Ready to run.`);
  }, [activeAlgo]);

  // -- GRAPH MUTATIONS -- //
  
  const addNode = () => {
      const val = nodeInput.trim().toUpperCase();
      if (!val) return;
      if (nodes.includes(val)) return setMessage(`Node ${val} already exists.`);
      if (nodes.length >= 12) return setMessage(`Max 12 Nodes for clean visualization.`);
      setNodes([...nodes, val]);
      setNodeInput('');
      setMessage(`Added Node ${val}. SVG Coordinates recalculated dynamically.`);
  };

  const addEdge = () => {
      const u = edgeU.trim().toUpperCase();
      const v = edgeV.trim().toUpperCase();
      const w = parseInt(edgeW) || 1;
      
      if (!nodes.includes(u) || !nodes.includes(v)) return setMessage(`Nodes must exist before connecting.`);
      if (u === v) return setMessage(`Self-loops are omitted in this visualizer.`);
      
      // Undirected graph check
      const exists = edges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
      if (exists) return setMessage(`Edge between ${u} and ${v} already exists.`);
      
      setEdges([...edges, { u, v, weight: w }]);
      setEdgeU('');
      setEdgeV('');
      setEdgeW('');
      setMessage(`Added Undirected Edge ${u} ↔ ${v} with weight ${w}.`);
  };

  const clearGraph = () => {
      setNodes([]);
      setEdges([]);
      setActiveNodes(new Set());
      setActiveEdges(new Set());
      setNodeDistances({});
      setMessage("Graph cleared successfully.");
  };

  // Helper Adjacency Map
  const buildAdjList = () => {
      const adj = {};
      nodes.forEach(n => adj[n] = []);
      edges.forEach(e => {
          adj[e.u].push({to: e.v, weight: e.weight});
          adj[e.v].push({to: e.u, weight: e.weight});
      });
      return adj;
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // -- ALGORITHMS -- //

  const runAlgorithm = async () => {
      if (nodes.length === 0) return setMessage("Graph is empty!");
      setActiveNodes(new Set());
      setActiveEdges(new Set());
      setNodeDistances({});
      
      const adj = buildAdjList();
      const start = nodes[0]; // defaults to first node added

      if (activeAlgo === 'BFS') await runBFS(adj, start);
      else if (activeAlgo === 'DFS') await runDFS(adj, start);
      else if (activeAlgo === 'DIJKSTRA') await runDijkstra(adj, start);
      else if (activeAlgo === 'PRIM') await runPrim(adj, start);
      else if (activeAlgo === 'KRUSKAL') await runKruskal();
  };

  const runBFS = async (adj, start) => {
      let queue = [start];
      let visited = new Set([start]);
      let order = [];
      const edgeSet = new Set();
      
      setActiveLines([2,3,4]);

      while (queue.length > 0) {
          let node = queue.shift();
          order.push(node);
          
          setActiveNodes(new Set(order));
          setVariables({ queue: `[${queue.join(',')}]`, visiting: node, visited: `[${Array.from(visited).join(',')}]` });
          setMessage(`BFS Queue dequeues ${node}. Examining its neighbors.`);
          await delay(1000);
          
          setActiveLines([7, 8, 9]);
          for (let neighbor of adj[node]) {
              if (!visited.has(neighbor.to)) {
                  visited.add(neighbor.to);
                  queue.push(neighbor.to);
                  // Highlight Edge traversed
                  edgeSet.add(`${node}-${neighbor.to}`);
                  edgeSet.add(`${neighbor.to}-${node}`);
                  setActiveEdges(new Set(edgeSet));
                  setVariables({ queue: `[${queue.join(',')}]`, enqueueing: neighbor.to });
                  await delay(800);
              }
          }
      }
      setActiveLines([14]);
      setMessage(`BFS Completed. Traversed all connected components from ${start}.`);
  };

  const runDFS = async (adj, start) => {
      let stack = [start];
      let visited = new Set([start]);
      let order = [];
      const edgeSet = new Set();
      
      setActiveLines([2,3,4]);
      
      while (stack.length > 0) {
          let node = stack.pop();
          order.push(node);
          
          setActiveNodes(new Set(order));
          setVariables({ stack: `[${stack.join(',')}]`, visiting: node, visited: `[${Array.from(visited).join(',')}]` });
          setMessage(`DFS Stack pops ${node}. Plunging deeper into unvisited neighbors.`);
          await delay(1000);
          
          setActiveLines([7, 8, 9]);
          for (let neighbor of adj[node]) {
              if (!visited.has(neighbor.to)) {
                  visited.add(neighbor.to);
                  stack.push(neighbor.to);
                  edgeSet.add(`${node}-${neighbor.to}`);
                  edgeSet.add(`${neighbor.to}-${node}`);
                  setActiveEdges(new Set(edgeSet));
                  setVariables({ stack: `[${stack.join(',')}]`, pushing_stack: neighbor.to });
                  await delay(800);
              }
          }
      }
      setActiveLines([14]);
      setMessage(`DFS Completed via Stack resolution logic.`);
  };

  const runDijkstra = async (adj, start) => {
      let dist = {};
      nodes.forEach(n => dist[n] = Infinity);
      dist[start] = 0;
      
      // Simple array acting as PQ
      let pq = [{node: start, cost: 0}]; 
      const edgeSet = new Set();
      
      setActiveLines([2,3,4,5]);
      setNodeDistances({...dist});
      
      while (pq.length > 0) {
          pq.sort((a,b) => a.cost - b.cost);
          let curr = pq.shift();
          
          setActiveNodes(prev => new Set([...prev, curr.node]));
          setMessage(`Extracting Min from PQ. Node ${curr.node} cost: ${curr.cost}`);
          setVariables({ curr_node: curr.node, curr_cost: curr.cost });
          setActiveLines([7]);
          await delay(1000);
          
          for (let neighbor of adj[curr.node]) {
              let newCost = curr.cost + neighbor.weight;
              setActiveLines([8, 9]);
              
              if (newCost < dist[neighbor.to]) {
                  dist[neighbor.to] = newCost;
                  pq.push({node: neighbor.to, cost: newCost});
                  
                  // Highlight optimal path
                  edgeSet.add(`${curr.node}-${neighbor.to}`);
                  edgeSet.add(`${neighbor.to}-${curr.node}`);
                  setActiveEdges(new Set(edgeSet));
                  setNodeDistances({...dist});
                  
                  setMessage(`Relaxing Edge! Found cheaper path to ${neighbor.to} (Cost: ${newCost})`);
                  setVariables({ updated_node: neighbor.to, new_dist: newCost });
                  setActiveLines([10, 11]);
                  await delay(1000);
              }
          }
      }
      setActiveLines([16]);
      setMessage("Dijkstra's Algorithm completed. The shortest path distances are visually rendered over nodes!");
  };

  const runPrim = async (adj, start) => {
      let visited = new Set([start]);
      let mstEdges = [];
      const edgeSet = new Set();
      
      setActiveNodes(new Set([...visited]));
      setActiveLines([2,3,4,5]);
      
      while (visited.size < nodes.length) {
          let minEdge = null;
          let minWeight = Infinity;
          let fromNode = null;
          let toNode = null;
          
          // Greedily find cheapest edge spanning out of visited set
          for (let v of visited) {
              for (let neighbor of adj[v]) {
                  if (!visited.has(neighbor.to) && neighbor.weight < minWeight) {
                      minWeight = neighbor.weight;
                      minEdge = neighbor;
                      fromNode = v;
                      toNode = neighbor.to;
                  }
              }
          }
          
          if (!toNode) break; // graph might be disconnected
          
          visited.add(toNode);
          edgeSet.add(`${fromNode}-${toNode}`);
          edgeSet.add(`${toNode}-${fromNode}`);
          
          setActiveNodes(new Set([...visited]));
          setActiveEdges(new Set([...edgeSet]));
          setVariables({ greedily_added: toNode, cost: minWeight });
          setMessage(`Prim's Greedily adding cheapest valid edge: ${fromNode} - ${toNode} (W: ${minWeight})`);
          setActiveLines([6,7,8,9]);
          
          await delay(1200);
      }
      setActiveLines([11]);
      setMessage("Prim's MST built spanning out from start point visually!");
  };

  const runKruskal = async () => {
      // Sort copies to avoid mutating state
      let sortedEdges = [...edges].sort((a,b) => a.weight - b.weight);
      
      // Union Find (Disjoint Set) mechanics
      let parent = {};
      nodes.forEach(n => parent[n] = n);
      const find = (i) => { if (parent[i] === i) return i; return find(parent[i]); };
      const union = (i, j) => { let irep = find(i); let jrep = find(j); parent[irep] = jrep; };
      
      const edgeSet = new Set();
      const nodeSet = new Set();
      setActiveLines([2,3,4,5]);
      setVariables({ total_edges: edges.length });
      
      for (let edge of sortedEdges) {
          setMessage(`Kruskal tracking Edge ${edge.u}-${edge.v} (W: ${edge.weight}). Global Min!`);
          let uRep = find(edge.u);
          let vRep = find(edge.v);
          setActiveLines([6]);
          
          setVariables({ eval_edge: `${edge.u}-${edge.v}`, weight: edge.weight, u_root: uRep, v_root: vRep });
          await delay(1000);
          
          if (uRep !== vRep) {
              union(uRep, vRep);
              edgeSet.add(`${edge.u}-${edge.v}`);
              edgeSet.add(`${edge.v}-${edge.u}`);
              nodeSet.add(edge.u);
              nodeSet.add(edge.v);
              
              setActiveEdges(new Set(edgeSet));
              setActiveNodes(new Set(nodeSet));
              setMessage(`Union Find valid! Roots differ. Added Edge to MST.`);
              setActiveLines([7, 8, 9]);
              await delay(1000);
          } else {
              setMessage(`Roots match (Cycle detected)! Skipping Edge ${edge.u}-${edge.v}.`);
              await delay(800);
          }
      }
      setActiveLines([12]);
      setMessage("Kruskal's Algorithm formed MST via exact Cycle Detection!");
  };

  return (
    <div className="app-layout">
      <div className="control-bar stack-controls" style={{background: 'rgba(30, 41, 59, 0.9)', zIndex: 100}}>
        <div className="brand" style={{background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', WebkitBackgroundClip: 'text'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          <span style={{marginLeft: '0.75rem'}}>Graph Visualizer</span>
        </div>
        
        <div className="controls-group">
            <div className="input-group" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                   <input type="text" value={nodeInput} onChange={(e) => setNodeInput(e.target.value)} placeholder="Node id (e.g. A)" className="custom-input" style={{width: '100px'}} />
                </div>
                <button className="btn" onClick={addNode} style={{background: 'rgba(255, 255, 255, 0.05)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)'}}>Add Node</button>
            </div>
            
            <div style={{width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)'}}></div>
            
            <div className="input-group" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: '0.25rem' }}>
                <input type="text" value={edgeU} onChange={(e) => setEdgeU(e.target.value)} placeholder="U" className="custom-input" style={{width: '40px'}} />
                <input type="text" value={edgeV} onChange={(e) => setEdgeV(e.target.value)} placeholder="V" className="custom-input" style={{width: '40px'}} />
                <input type="number" value={edgeW} onChange={(e) => setEdgeW(e.target.value)} placeholder="Wg" className="custom-input" style={{width: '50px'}} />
                <button className="btn" onClick={addEdge} style={{background: 'rgba(255, 255, 255, 0.05)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)'}}>Add Edge</button>
            </div>
            
             <div style={{width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)'}}></div>
            
            <select value={activeAlgo} onChange={(e) => setActiveAlgo(e.target.value)} className="select-input" style={{padding: '0.4rem 0.8rem'}}>
                <option value="BFS">BFS</option>
                <option value="DFS">DFS</option>
                <option value="DIJKSTRA">Dijkstra (Short Path)</option>
                <option value="PRIM">Prim's (MST)</option>
                <option value="KRUSKAL">Kruskal's (MST)</option>
            </select>
            <button className="btn btn-primary" onClick={runAlgorithm} style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none'}}>Run {activeAlgo}</button>
        </div>
        
        <div className="controls-group">
            <button className="btn" onClick={clearGraph}><RotateCcw size={16} /> Clear</button>
        </div>
      </div>

      <div className="main-content">
          <div className="visualizer-container" style={{alignItems: 'center', justifyContent: 'center', padding: '0', overflow: 'hidden', background: '#020617'}}>
            
            <div className="stats-overlay" style={{top: '1rem', left: '1rem', border: '1px solid rgba(251, 191, 36, 0.2)'}}>
                <div className="stat-row"><span className="stat-label">Nodes</span><span className="stat-value">{nodes.length}</span></div>
                <div className="stat-row"><span className="stat-label">Edges</span><span className="stat-value">{edges.length}</span></div>
                <div className="stat-row"><span className="stat-label">Algorithm</span><span className="stat-value" style={{color: '#fbbf24'}}>{activeAlgo}</span></div>
            </div>
            
            <div className="svg-wrapper" style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {nodes.length === 0 && <div className="empty-text">Graph is empty. Nodes will arrange circularly.</div>}
                
                {nodes.length > 0 && (
                    <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} style={{width: '100%', maxHeight: '80vh', maxWidth: '1000px'}}>
                        
                        {/* Render All Edges First (Bottom Layer) */}
                        {edges.map((e, idx) => {
                            const uCoords = coords[e.u];
                            const vCoords = coords[e.v];
                            if(!uCoords || !vCoords) return null;
                            const isActive = activeEdges.has(`${e.u}-${e.v}`) || activeEdges.has(`${e.v}-${e.u}`);
                            
                            // Math for mid-point text rendering
                            const midX = (uCoords.x + vCoords.x) / 2;
                            const midY = (uCoords.y + vCoords.y) / 2;
                            
                            return (
                                <g key={`edge-${idx}`}>
                                    <line 
                                        x1={uCoords.x} y1={uCoords.y} 
                                        x2={vCoords.x} y2={vCoords.y} 
                                        className={`graph-edge ${isActive ? 'active-edge' : ''}`}
                                    />
                                    <text x={midX} y={midY} className="edge-weight" dy="-5" textAnchor="middle">{e.weight}</text>
                                </g>
                            )
                        })}
                        
                        {/* Render All Nodes (Top Layer) */}
                        {nodes.map((node, i) => {
                            const pos = coords[node];
                            const isActive = activeNodes.has(node);
                            const dist = nodeDistances[node]; // Used exactly for Dijkstra
                            
                            return (
                                <g key={`node-${i}`} className={`graph-node-group ${isActive ? 'active-node' : ''}`}>
                                    <circle cx={pos.x} cy={pos.y} r={28} className="graph-node-circle" />
                                    <text x={pos.x} y={pos.y} dominantBaseline="central" textAnchor="middle" className="graph-node-text">{node}</text>
                                    
                                    {/* Dijkstra's Visual Distance Tracker Badge */}
                                    {dist !== undefined && (
                                        <g>
                                            <rect x={pos.x - 15} y={pos.y - 45} width={30} height={18} rx={4} fill="#818cf8"/>
                                            <text x={pos.x} y={pos.y - 36} fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                                {dist === Infinity ? '∞' : dist}
                                            </text>
                                        </g>
                                    )}
                                </g>
                            )
                        })}
                    </svg>
                )}
            </div>
          </div>

          <aside className="teacher-sidebar">
              <div className="sidebar-header">
                  <h3>{activeAlgo} Graph Algorithm</h3>
              </div>
              
              <div className="code-block" style={{maxHeight: '40vh', overflowY: 'auto'}}>
                  {ALGO_CODES[activeAlgo].map((line, idx) => (
                      <div key={idx} className={`code-line ${activeLines.includes(idx + 1) ? 'active-line' : ''}`}>
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
                               <div key={key} className="var-box" style={(key === 'queue' || key === 'visited' || key === 'stack') ? {gridColumn: 'span 2'} : {}}>
                                   <span className="var-name">{key}</span>
                                   <span className="var-val">{val}</span>
                               </div>
                           ))}
                           {Object.keys(variables).length === 0 && (
                               <div className="var-box" style={{gridColumn: 'span 2', textAlign: 'center', opacity: 0.5}}>Waiting for run...</div>
                           )}
                       </div>
                  </div>
              </div>
          </aside>
      </div>
    </div>
  );
}
