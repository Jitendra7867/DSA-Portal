import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Activity } from 'lucide-react';

// Common classes for Tree logic
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.height = 1; // Used primarily for AVL
    }
}

// Pseudo Codes
const BT_CODE = [
  "// Binary Tree Level-Order Insertion",
  "function insert(root, val) {",
  "  if (!root) return new Node(val);",
  "  const queue = [root];",
  "  while (queue.length > 0) {",
  "    const node = queue.shift();",
  "    if (!node.left) { node.left = new Node(val); return; }",
  "    else queue.push(node.left);",
  "    if (!node.right) { node.right = new Node(val); return; }",
  "    else queue.push(node.right);",
  "  }",
  "}"
];

const BST_CODE = [
  "// Binary Search Tree (BST) Insertion",
  "function insert(node, val) {",
  "  if (!node) return new Node(val);",
  "  if (val < node.val) {",
  "    node.left = insert(node.left, val);",
  "  } else if (val > node.val) {",
  "    node.right = insert(node.right, val);",
  "  }",
  "  return node;",
  "}"
];

const AVL_CODE = [
  "// AVL Tree (Self-Balancing) Insertion",
  "function insert(node, val) {",
  "  if (!node) return new Node(val);",
  "  if (val < node.val) node.left = insert(node.left, val);",
  "  else if (val > node.val) node.right = insert(node.right, val);",
  "  ",
  "  node.height = 1 + max(getHeight(node.left), getHeight(node.right));",
  "  let balance = getBalance(node);",
  "  ",
  "  if (balance > 1 && val < node.left.val) return rightRotate(node);",
  "  if (balance < -1 && val > node.right.val) return leftRotate(node);",
  "  if (balance > 1 && val > node.left.val) { node.left = leftRotate(node.left); return rightRotate(node); }",
  "  if (balance < -1 && val < node.right.val) { node.right = rightRotate(node.right); return leftRotate(node); }",
  "  return node;",
  "}"
];

// SVG Viewport Config
const SVG_WIDTH = 800;
const SVG_HEIGHT = 500;
const NODE_RADIUS = 20;

