/** @jsx j */
import { j } from "../src";
import { useState, dispatcherBuilder } from "../src/hooks";

export function Counter() {
  const [count, setCount] = useState(2);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count <= 0) {
      return;
    }
    setCount(count - 1);
  };

  return (
    <div>
      <h4>Count: {count.toString()}</h4>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
