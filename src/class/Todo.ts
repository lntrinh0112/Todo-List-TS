export class Todo {
  private _title: string;
  private _status: boolean;

  public constructor(title: string, isCompleted: boolean = false) {
    this._title = title;
    this._status = isCompleted;
  }

  public set title(theTitle: string) {
    this._title = theTitle;
  }
  public get title(): string {
    return this._title;
  }
  public set status(isCompleted: boolean) {
    this._status = isCompleted;
  }
  public get status(): boolean {
    return this._status;
  }
}
