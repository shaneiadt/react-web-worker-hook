import { useEffect, useState } from "react";

export type Work = () => (this: Window, e: MessageEvent<any>) => void;

export enum STATUS {
  IDLE = "IDLE",
  SUCCESS = "SUCCESS",
  UNSUPPORTED = "UNSUPPORTED",
  ERROR = "ERROR",
  SENT = "SENT",
}

const fnToworkerURL = (fn: Function) => {
  var blob = new Blob(["(" + fn.toString() + ")()"], {
    type: "text/javascript",
  });
  return URL.createObjectURL(blob);
};

class WorkerBuilder extends Worker {
  constructor(url: string) {
    super(url);

    return new Worker(url);
  }
}

export const useWorker = <T extends object | number | string>(
  action: () => void
): {
  postMessage: (arg: T) => void;
  result: string;
  status: STATUS;
  updateAction: (action: () => void) => void;
} => {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
  const [instance, setInstance] = useState(
    new WorkerBuilder(fnToworkerURL(action))
  );

  useEffect(() => {
    setInstance(() => new WorkerBuilder(fnToworkerURL(action)));
  }, [action]);

  instance.onmessage = ({ data }) => {
    setStatus(STATUS.SUCCESS);
    if (data) {
      setResult(data);
    }
  };

  instance.onerror = (e) => {
    console.error(e);
    setStatus(STATUS.ERROR);
  };

  const postMessage = (arg: T) => {
    setStatus(STATUS.SENT);
    instance.postMessage(arg);
  };

  const updateAction = (action: () => void) => {
    setInstance(() => new WorkerBuilder(fnToworkerURL(action)));
  };

  return { postMessage, result, status, updateAction };
};
