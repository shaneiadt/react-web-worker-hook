export declare type Work = () => (this: Window, e: MessageEvent<any>) => void;
export declare enum STATUS {
    IDLE = "IDLE",
    SUCCESS = "SUCCESS",
    UNSUPPORTED = "UNSUPPORTED",
    ERROR = "ERROR",
    SENT = "SENT"
}
export declare const useWorker: <T extends string | number | object>(action: () => void) => {
    postMessage: (arg: T) => void;
    result: string;
    status: STATUS;
    updateAction: (action: () => void) => void;
};
