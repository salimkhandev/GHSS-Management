import React, { useState, useRef } from "react";

function Example() {
    const [count, setCount] = useState(0);  // State
    const refValue = useRef(0);  // Ref

    console.log("Component Rendered!"); // This logs every re-render

    const increaseState = () => {
        setCount(count + 1); // Triggers re-render
    };

    const increaseRef = () => {
        refValue.current += 1; // Does NOT trigger re-render
        console.log("Ref Value:", refValue.current); // Updated value is logged
    };

    return (
        <div>
            <h2>State: {count}</h2>
            <h2>Ref: {refValue.current}</h2> {/* This won't update in UI unless a re-render happens */}
            <button onClick={increaseState}>Increase State</button>
            <button onClick={increaseRef}>Increase Ref</button>
        </div>
    );
}

export default Example;
