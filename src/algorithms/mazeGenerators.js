// Advanced maze generation algorithms
export const generateRandomMaze = (grid, startNode, finishNode) => {
    // Simple random maze with 25% probability for walls
    const newGrid = grid.map((row) => [...row]);
  
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[0].length; col++) {
        if (isStartOrFinishNode(row, col, startNode, finishNode)) continue;
  
        if (Math.random() < 0.25) {
          newGrid[row][col] = {
            ...newGrid[row][col],
            isWall: true,
          };
        }
      }
    }
  
    return newGrid;
  };
  
  export const generateRecursiveDivisionMaze = (grid, startNode, finishNode) => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isWall: false,
      }))
    );
  
    // Add boundary walls
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[0].length; col++) {
        if (
          row === 0 ||
          col === 0 ||
          row === newGrid.length - 1 ||
          col === newGrid[0].length - 1
        ) {
          if (!isStartOrFinishNode(row, col, startNode, finishNode)) {
            newGrid[row][col].isWall = true;
          }
        }
      }
    }
  
    // Recursively divide the maze
    recursiveDivision(
      newGrid,
      1,
      newGrid.length - 2,
      1,
      newGrid[0].length - 2,
      chooseOrientation(newGrid.length - 2, newGrid[0].length - 2),
      startNode,
      finishNode
    );
  
    return newGrid;
  };
  
  const recursiveDivision = (
    grid,
    rowStart,
    rowEnd,
    colStart,
    colEnd,
    orientation,
    startNode,
    finishNode
  ) => {
    if (rowEnd - rowStart < 2 || colEnd - colStart < 2) {
      return;
    }
  
    const horizontal = orientation === "horizontal";
  
    // Where will the wall be drawn?
    let wallRow = horizontal ? randomNumber(rowStart, rowEnd - 1) : rowStart;
  
    let wallCol = horizontal ? colStart : randomNumber(colStart, colEnd - 1);
  
    // Where will the passage through the wall be?
    const passageRow = horizontal ? wallRow : randomNumber(rowStart, rowEnd);
  
    const passageCol = horizontal ? randomNumber(colStart, colEnd) : wallCol;
  
    // Direction to draw the wall
    const wallDirection = horizontal ? [0, 1] : [1, 0];
  
    // Length of the wall
    const wallLength = horizontal ? colEnd - colStart + 1 : rowEnd - rowStart + 1;
  
    // Build the wall with a passage
    for (let i = 0; i < wallLength; i++) {
      const row = wallRow + i * wallDirection[0];
      const col = wallCol + i * wallDirection[1];
  
      if (row === passageRow && col === passageCol) continue;
      if (isStartOrFinishNode(row, col, startNode, finishNode)) continue;
  
      grid[row][col].isWall = true;
    }
  
    // Next orientation
    const nextOrientation = chooseOrientation(
      horizontal ? rowEnd - wallRow : rowEnd - rowStart,
      horizontal ? colEnd - colStart : colEnd - wallCol
    );
  
    // Recursively divide the sub-chambers
    if (horizontal) {
      recursiveDivision(
        grid,
        rowStart,
        wallRow - 1,
        colStart,
        colEnd,
        nextOrientation,
        startNode,
        finishNode
      );
      recursiveDivision(
        grid,
        wallRow + 1,
        rowEnd,
        colStart,
        colEnd,
        nextOrientation,
        startNode,
        finishNode
      );
    } else {
      recursiveDivision(
        grid,
        rowStart,
        rowEnd,
        colStart,
        wallCol - 1,
        nextOrientation,
        startNode,
        finishNode
      );
      recursiveDivision(
        grid,
        rowStart,
        rowEnd,
        wallCol + 1,
        colEnd,
        nextOrientation,
        startNode,
        finishNode
      );
    }
  };
  
  export const generatePatternMaze = (grid, startNode, finishNode) => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isWall: false,
      }))
    );
  
    // Create a maze pattern with vertical bars
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[0].length; col++) {
        // Don't place walls near start/finish nodes
        if (isNearStartOrFinish(row, col, startNode, finishNode, 2)) continue;
  
        // Vertical bars pattern with gaps
        if (col % 4 === 0 && row % 4 !== 0) {
          newGrid[row][col].isWall = true;
        }
      }
    }
  
    return newGrid;
  };
  
  // Helper functions
  const isStartOrFinishNode = (row, col, startNode, finishNode) => {
    return (
      (row === startNode.row && col === startNode.col) ||
      (row === finishNode.row && col === finishNode.col)
    );
  };
  
  const isNearStartOrFinish = (row, col, startNode, finishNode, proximity) => {
    return (
      (Math.abs(row - startNode.row) <= proximity &&
        Math.abs(col - startNode.col) <= proximity) ||
      (Math.abs(row - finishNode.row) <= proximity &&
        Math.abs(col - finishNode.col) <= proximity)
    );
  };
  
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  const chooseOrientation = (width, height) => {
    if (width < height) {
      return "horizontal";
    } else if (height < width) {
      return "vertical";
    } else {
      return Math.random() < 0.5 ? "horizontal" : "vertical";
    }
  };

  