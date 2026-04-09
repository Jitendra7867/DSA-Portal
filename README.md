# React + Vite
# 🚀 DSA Visualizer Portal
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
![Portal Banner](file:///C:/Users/satish%20kumar/.gemini/antigravity/brain/b023a37d-70fc-4cc2-a932-5271275f217a/portal_banner_png_1775718363347.png)
Currently, two official plugins are available:
An interactive, education-first platform designed to demystify complex data structures and algorithms through real-time visualization, code tracing, and state tracking.
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
---
## React Compiler
## 🌟 Key Features
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
- **Real-Time Visualization**: Watch algorithms come to life with smooth, intuitive animations.
- **Code Step-Tracing**: See exactly which line of code is executing in real-time.
- **Variable Watcher**: Monitor the internal state of variables as they change during execution.
- **Execution Trace**: A detailed message panel explaining the current logic being performed.
- **Dynamic Interaction**: Add nodes, edges, or custom arrays to test specific edge cases.
## Expanding the ESLint configuration
---
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
## 🛠️ Interactive Modules
### 1. Sorting Algorithms
Visualize classic sorting techniques with performance stats (Comparisons & Swaps).
- **Algorithms**: Bubble Sort, Merge Sort, Quick Sort.
- **Visuals**: ![Sorting Visualizer](file:///C:/Users/satish%20kumar/.gemini/antigravity/brain/b023a37d-70fc-4cc2-a932-5271275f217a/sorting_visualizer_png_1775718383909.png)
### 2. Graph Algorithms
Custom graph builder with a powerful SVG-based circular layout engine.
- **Algorithms**: BFS, DFS, Dijkstra’s (Shortest Path), Prim’s & Kruskal’s (MST).
- **Visuals**: ![Graph Visualizer](file:///C:/Users/satish%20kumar/.gemini/antigravity/brain/b023a37d-70fc-4cc2-a932-5271275f217a/graph_visualizer_png_1775718402871.png)
### 3. Binary Trees
Explore tree traversals and structures with high-fidelity visual nodes.
- **Visuals**: ![Tree Visualizer](file:///C:/Users/satish%20kumar/.gemini/antigravity/brain/b023a37d-70fc-4cc2-a932-5271275f217a/tree_visualizer_png_1775718422153.png)
### 4. Linear Data Structures
- **Linked List**: Visual pointer manipulation (Head/Tail insertion and deletion).
- **Stack & Queue**: LIFO and FIFO behavior visualization with container capacity tracking.
### 5. Study Resources
A dedicated section for learning materials and deep-dive notes on DSA topics.
---
## 💻 Tech Stack
- **Framework**: [React 19+](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Modern CSS variables and flex/grid layout)
---
## 🚀 Getting Started
### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173` (or the port specified in the terminal).
---
## 📂 Project Structure
```text
src/
├── components/          # Individual visualizer components
│   ├── GraphVisualizer.jsx
│   ├── SortingVisualizer.jsx
│   ├── TreeVisualizer.jsx
│   └── ...
├── utils/               # Algorithm logic and animation frame generators
├── assets/              # Static assets
└── App.jsx              # Main entry point and routing logic
```
---
## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
---
> [!NOTE]
> This README currently uses temporary high-quality illustrations generated for this session. For permanent offline use, please move the images into `docs/assets/`.
