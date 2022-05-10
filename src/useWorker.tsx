/* eslint-disable no-shadow */
/* eslint-disable no-constructor-return */
/* eslint-disable no-unused-vars */
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
  const blob = new Blob([`(${fn.toString()})()`], {
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

export const useWorker = <T, K>(
  action: () => void
): {
  postMessage: (arg: T) => void;
  result: K | undefined;
  status: STATUS;
  updateAction: (userAction: () => void) => void;
} => {
  const [result, setResult] = useState<K>();
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
  const [instance, setInstance] = useState<WorkerBuilder>();

  useEffect(() => {
    if (!window.Worker) {
      setStatus(STATUS.UNSUPPORTED);
    } else {
      updateAction(action);
    }
  }, [action]);

  const setEventListeners = () => {
    if (STATUS.UNSUPPORTED || !instance) return;

    instance.onmessage = ({ data }) => {
      setStatus(STATUS.SUCCESS);
      if (data) {
        setResult(data);
      }
    };

    instance.onerror = (e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      setStatus(STATUS.ERROR);
    };
  };

  const postMessage = (arg: T) => {
    if (STATUS.UNSUPPORTED || !instance) return;

    setStatus(STATUS.SENT);
    instance.postMessage(arg);
  };

  const updateAction = (userAction: () => void) => {
    setInstance(() => new WorkerBuilder(fnToworkerURL(userAction)));
    setEventListeners();
  };

  return { postMessage, result, status, updateAction };
};
