import { useState } from "react";
import "./styles.css";
import { useDraggable } from "./useDraggable";

export default function App() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    translateX: 0,
    translateY: 0
  });
  const dragEvents = useDraggable(
    //During move, send the offset position from position before dragging
    (positionOffset) => {
      setPosition({
        ...position,
        //Modify translate, instead of top, left,  during movement increase performance
        translateX: positionOffset.x,
        translateY: positionOffset.y
      });
    },
    //When movement has ended, we update the top, left props
    (positionOffset) => {
      setPosition({
        x: position.x + position.translateX,
        y: position.y + position.translateY,
        translateX: 0,
        translateY: 0
      });
    }
  );
  return (
    <div
      style={{
        width: 200,
        height: 200,
        backgroundColor: "red",
        position: "absolute",
        top: position.y,
        left: position.x,
        transform: `translate(${position.translateX}px, ${position.translateY}px)`
      }}
      {...dragEvents}
    >
      Drag me
    </div>
  );
}