export default function TreeVisualizer() {
  const [treeType, setTreeType] = useState('BST'); // 'BT', 'BST', 'AVL'
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activeLines, setActiveLines] = useState([]);
  const [message, setMessage] = useState("Select a Tree operation.");
  const [variables, setVariables] = useState({});
  const [highlightedNodes, setHighlightedNodes] = useState([]); // Array of values to highlight

  // Clear highlights after delay
  useEffect(() => {
    if (activeLines.length > 0 || highlightedNodes.length > 0) {
      const timer = setTimeout(() => {
        setActiveLines([]);
        setVariables({});
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [activeLines, highlightedNodes]);

  // -- INSERTION LOGIC -- //
  
  const insertNode = () => {
      let val = parseInt(inputValue.trim() || Math.floor(Math.random() * 100).toString());
      if (isNaN(val)) return setMessage("Please enter a valid number.");
      
      let newRoot = null;
      if (treeType === 'BT') {
          newRoot = insertBT(root ? cloneTree(root) : null, val);
          setActiveLines([6]); // Simple trace
          setMessage(`Inserted ${val} into the Binary Tree via Level-Order logic.`);
      } else if (treeType === 'BST') {
          newRoot = insertBST(root ? cloneTree(root) : null, val);
          setActiveLines([3, 4, 6]);
          setMessage(`Inserted ${val} into the BST. Values < internal nodes branch left; > branch right.`);
      } else if (treeType === 'AVL') {
          newRoot = insertAVL(root ? cloneTree(root) : null, val);
          setActiveLines([3, 6, 9]);
          setMessage(`Inserted ${val} into AVL Tree. Self-balancing rotations may have triggered to maintain balance.`);
      }
      
      setRoot(newRoot);
      setInputValue('');
      setHighlightedNodes([val]);
      setVariables({ inserted: val, type: treeType });
  };

  // 1. Standard Simple BT (Level Order Insertion)
  const insertBT = (node, val) => {
      if (!node) return new TreeNode(val);
      const queue = [node];
      while (queue.length > 0) {
          const curr = queue.shift();
          if (!curr.left) { curr.left = new TreeNode(val); break; }
          else queue.push(curr.left);
          if (!curr.right) { curr.right = new TreeNode(val); break; }
          else queue.push(curr.right);
      }
      return node;
  };

  // 2. BST (Sorted)
  const insertBST = (node, val) => {
      if (!node) return new TreeNode(val);
      if (val < node.val) node.left = insertBST(node.left, val);
      else if (val > node.val) node.right = insertBST(node.right, val);
      return node;
  };

  // 3. AVL (Balancing)
  const getHeight = (n) => n ? n.height : 0;
  const getBalance = (n) => n ? getHeight(n.left) - getHeight(n.right) : 0;
  
  const rightRotate = (y) => {
      let x = y.left; let T2 = x.right;
      x.right = y; y.left = T2;
      y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
      x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
      return x;
  };
  
  const leftRotate = (x) => {
      let y = x.right; let T2 = y.left;
      y.left = x; x.right = T2;
      x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
      y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
      return y;
  };

  const insertAVL = (node, val) => {
      if (!node) return new TreeNode(val);
      if (val < node.val) node.left = insertAVL(node.left, val);
      else if (val > node.val) node.right = insertAVL(node.right, val);
      else return node; // Dupes not handled uniquely here

      node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
      let balance = getBalance(node);

      if (balance > 1 && val < node.left.val) return rightRotate(node);
      if (balance < -1 && val > node.right.val) return leftRotate(node);
      if (balance > 1 && val > node.left.val) {
          node.left = leftRotate(node.left);
          return rightRotate(node);
      }
      if (balance < -1 && val < node.right.val) {
          node.right = rightRotate(node.right);
          return leftRotate(node);
      }
      return node;
  };

  // -- TRAVERSALS -- //

  const handleTraversal = async (type) => {
      if (!root) return setMessage("Tree is empty!");
      const result = [];
      if (type === 'inorder') inOrder(root, result);
      if (type === 'preorder') preOrder(root, result);
      if (type === 'postorder') postOrder(root, result);
      
      setMessage(`Executing ${type} traversal. Resolving entire tree into array.`);
      
      // Animate the result sequentially
      setHighlightedNodes([]);
      for (let i = 0; i < result.length; i++) {
          await new Promise(r => setTimeout(r, 600)); // Sleep equivalent
          setHighlightedNodes(prev => [...prev, result[i]]);
          setVariables({ cur_val: result[i], traversed: `[${result.slice(0, i+1).join(',')}]` });
      }
  };

  const inOrder = (node, res) => { if (node) { inOrder(node.left, res); res.push(node.val); inOrder(node.right, res); } };
  const preOrder = (node, res) => { if (node) { res.push(node.val); preOrder(node.left, res); preOrder(node.right, res); } };
  const postOrder = (node, res) => { if (node) { postOrder(node.left, res); postOrder(node.right, res); res.push(node.val); } };

  const cloneTree = (node) => {
      if (!node) return null;
      const newNode = new TreeNode(node.val);
      newNode.height = node.height;
      newNode.left = cloneTree(node.left);
      newNode.right = cloneTree(node.right);
      return newNode;
  };

  // -- SVG RENDERING CALCULATIONS -- //
  const renderData = [];
  let maxYDepth = 0;

  const calculatePositions = (node, x, y, level, w) => {
      if (!node) return;
      if (y > maxYDepth) maxYDepth = y;
      renderData.push({ val: node.val, x, y, level });
      if (node.left) calculatePositions(node.left, x - w, y + 60, level + 1, w / 2);
      if (node.right) calculatePositions(node.right, x + w, y + 60, level + 1, w / 2);
  };
  
  if (root) calculatePositions(root, SVG_WIDTH / 2, 40, 0, 180);

  // Helper to find drawn node
  const getNodeView = (v) => renderData.find(d => d.val === v);

  // Derive edges (only possible because we don't allow duplicates generically in this visualizer for simplicity)
  const edges = [];
  const findEdges = (node) => {
      if (!node) return;
      let pView = getNodeView(node.val);
      if (node.left) {
          let cView = getNodeView(node.left.val);
          if(pView && cView) edges.push({x1: pView.x, y1: pView.y, x2: cView.x, y2: cView.y});
          findEdges(node.left);
      }
      if (node.right) {
          let cView = getNodeView(node.right.val);
          if(pView && cView) edges.push({x1: pView.x, y1: pView.y, x2: cView.x, y2: cView.y});
          findEdges(node.right);
      }
  };
  if (root) findEdges(root);

  const getCode = () => {
      if (treeType === 'BT') return BT_CODE;
      if (treeType === 'BST') return BST_CODE;
      return AVL_CODE;
  };

  return (
    <div className="app-layout">
      <div className="control-bar stack-controls" style={{background: 'rgba(30, 41, 59, 0.9)', zIndex: 100}}>
        <div className="brand" style={{background: 'linear-gradient(135deg, #2dd4bf 0%, #0369a1 100%)', WebkitBackgroundClip: 'text'}}>
          <Activity size={24} color="#2dd4bf" />
          <span>Tree Visualizer</span>
        </div>
        
        <div className="controls-group">
            <select 
                value={treeType} 
                onChange={(e) => {
                    setTreeType(e.target.value);
                    setRoot(null);
                    setHighlightedNodes([]);
                    setMessage(`Switched to ${e.target.value}. Tree cleared.`);
                }}
                className="select-input"
            >
                <option value="BST">Binary Search Tree (BST)</option>
                <option value="BT">Basic Binary Tree (BT)</option>
                <option value="AVL">AVL Tree (Self-Balancing)</option>
            </select>

            <div className="input-group" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                   <label>Node Value</label>
                   <input 
                      type="number" 
                      value={inputValue} 
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Random"
                      className="custom-input"
                      style={{width: '70px'}}
                  />
                </div>
                
                <button className="btn btn-primary" onClick={insertNode} style={{background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', border: 'none'}}>
                    Insert
                </button>
            </div>
            
            <div style={{width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)', margin: '0 0.5rem'}}></div>
            
            <button className="btn" onClick={() => handleTraversal('inorder')} style={{background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8'}}>In-Order</button>
            <button className="btn" onClick={() => handleTraversal('preorder')} style={{background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8'}}>Pre-Order</button>
            <button className="btn" onClick={() => handleTraversal('postorder')} style={{background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8'}}>Post-Order</button>
        </div>
        
        <div className="controls-group">
            <button className="btn" onClick={() => { setRoot(null); setHighlightedNodes([]); }}>
                <RotateCcw size={16} /> Clear
            </button>
        </div>
      </div>

      <div className="main-content">
          <div className="visualizer-container tree-container" style={{alignItems: 'center', justifyContent: 'center', padding: '0', overflow: 'hidden'}}>
            
            <div className="stats-overlay" style={{top: '1rem', left: '1rem'}}>
                <div className="stat-row">
                    <span className="stat-label">Nodes</span>
                    <span className="stat-value">{renderData.length}</span>
                </div>
                <div className="stat-row">
                    <span className="stat-label">Tree Type</span>
                    <span className="stat-value" style={{color: '#2dd4bf'}}>{treeType}</span>
                </div>
            </div>
            
            <div className="svg-wrapper" style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '2rem'}}>
                {renderData.length === 0 && <div className="empty-text">Tree is empty. Insert a node.</div>}
                {renderData.length > 0 && (
                    <svg viewBox={`0 0 ${SVG_WIDTH} ${maxYDepth + 100}`} style={{width: '100%', maxHeight: '80vh', maxWidth: '1000px'}}>
                        {/* Edges */}
                        {edges.map((edge, i) => (
                            <line 
                                key={`edge-${i}`} 
                                x1={edge.x1} 
                                y1={edge.y1} 
                                x2={edge.x2} 
                                y2={edge.y2} 
                                className="tree-edge"
                            />
                        ))}
                        
                        {/* Nodes */}
                        {renderData.map((node, i) => {
                            const isHighlighted = highlightedNodes.includes(node.val);
                            return (
                                <g key={`node-${i}`} className={`tree-node-group ${isHighlighted ? 'highlighted' : ''}`}>
                                    <circle 
                                        cx={node.x} 
                                        cy={node.y} 
                                        r={NODE_RADIUS} 
                                        className="tree-node"
                                    />
                                    <text 
                                        x={node.x} 
                                        y={node.y} 
                                        dominantBaseline="central" 
                                        textAnchor="middle" 
                                        className="tree-node-text"
                                    >
                                        {node.val}
                                    </text>
                                </g>
                            )
                        })}
                    </svg>
                )}
            </div>
          </div>

          <aside className="teacher-sidebar">
              <div className="sidebar-header">
                  <h3>Tree Operations</h3>
              </div>
              
              <div className="code-block" style={{maxHeight: '40vh', overflowY: 'auto'}}>
                  {getCode().map((line, idx) => (
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
                               <div key={key} className="var-box" style={key === 'traversed' ? {gridColumn: 'span 2'} : {}}>
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
