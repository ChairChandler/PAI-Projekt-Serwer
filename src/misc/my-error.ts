export default class MyError extends Error {
    constructor(public message: string) {
        super(message);
    }
}