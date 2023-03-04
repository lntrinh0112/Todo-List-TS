import { Todo } from "./class/Todo.js";

class App {
  private listTodos: Todo[] = [];
  public constructor() {
    this.loadApp();
  }
  public loadApp(): void {
    this.renderData();
    this.renderUI();
    this.setCountTodoLeft();
  }

  public renderData() {
    const data = JSON.parse(localStorage.getItem("list-todos"));
    if (data !== null) {
      data.forEach((todo) => {
        this.addTodoToListView(todo);
        this.addTodotoData(todo);
      });
    }
  }
  public addTodoToListView(newTodo: Todo): void {
    let listTodosElement = document.querySelector(".todo-list");
    let todoItem = document.createElement("li");
    let divView = document.createElement("div");
    let inputCheck = document.createElement("input");
    let todoItemName = document.createElement("label");
    let btnRemove = document.createElement("button");
    divView.classList.add("view");
    inputCheck.classList.add("toggle");
    btnRemove.classList.add("destroy");
    inputCheck.setAttribute("type", "checkbox");
    inputCheck.setAttribute("id", "btnCheck");
    todoItemName.setAttribute("id", "text-label");
    todoItemName.textContent = newTodo["_title"];
    if (newTodo["_status"]) {
      inputCheck.setAttribute("checked", "checked");
    }
    divView.appendChild(inputCheck);
    divView.appendChild(todoItemName);
    divView.appendChild(btnRemove);
    todoItem.appendChild(divView);
    listTodosElement.appendChild(todoItem);
    btnRemove.addEventListener("click", (event) => {
      const todoTarget = (event.target as Element).parentElement.parentElement;
      this.removeTodo(todoTarget);
      todoTarget.remove();
      this.saveListTodos();
      this.setCountTodoLeft();
    });

    inputCheck.addEventListener("click", (event) => {
      // const showLeft = document.querySelector(".ListItemsLeft");
      // if (showLeft.classList.contains("active")) {
      //   event.target.closest("li").classList.add("hidden");
      // }
      // const showCompleted = document.querySelector(".ListItemsCompleted");
      // if (showCompleted.classList.contains("active")) {
      //   event.target.closest("li").classList.add("hidden");
      // }
      // console.log("Before", this.listTodos);
      const todoTarget = (event.target as Element).parentElement.parentElement;
      this.changeStatusTodo(todoTarget);
      this.saveListTodos();

      // this.changeStateElement(event.target.closest("li"));
      // this.changeItemByElement(event.target.closest("li"));
      // this.saveData();
      // this.renderFooter();
      this.setCountTodoLeft();
    });
    // todoItemName.addEventListener("click", (event) => {
    //   var elementEdit = event.target.closest("li");
    //   elementEdit.querySelector("label").setAttribute("style", "cursor: text");
    //   todoItemName.contentEditable = true;
    //   todoItemName.addEventListener("keypress", (event) => {
    //     if (event.key === "Enter") {
    //       todoItemName.contentEditable = false;
    //       this.changeItemByElement(elementEdit);
    //       elementEdit
    //         .querySelector("label")
    //         .setAttribute("style", "cursor: default");
    //     }
    //   });
    // });
  }
  public addTodotoData(todo: Todo): void {
    this.listTodos.push(todo as Todo);
  }

  public renderUI(): void {
    const input = document.getElementById("new-todo");
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        var valueInput: string = input["value"];
        if (valueInput.length != 0) {
          const newTodo = new Todo(valueInput);
          this.addTodoToListView(newTodo);
          this.clearInput();
          this.addTodotoData(newTodo);
          this.saveListTodos();
          this.setCountTodoLeft();
        }
      }
    });
  }
  public clearInput(): void {
    document.getElementById("new-todo")["value"] = "";
  }
  public removeTodo(todo: HTMLElement): void {
    this.listTodos.splice(this.getIndexOfTodo(todo), 1);
  }
  public getIndexOfTodo(todo: HTMLElement): number {
    return Array.from(todo.parentElement.children).indexOf(todo);
  }
  public saveListTodos(): void {
    localStorage.setItem("list-todos", JSON.stringify(this.listTodos));
  }
  public changeStatusTodo(todo: HTMLElement): void {
    this.listTodos[this.getIndexOfTodo(todo)]["_status"] =
      this.getCurrentStatusTodo(todo);
  }
  public getCurrentStatusTodo(todo: HTMLElement): boolean {
    return (todo.querySelector("input[type='checkbox']") as HTMLInputElement)
      .checked;
  }

  public setCountTodoLeft(): void {
    document.querySelector(".todo-count strong").innerHTML =
      this.findTodoLeft().length.toString();
  }
  public findTodoLeft() {
    return this.listTodos.filter((todo: Todo) => {
      return todo["_status"] === false;
    });
  }
}
const TodoList = new App();
