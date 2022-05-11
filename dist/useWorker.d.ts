export declare type Work = () => (this: Window, e: MessageEvent<any>) => void;
export declare enum STATUS {
    IDLE = "IDLE",
    SUCCESS = "SUCCESS",
    UNSUPPORTED = "UNSUPPORTED",
    ERROR = "ERROR",
    PROCESSING = "PROCESSING"
}
export declare const useWorker: <T, K>(action: () => void) => {
    postMessage: (arg: T) => void;
    result: K | undefined;
    status: {
        status: STATUS;
        error?: ErrorEvent | undefined;
    };
    updateAction: (userAction: () => void) => void;
};
