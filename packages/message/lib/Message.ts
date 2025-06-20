export interface Message {
    type: number;
    from: string;
    to: string;
    timestamp: number;
    sid: string;
    tid: string;
    token: string;
    flags: any;
    payload: JSON
}
function normalizeMessage(origin: JSON): Message {
    return mergeOptions({
        type: 0,
        from: '',
        to: '',
        timestamp: new Date().getTime(),
        sid: 0,
        tid: 0,
        token: '',
        flags: getDefaultMessageFlags(),
        payload: {}
    },, origin)
}