/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-constructor-return */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

export type Work = () => (this: Window, e: MessageEvent<any>) => void;

export enum STATUS {
  IDLE = "IDLE",
  SUCCESS = "SUCCESS",
  UNSUPPORTED = "UNSUPPORTED",
  ERROR = "ERROR",
  PROCESSING = "PROCESSING",
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
  status: { status: STATUS; error?: ErrorEvent };
  updateAction: (userAction: () => void) => void;
} => {
  const [result, setResult] = useState<K>();
  const [status, setStatus] = useState<{ status: STATUS; error?: ErrorEvent }>({
    status: STATUS.IDLE,
  });
  const [instance, setInstance] = useState<WorkerBuilder>();

  useEffect(() => {
    if (!window.Worker) return setStatus({ status: STATUS.UNSUPPORTED });

    setEventListeners(new WorkerBuilder(fnToworkerURL(action)));
  }, [action]);

  const setEventListeners = (instance: WorkerBuilder) => {
    setStatus({ status: STATUS.IDLE });
    setResult(undefined);

    instance.onmessage = ({ data }) => {
      setStatus({ status: STATUS.SUCCESS });
      if (data) {
        setResult(data);
      }
    };

    instance.onerror = (error) => {
      setStatus({ status: STATUS.ERROR, error });
    };

    setInstance(() => instance);
  };

  const postMessage = (arg: T) => {
    setStatus({ status: STATUS.PROCESSING });
    instance?.postMessage(arg);
  };

  const updateAction = (newAction: () => void) => {
    setEventListeners(new WorkerBuilder(fnToworkerURL(newAction)));
  };

  return { postMessage, result, status, updateAction };
};
