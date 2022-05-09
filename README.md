# react-web-worker-hook

Custom React Hook for the Web Workers API.

## Usage:

```
import { Work, useWorker } from "web-worker-react-hook";

import "./styles.css";

const job1: Work = () =>
  (onmessage = (e) => {
    setTimeout(() => {
      const nbr = e.data;
      var n1 = 0;
      var n2 = 1;
      var somme = 0;

      for (let i = 2; i <= nbr; i++) {
        somme = n1 + n2;

        n1 = n2;

        n2 = somme;
      }

      const result = nbr ? n2 : n1;

      postMessage(result);
    }, 2000);
  });

export default function App() {
  const { postMessage, result, status } = useWorker<number>(job1);

  return (
    <div className="App">
      <h2>Simple Web Worker React Hook</h2>
      <p>Result: {JSON.stringify(result)}</p>
      <p>Status: {JSON.stringify(status)}</p>
      <button onClick={() => postMessage(58)}>Send Job 1</button>
    </div>
  );
}
```

Example: https://codesandbox.io/s/web-worker-react-hook-dh7hcs
