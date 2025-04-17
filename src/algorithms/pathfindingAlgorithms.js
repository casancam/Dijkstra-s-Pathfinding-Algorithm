export function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  
  export function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
  }
  
  // Backtracks from the finishNode to find the shortest path.
  // Works for all algorithms that set the previousNode property
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  
  /******************************/
  /* 1. DIJKSTRA'S ALGORITHM   */
  /******************************/
  export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    
    while (unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      
      // If we encounter a wall, we skip it
      if (closestNode.isWall) continue;
      
      // If the closest node is at a distance of infinity,
      // we must be trapped and should stop
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      
      if (closestNode === finishNode) return visitedNodesInOrder;
      
      updateUnvisitedNeighbors(closestNode, grid);
    }
    
    return visitedNodesInOrder;
  }
  
  function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
  function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  }
  
  /******************************/
  /* 2. A* SEARCH ALGORITHM    */
  /******************************/
  export function astar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.totalDistance = calculateManhattanDistance(startNode, finishNode);
    const unvisitedNodes = getAllNodes(grid);
    
    while (unvisitedNodes.length) {
      sortNodesByTotalDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      
      // If we encounter a wall, we skip it
      if (closestNode.isWall) continue;
      
      // If the closest node is at a distance of infinity,
      // we must be trapped and should stop
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      
      if (closestNode === finishNode) return visitedNodesInOrder;
      
      updateUnvisitedNeighborsAstar(closestNode, grid, finishNode);
    }
    
    return visitedNodesInOrder;
  }
  
  function sortNodesByTotalDistance(unvisitedNodes) {
    unvisitedNodes.sort(
      (nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance
    );
  }
  
  function updateUnvisitedNeighborsAstar(node, grid, finishNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      // g(n) = distance from start to current node
      const distance = node.distance + 1;
      
      // Only update if the new path is shorter
      if (distance < neighbor.distance) {
        neighbor.distance = distance;
        neighbor.previousNode = node;
        
        // h(n) = heuristic (estimated distance from current to finish)
        const heuristic = calculateManhattanDistance(neighbor, finishNode);
        
        // f(n) = g(n) + h(n)
        neighbor.totalDistance = distance + heuristic;
      }
    }
  }
  
  function calculateManhattanDistance(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  }
  
  /******************************/
  /* 3. BREADTH-FIRST SEARCH   */
  /******************************/
  export function bfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const queue = [startNode];
    startNode.isVisited = true;
    
    while (queue.length) {
      const currentNode = queue.shift();
      visitedNodesInOrder.push(currentNode);
      
      if (currentNode === finishNode) return visitedNodesInOrder;
      
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (neighbor.isWall) continue;
        
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
    
    return visitedNodesInOrder;
  }
  
  /******************************/
  /* 4. DEPTH-FIRST SEARCH     */
  /******************************/
  export function dfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const stack = [startNode];
    startNode.isVisited = true;
    
    while (stack.length) {
      const currentNode = stack.pop();
      visitedNodesInOrder.push(currentNode);
      
      if (currentNode === finishNode) return visitedNodesInOrder;
      
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (neighbor.isWall) continue;
        
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
    
    return visitedNodesInOrder;
  }
  
  /******************************/
  /* 5. Greedy Best-First Search */
  /******************************/
  export function greedyBFS(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = [startNode];
    
    while (unvisitedNodes.length) {
      // Sort by heuristic only (not considering path distance)
      unvisitedNodes.sort(
        (nodeA, nodeB) => 
          calculateManhattanDistance(nodeA, finishNode) - 
          calculateManhattanDistance(nodeB, finishNode)
      );
      
      const closestNode = unvisitedNodes.shift();
      
      // If we encounter a wall, we skip it
      if (closestNode.isWall) continue;
      
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      
      if (closestNode === finishNode) return visitedNodesInOrder;
      
      const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
      for (const neighbor of unvisitedNeighbors) {
        neighbor.previousNode = closestNode;
        if (!neighbor.isVisited) unvisitedNodes.push(neighbor);
      }
    }
    
    return visitedNodesInOrder;
  }