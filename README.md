# react-web-worker-hook

Custom React Hook for the Web Workers API.

## Usage:

First step is to install the package

```
npm i web-worker-react-hook
```

or

```
yarn add web-worker-react-hook
```

Import the `useWorker` hook and if using TypeScript the `Work` type is available for typing the action / job function to be passed into the worker itself.

```
import { Work, useWorker } from "web-worker-react-hook";
```

Define a function that you want to be executed on a seperate thread.

```
const job: Work = () =>
  // your function must define an onmessage function and if you wish to interact with the data an Event object is passed in as an argument

  (onmessage = (e) => {

    // timeout is used here to simulate network or high CPU load

    setTimeout(() => {
      // the below will take a number from the Event object and run the fibonacci sequence returning the result

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

      // passing messages back to your main thread can be done using the postMessage function

      postMessage(result);
    }, 2000);
  });
```

All you have to do now is register your new job / function with the `useWorker` hook. Once registered you're giving a few different options;

- postMessage: used to send messages to your worker function

- result: when your worker calls postMessage to send a message back to your app the result can be found here

- status: displays the current status of the Web Worker (a STATUS enum can also be used to grab these values)

- updateAction: this function can be used to pass a new worker function registering a new dedicated Web Worker

```
type PostMessageArgumentType = number;
type ResultType = number;

export default function App() {
  const { postMessage, result, status, updateAction } = useWorker<PostMessageArgumentType, ResultType>(job);

  return (
    <div className="App">
      <p>Result: {JSON.stringify(result)}</p>
      <p>Status: {JSON.stringify(status)}</p>

      <button onClick={() => postMessage(58)}>Send Job</button>
    </div>
  );
}
```
