"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorker = exports.STATUS = void 0;
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-constructor-return */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
const react_1 = require("react");
var STATUS;
(function (STATUS) {
    STATUS["IDLE"] = "IDLE";
    STATUS["SUCCESS"] = "SUCCESS";
    STATUS["UNSUPPORTED"] = "UNSUPPORTED";
    STATUS["ERROR"] = "ERROR";
    STATUS["PROCESSING"] = "PROCESSING";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
const fnToworkerURL = (fn) => {
    const blob = new Blob([`(${fn.toString()})()`], {
        type: "text/javascript",
    });
    return URL.createObjectURL(blob);
};
class WorkerBuilder extends Worker {
    constructor(url) {
        super(url);
        return new Worker(url);
    }
}
const useWorker = (action) => {
    const [result, setResult] = (0, react_1.useState)();
    const [status, setStatus] = (0, react_1.useState)({
        status: STATUS.IDLE,
    });
    const [instance, setInstance] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        if (!window.Worker)
            return setStatus({ status: STATUS.UNSUPPORTED });
        setEventListeners(new WorkerBuilder(fnToworkerURL(action)));
    }, [action]);
    const setEventListeners = (instance) => {
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
    const postMessage = (arg) => {
        setStatus({ status: STATUS.PROCESSING });
        instance?.postMessage(arg);
    };
    const updateAction = (newAction) => {
        setEventListeners(new WorkerBuilder(fnToworkerURL(newAction)));
    };
    return { postMessage, result, status, updateAction };
};
exports.useWorker = useWorker;
