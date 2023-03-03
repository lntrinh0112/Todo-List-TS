export class Todo {
    constructor(title, isCompleted = false) {
        this._title = title;
        this._status = isCompleted;
    }
    set title(theTitle) {
        this._title = theTitle;
    }
    get title() {
        return this._title;
    }
    set status(isCompleted) {
        this._status = isCompleted;
    }
    get status() {
        return this._status;
    }
}
//# sourceMappingURL=Todo.js.map