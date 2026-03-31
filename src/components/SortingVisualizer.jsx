import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Activity, SkipBack, SkipForward, Check } from 'lucide-react';
import { 
  getStrictBubbleSortAnimations, 
  getStrictMergeSortAnimations, 
  getStrictQuickSortAnimations,
  BUBBLE_CODE,
  MERGE_CODE,
  QUICK_CODE
} from '../utils/sortingAlgorithms';

const ALGORITHMS = {
  BUBBLE: 'Bubble Sort',
  MERGE: 'Merge Sort',
  QUICK: 'Quick Sort',
};

const CODE_MAP = {
  [ALGORITHMS.BUBBLE]: BUBBLE_CODE,
  [ALGORITHMS.MERGE]: MERGE_CODE,
  [ALGORITHMS.QUICK]: QUICK_CODE,
};

const MIN_SPEED = 1000; // Slower for teaching
const MAX_SPEED = 50;

export default function SortingVisualizer() {
  const [arraySize, setArraySize] = useState(15);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState(ALGORITHMS.BUBBLE);
  const [customArrayInput, setCustomArrayInput] = useState('');
  
  // Animation Engine State
  const [frames, setFrames] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });

  const containerRef = useRef(null);

  const generateFrames = useCallback((initialArray, selectedAlg) => {
      let animations = [];
      if (selectedAlg === ALGORITHMS.MERGE) animations = getStrictMergeSortAnimations(initialArray);
      else if (selectedAlg === ALGORITHMS.BUBBLE) animations = getStrictBubbleSortAnimations(initialArray);
      else if (selectedAlg === ALGORITHMS.QUICK) animations = getStrictQuickSortAnimations(initialArray);

      let currentArray = [...initialArray];
      let generatedFrames = [ 
          { 
            array: [...currentArray], 
            activeIndices: [], 
            isSorted: false, 
            comparisons: 0, 
            swaps: 0,
            activeLines: [],
            variables: {},
            message: "Array initialized. Ready to sort."
          } 
      ];

      let compares = 0;
      let swaps = 0;

      for (let i = 0; i < animations.length; i++) {
          const payload = animations[i];
          const { action, indices, values, activeLines, variables, message } = payload;
          let activeIndices = indices || [];
          
          if (action === 'compare') {
              compares++;
          } else if (action === 'swap') {
              swaps++;
              currentArray[indices[0]] = values[0];
              currentArray[indices[1]] = values[1];
          } else if (action === 'overwrite') {
              swaps++;
              currentArray[indices[0]] = values[0];
          }

          generatedFrames.push({
              array: [...currentArray],
              activeIndices,
              isSorted: false,
              comparisons: compares,
              swaps: swaps,
              activeLines: activeLines || [],
              variables: variables || {},
              message: message || ""
          });
      }
      
      // Final sorted frame
      generatedFrames.push({ 
          array: [...currentArray], 
          activeIndices: [], 
          isSorted: true, 
          comparisons: compares, 
          swaps: swaps,
          activeLines: [],
          variables: {},
          message: "Array is completely sorted!"
      });
      
      setFrames(generatedFrames);
      setCurrentStep(0);
      setStats({ comparisons: 0, swaps: 0 });
      setIsPlaying(false);
  }, []);

  const resetArray = () => {
    setIsPlaying(false);
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
        newArray.push(randomIntFromInterval(5, 100)); // values 5 to 100
    }
    setCustomArrayInput(newArray.join(', '));
    generateFrames(newArray, algorithm);
  };

  const handleCustomArrayLoad = () => {
      setIsPlaying(false);
      try {
          const parsed = customArrayInput
              .split(',')
              .map(v => parseInt(v.trim()))
              .filter(v => !isNaN(v) && v > 0);
          
          if (parsed.length > 0) {
              setArraySize(parsed.length);
              generateFrames(parsed, algorithm);
          } else {
             alert('Please enter a valid comma-separated list of numbers');
          }
      } catch (e) {
          alert('Invalid input format');
      }
  };

  useEffect(() => {
    resetArray();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (frames.length > 0) {
        generateFrames(frames[0].array, algorithm);
    }
  }, [algorithm]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < frames.length - 1) {
        const delay = MIN_SPEED - (speed * (MIN_SPEED - MAX_SPEED) / 100);
        interval = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, delay);
    } else if (currentStep >= frames.length - 1) {
        setIsPlaying(false);
    }
    return () => clearTimeout(interval);
  }, [isPlaying, currentStep, frames.length, speed]);
  
  useEffect(() => {
      if(frames[currentStep]) {
          setStats({ comparisons: frames[currentStep].comparisons, swaps: frames[currentStep].swaps });
      }
  }, [currentStep, frames]);

  const stepForward = () => { if (currentStep < frames.length - 1) setCurrentStep(s => s + 1); };
  const stepBackward = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };

  const currentFrame = frames[currentStep] || { array: [], activeIndices: [], isSorted: false, activeLines: [], variables: {}, message: "" };
  const currentArray = currentFrame.array;
  const maxVal = Math.max(...(frames[0]?.array || [100]));
  const renderText = currentArray.length <= 40; 
  const currentCode = CODE_MAP[algorithm];

  return (
    <div className="app-layout">
      <div className="control-bar stack-controls">
        <div className="brand">
          <Activity size={24} color="#818cf8" />
          <span>DSA Visualizer</span>
        </div>
        
        <div className="controls-group">
            <div className="input-group">
                <label>Custom Array</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                        type="text" 
                        value={customArrayInput} 
                        onChange={(e) => setCustomArrayInput(e.target.value)}
                        placeholder="10, 5, 20"
                        className="custom-input"
                    />
                    <button className="btn btn-icon" onClick={handleCustomArrayLoad} title="Load Custom Array">
                        <Check size={16} />
                    </button>
                </div>
            </div>

            <div className="input-group hidden-mobile">
                <label>Array Size: {arraySize}</label>
                <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    value={arraySize} 
                    onChange={(e) => {
                        setArraySize(e.target.value);
                        setIsPlaying(false);
                        const newArray = Array.from({length: e.target.value}, () => randomIntFromInterval(5, maxVal));
                        setCustomArrayInput(newArray.join(', '));
                        generateFrames(newArray, algorithm);
                    }}
                />
            </div>
            
            <div className="input-group hidden-mobile">
                <label>Speed: {speed}</label>
                <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={speed} 
                    onChange={(e) => setSpeed(e.target.value)}
                />
            </div>
            
            <select 
                value={algorithm} 
                onChange={(e) => setAlgorithm(e.target.value)}
                className="select-input"
            >
                {Object.values(ALGORITHMS).map(alg => (
                    <option key={alg} value={alg}>{alg}</option>
                ))}
            </select>
        </div>

        <div className="controls-group">
            <button className="btn" onClick={resetArray} title="Random Array">
                <RotateCcw size={16} />
            </button>
            <div className="step-controls">
                 <button className="btn btn-icon" onClick={stepBackward} disabled={currentStep === 0}>
                    <SkipBack size={16} />
                </button>
                <button 
                    className={`btn ${isPlaying ? 'btn-danger' : 'btn-primary'}`} 
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={currentStep >= frames.length - 1 && !isPlaying}
                    style={{minWidth: '100px'}}
                >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />} 
                    {isPlaying ? 'Pause' : (currentStep === 0 ? 'Start' : 'Resume')}
                </button>
                <button className="btn btn-icon" onClick={stepForward} disabled={currentStep >= frames.length - 1}>
                    <SkipForward size={16} />
                </button>
            </div>
        </div>
      </div>

      <div className="main-content">
          <div className="visualizer-container" ref={containerRef}>
            <div className="stats-overlay">
                <div className="stat-row">
                    <span className="stat-label">Comparisons</span>
                    <span className="stat-value">{stats.comparisons}</span>
                </div>
                <div className="stat-row">
                    <span className="stat-label">Array Operations</span>
                    <span className="stat-value">{stats.swaps}</span>
                </div>
                <div className="stat-row">
                    <span className="stat-label">Step</span>
                    <span className="stat-value">{currentStep} / {Math.max(0, frames.length - 1)}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max={Math.max(0, frames.length - 1)} 
                    value={currentStep} 
                    onChange={(e) => {
                        setIsPlaying(false);
                        setCurrentStep(parseInt(e.target.value));
                    }}
                    className="scrubber"
                />
            </div>
            
            {currentArray.map((value, idx) => {
                const isActive = currentFrame.activeIndices.includes(idx);
                const isSorted = currentFrame.isSorted;
                
                let barClass = "array-bar";
                if (isSorted) barClass += " sorted";
                else if (isActive) barClass += " compare";
                
                const heightPercentage = Math.max(5, (value / maxVal) * 100);

                return (
                    <div
                        className={barClass}
                        key={idx}
                        style={{ height: `${heightPercentage}%`, width: `${100 / currentArray.length}%`, maxWidth: '50px' }}
                    >
                        {renderText && <span className="bar-value">{value}</span>}
                    </div>
                );
            })}
          </div>

          <aside className="teacher-sidebar">
              <div className="sidebar-header">
                  <h3>{algorithm} Logic</h3>
              </div>
              
              <div className="code-block">
                  {currentCode.map((line, idx) => (
                      <div key={idx} className={`code-line ${currentFrame.activeLines.includes(idx) ? 'active-line' : ''}`}>
                          <span className="line-num">{idx + 1}</span>
                          <pre>{line}</pre>
                      </div>
                  ))}
              </div>

              <div className="teacher-panel">
                  <div className="teacher-message">
                      <span className="badge">Execution Trace</span>
                      <p>{currentFrame.message}</p>
                  </div>
                  
                  <div className="variables-watch">
                       <span className="badge">Variables Tracker</span>
                       <div className="var-grid">
                           {Object.entries(currentFrame.variables).map(([key, val]) => (
                               <div key={key} className="var-box">
                                   <span className="var-name">{key}</span>
                                   <span className="var-val">{val}</span>
                               </div>
                           ))}
                           {Object.keys(currentFrame.variables).length === 0 && (
                               <div className="var-box" style={{gridColumn: 'span 2', textAlign: 'center', opacity: 0.5}}>No active variables line trace</div>
                           )}
                       </div>
                  </div>
              </div>
          </aside>
      </div>
    </div>
  );
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
