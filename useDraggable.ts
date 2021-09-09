import {
  Dispatch,
  DragEvent,
  MouseEvent,
  SetStateAction,
  TouchEvent,
  useState,
} from 'react';

export type Position = { x: number; y: number };

const move = (
  e: MouseEvent | DragEvent | TouchEvent,
  position: Position,
  setPositionOffset: Dispatch<SetStateAction<Position>>,
  moveCb: (posOffset: Position) => void,
) => {
  const clientX = (e as TouchEvent).touches
    ? (e as TouchEvent).touches[0].clientX
    : (e as MouseEvent | DragEvent).clientX;
  const clientY = (e as TouchEvent).touches
    ? (e as TouchEvent).touches[0].clientY
    : (e as MouseEvent | DragEvent).clientY;
  //onDrag event send a last event with clientX and clientY = 0 on mouse up
  if (clientX !== 0 && clientY !== 0) {
    setPositionOffset((prev) => {
      const posOffset = {
        x: clientX - position.x,
        y: clientY - position.y,
      };

      moveCb(posOffset);

      return posOffset;
    });
  }
};

const moveEnd = (
  e: MouseEvent | DragEvent | TouchEvent | globalThis.MouseEvent,
  endCb: (positionOffset: Position) => void,
  positionOffset: Position,
) => {
  endCb(positionOffset);
};

/**
 * Hook to make a node draggable
 * @param moveCb cb received when moving. It gets the position offset in px
 * @param endCb cb received when end moving. It gets the position offset in px
 */

export const useDraggable = (
  moveCb: (positionOffset: Position) => void,
  endCb: (positionOffset: Position) => void,
) => {
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [positionOffset, setPositionOffset] = useState({ x: 0, y: 0 });

  return {
    draggable: true,
    onDragStart: (e: DragEvent<any>) => {
      e.dataTransfer.setDragImage(document.createElement('b'), 0, 0);
      setInitialPosition({ x: e.clientX, y: e.clientY });
    },

    onDrag: (e: DragEvent<any>) => {
      move(e, initialPosition, setPositionOffset, moveCb);
    },
    onDragEnd: (e: DragEvent<any>) => {
      moveEnd(e, endCb, positionOffset);
    },
    onTouchStart: (e: TouchEvent<any>) => {
      setInitialPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    },
    onTouchMove: (e: TouchEvent<any>) => {
      move(e, initialPosition, setPositionOffset, moveCb);
    },
    onTouchEnd: (e: TouchEvent<any>) => {
      moveEnd(e, endCb, positionOffset);
    },
  };
};
