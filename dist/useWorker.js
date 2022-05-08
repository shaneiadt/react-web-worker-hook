"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorker = exports.STATUS = void 0;
const react_1 = require("react");
var STATUS;
(function (STATUS) {
    STATUS["IDLE"] = "IDLE";
    STATUS["SUCCESS"] = "SUCCESS";
    STATUS["UNSUPPORTED"] = "UNSUPPORTED";
    STATUS["ERROR"] = "ERROR";
    STATUS["SENT"] = "SENT";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
const fnToworkerURL = (fn) => {
    var blob = new Blob(["(" + fn.toString() + ")()"], {
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
    const [result, setResult] = (0, react_1.useState)("");
    const [status, setStatus] = (0, react_1.useState)(STATUS.IDLE);
    const [instance, setInstance] = (0, react_1.useState)(new WorkerBuilder(fnToworkerURL(action)));
    (0, react_1.useEffect)(() => {
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
    const postMessage = (arg) => {
        setStatus(STATUS.SENT);
        instance.postMessage(arg);
    };
    const updateAction = (action) => {
        setInstance(() => new WorkerBuilder(fnToworkerURL(action)));
    };
    return { postMessage, result, status, updateAction };
};
exports.useWorker = useWorker;
