import { Todo } from "./class/Todo.js";

class App {
  private listTodos: Todo[] = [];
  public constructor() {
    this.loadApp();
  }
  public loadApp(): void {
    this.renderData();
    this.renderUI();
  }

  public renderData() {
    const data = JSON.parse(localStorage.getItem("todo-list"));
    if (data != null) {
      data.forEach((todo) => {
        // this.addTodoToListView(todo);
        // this.addTodotoData(todo);
        this.setCountItemLeft();
      });
    }
  }
  public addTodoToListView(newTodo: Todo): void {
    let todoList = document.querySelector(".todo-list");
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
    todoItemName.textContent = newTodo.title;
    if (newTodo.status) {
      inputCheck.setAttribute("checked", "checked");
    }
    divView.appendChild(inputCheck);
    divView.appendChild(todoItemName);
    divView.appendChild(btnRemove);
    todoItem.appendChild(divView);
    todoList.appendChild(todoItem);
    btnRemove.addEventListener("click", (event) => {
      const todoTarget = (event.target as Element).parentElement.parentElement;
      console.log(todoTarget);
      this.removeTodo(todoTarget);
      console.log(this.listTodos);
      //   event.target.closest("li").remove();
      //   this.setCountItemLeft();
    });
    // inputCheck.addEventListener("click", (event) => {
    //   const showLeft = document.querySelector(".ListItemsLeft");
    //   if (showLeft.classList.contains("active")) {
    //     event.target.closest("li").classList.add("hidden");
    //   }
    //   const showCompleted = document.querySelector(".ListItemsCompleted");
    //   if (showCompleted.classList.contains("active")) {
    //     event.target.closest("li").classList.add("hidden");
    //   }
    //   this.changeStateElement(event.target.closest("li"));
    //   this.changeItemByElement(event.target.closest("li"));
    //   this.saveData();
    //   this.renderFooter();
    //   this.setCountItemLeft();
    // });
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
    this.listTodos.push(todo);
  }
  public setCountItemLeft(): void {}
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
          console.log(this.listTodos);
        }
      }
    });
  }
  public clearInput(): void {
    document.getElementById("new-todo")["value"] = "";
  }
  public removeTodo(todo): void {
    this.listTodos.splice(this.getIndexOfTodo(todo), 1);
  }
  public getIndexOfTodo(todo): number {
    return Array.from(todo.parentElement.children).indexOf(todo);
  }
}
const TodoList = new App();
