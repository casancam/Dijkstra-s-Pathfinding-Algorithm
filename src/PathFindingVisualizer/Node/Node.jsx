import React from 'react';
import './Node.css';

const Node = ({
  col,
  isFinish,
  isStart,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  row,
}) => {
  const extraClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      aria-label={
        isStart
          ? 'Start node'
          : isFinish
          ? 'Finish node'
          : isWall
          ? 'Wall node'
          : 'Empty node'
      }
    ></div>
  );
};

export default Node;