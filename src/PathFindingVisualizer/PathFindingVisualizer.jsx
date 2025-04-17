import React, { useState, useEffect } from "react";
import Node from "./Node/Node";
import {
  dijkstra,
  astar,
  bfs,
  dfs,
  greedyBFS,
  getNodesInShortestPathOrder,
} from "../algorithms/pathfindingAlgorithms";
import {
  generateRandomMaze,
  generateRecursiveDivisionMaze,
  generatePatternMaze,
} from "../algorithms/mazeGenerators";
import "./PathFindingVisualizer.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("dijkstra");
  const [animationSpeed, setAnimationSpeed] = useState("normal");
  const [metrics, setMetrics] = useState({
    nodesVisited: 0,
    pathLength: 0,
    executionTime: 0,
    showMetrics: false,
  });

  // Algorithm metadata for UI display
  const algorithms = {
    dijkstra: {
      name: "Dijkstra's Algorithm",
      description:
        "Guarantees the shortest path, explores uniformly in all directions.",
      isWeighted: true,
      guaranteesShortest: true,
    },
    astar: {
      name: "A* Search",
      description:
        "Uses heuristics to find the shortest path more efficiently than Dijkstra.",
      isWeighted: true,
      guaranteesShortest: true,
    },
    bfs: {
      name: "Breadth-First Search",
      description:
        "Explores nearest neighbors first, guarantees shortest path in unweighted graphs.",
      isWeighted: false,
      guaranteesShortest: true,
    },
    dfs: {
      name: "Depth-First Search",
      description:
        "Explores as far as possible along each branch before backtracking.",
      isWeighted: false,
      guaranteesShortest: false,
    },
    greedyBFS: {
      name: "Greedy Best-First Search",
      description:
        "Always moves toward the goal using heuristics, ignoring path costs.",
      isWeighted: true,
      guaranteesShortest: false,
    },
  };

  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
  }, []);

  const handleMouseDown = (row, col) => {
    if (isVisualizing) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isVisualizing) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  // Generate a random maze with walls
  const generateRandomWalls = () => {
    if (isVisualizing) return;

    // Get start and finish nodes
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    // Generate maze using the imported function
    const newGrid = generateRandomMaze(grid, startNode, finishNode);
    setGrid(newGrid);

    // Update DOM to reflect maze changes
    updateNodeClassesAfterMazeGeneration(newGrid);
  };

  // Generate a maze with recursive division
  const generateMazeRecursive = () => {
    if (isVisualizing) return;

    // Get start and finish nodes
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    // Generate maze using the imported function
    const newGrid = generateRecursiveDivisionMaze(grid, startNode, finishNode);
    setGrid(newGrid);

    // Update DOM to reflect maze changes
    updateNodeClassesAfterMazeGeneration(newGrid);
  };

  // Generate a pattern-based maze
  const generateMazePattern = () => {
    if (isVisualizing) return;

    // Get start and finish nodes
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    // Generate maze using the imported function
    const newGrid = generatePatternMaze(grid, startNode, finishNode);
    setGrid(newGrid);

    // Update DOM to reflect maze changes
    updateNodeClassesAfterMazeGeneration(newGrid);
  };

  // Helper function to update node classes after maze generation
  const updateNodeClassesAfterMazeGeneration = (grid) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const node = grid[row][col];
        const nodeElement = document.getElementById(`node-${row}-${col}`);

        if (!nodeElement) continue; // Skip if node doesn't exist

        if (node.isStart) {
          nodeElement.className = "node node-start";
        } else if (node.isFinish) {
          nodeElement.className = "node node-finish";
        } else if (node.isWall) {
          nodeElement.className = "node node-wall";
        } else {
          nodeElement.className = "node";
        }
      }
    }
  };

  const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    // Determine animation speed based on user selection
    const getVisitedDelay = () => {
      switch (animationSpeed) {
        case "slow":
          return 30;
        case "fast":
          return 8;
        case "normal":
        default:
          return 15;
      }
    };

    const visitedDelay = getVisitedDelay();

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, visitedDelay * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, visitedDelay * i);
    }

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, visitedDelay * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, visitedDelay * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    const getPathDelay = () => {
      switch (animationSpeed) {
        case "slow":
          return 80;
        case "fast":
          return 25;
        case "normal":
        default:
          return 50;
      }
    };

    const pathDelay = getPathDelay();

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, pathDelay * i);
    }

    // Enable interactions after animation completes
    setTimeout(() => {
      setIsVisualizing(false);
      // Metrics are already showing at this point because they were set before animation started
    }, pathDelay * nodesInShortestPathOrder.length + 100);
  };

  const visualizeAlgorithm = () => {
    if (isVisualizing) return;
    setIsVisualizing(true);

    // Hide previous metrics
    setMetrics({
      nodesVisited: 0,
      pathLength: 0,
      executionTime: 0,
      showMetrics: false,
    });

    // Reset previously visited nodes
    const newGrid = grid.map((row) =>
      row.map((node) => {
        const nodeElement = document.getElementById(
          `node-${node.row}-${node.col}`
        );
        if (
          nodeElement &&
          (nodeElement.className === "node node-visited" ||
            nodeElement.className === "node node-shortest-path")
        ) {
          nodeElement.className = "node";
        }
        return {
          ...node,
          isVisited: false,
          distance: Infinity,
          totalDistance: Infinity,
          previousNode: null,
        };
      })
    );
    setGrid(newGrid);

    const startNode = newGrid[START_NODE_ROW][START_NODE_COL];
    const finishNode = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];

    // Measure execution time
    const startTime = performance.now();

    // Select algorithm based on user choice
    let visitedNodesInOrder;
    switch (selectedAlgorithm) {
      case "astar":
        visitedNodesInOrder = astar(newGrid, startNode, finishNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(newGrid, startNode, finishNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(newGrid, startNode, finishNode);
        break;
      case "greedyBFS":
        visitedNodesInOrder = greedyBFS(newGrid, startNode, finishNode);
        break;
      case "dijkstra":
      default:
        visitedNodesInOrder = dijkstra(newGrid, startNode, finishNode);
        break;
    }

    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2);

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    // Update metrics
    setMetrics({
      nodesVisited: visitedNodesInOrder.length,
      pathLength: nodesInShortestPathOrder.length,
      executionTime: executionTime,
      showMetrics: true,
    });

    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const resetGrid = () => {
    if (isVisualizing) return;
    const newGrid = getInitialGrid();
    setGrid(newGrid);

    // Reset node visual classes
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        const nodeElement = document.getElementById(`node-${row}-${col}`);
        const isStart = row === START_NODE_ROW && col === START_NODE_COL;
        const isFinish = row === FINISH_NODE_ROW && col === FINISH_NODE_COL;

        if (isStart) {
          nodeElement.className = "node node-start";
        } else if (isFinish) {
          nodeElement.className = "node node-finish";
        } else {
          nodeElement.className = "node";
        }
      }
    }
    setMetrics({
      nodesVisited: 0,
      pathLength: 0,
      executionTime: 0,
      showMetrics: false,
    });
  };

  return (
    <div className="pathfinding-visualizer">
      <header className="visualizer-header">
        <h1>Pathfinding Visualizer</h1>
        <p>
          Draw walls with your mouse. Then visualize different pathfinding
          algorithms.
        </p>
      </header>

      {metrics.showMetrics && (
        <div className="metrics-container">
          <div className="metrics-card">
            <h3>Algorithm Metrics</h3>
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-value">{metrics.nodesVisited}</span>
                <span className="metric-label">Nodes Visited</span>
              </div>
              <div className="metric">
                <span className="metric-value">{metrics.pathLength}</span>
                <span className="metric-label">Path Length</span>
              </div>
              <div className="metric">
                <span className="metric-value">{metrics.executionTime} ms</span>
                <span className="metric-label">Execution Time</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="algorithm-selector">
        <h2>Select an Algorithm</h2>
        <div className="algorithm-cards">
          {Object.entries(algorithms).map(([key, algorithm]) => (
            <div
              key={key}
              className={`algorithm-card ${
                selectedAlgorithm === key ? "selected" : ""
              }`}
              onClick={() => !isVisualizing && setSelectedAlgorithm(key)}
            >
              <h3>{algorithm.name}</h3>
              <p>{algorithm.description}</p>
              <div className="algorithm-properties">
                <span
                  className={
                    algorithm.guaranteesShortest ? "guarantee" : "no-guarantee"
                  }
                >
                  {algorithm.guaranteesShortest
                    ? "Guarantees shortest path"
                    : "Does not guarantee shortest path"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="maze-controls">
        <h3>Generate Maze</h3>
        <div className="maze-buttons">
          <button
            className="maze-button"
            onClick={generateRandomWalls}
            disabled={isVisualizing}
            title="Creates a random maze with walls"
          >
            Random Walls
          </button>
          <button
            className="maze-button"
            onClick={generateMazeRecursive}
            disabled={isVisualizing}
            title="Creates a maze using recursive division"
          >
            Recursive Division
          </button>
          <button
            className="maze-button"
            onClick={generateMazePattern}
            disabled={isVisualizing}
            title="Creates a pattern-based maze"
          >
            Pattern Maze
          </button>
        </div>
      </div>

      <div className="controls">
        <button
          className="button visualize-button"
          onClick={visualizeAlgorithm}
          disabled={isVisualizing}
        >
          {isVisualizing
            ? "Visualizing..."
            : `Visualize ${algorithms[selectedAlgorithm].name}`}
        </button>
        <button
          className="button reset-button"
          onClick={resetGrid}
          disabled={isVisualizing}
        >
          Reset Grid
        </button>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-box start-box"></div>
          <span>Start Node</span>
        </div>
        <div className="legend-item">
          <div className="legend-box finish-box"></div>
          <span>Target Node</span>
        </div>
        <div className="legend-item">
          <div className="legend-box wall-box"></div>
          <span>Wall</span>
        </div>
        <div className="legend-item">
          <div className="legend-box visited-box"></div>
          <span>Visited Node</span>
        </div>
        <div className="legend-item">
          <div className="legend-box path-box"></div>
          <span>Shortest Path</span>
        </div>
      </div>

      <div className="grid-container">
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="grid-row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={handleMouseDown}
                      onMouseEnter={handleMouseEnter}
                      onMouseUp={handleMouseUp}
                      row={row}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default PathfindingVisualizer;

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];

  // Don't toggle walls for start and finish nodes
  if (node.isStart || node.isFinish) return newGrid;

  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
