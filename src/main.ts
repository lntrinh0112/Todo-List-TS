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
    this.checkListTodos();
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
      const todoTarget = (event.target as Element).parentElement.parentElement;
      const showLeft = document.querySelector(".ListItemsLeft");
      const clearCompleted = document.querySelector(".ClearCompleted");
      if (showLeft.classList.contains("active")) {
        todoTarget.classList.add("hidden");
      }
      const showCompleted = document.querySelector(".ListItemsCompleted");
      if (showCompleted.classList.contains("active")) {
        todoTarget.classList.add("hidden");
      }
      this.changeStatusTodo(todoTarget);
      this.saveListTodos();
      this.setCountTodoLeft();
      this.renderUI();
    });
    todoItemName.addEventListener("click", (event) => {
      var elementEdit: HTMLElement = (event.target as Element).parentElement
        .parentElement;
      elementEdit.querySelector("label").setAttribute("style", "cursor: text");
      elementEdit
        .querySelector("label")
        .setAttribute("contentEditable", "true");
      todoItemName.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          elementEdit
            .querySelector("label")
            .setAttribute("contentEditable", "false");
          this.changeTitleTodo(elementEdit);
          this.saveListTodos();
          elementEdit
            .querySelector("label")
            .setAttribute("style", "cursor: default");
        }
      });
    });
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
    const clearCompleted = document.querySelector(".ClearCompleted");
    if (
      this.findTodoLeft().length < this.listTodos.length &&
      this.isFilterAll()
    ) {
      clearCompleted.setAttribute("style", "opacity: 1");
      clearCompleted.classList.remove("hidden");
    } else {
      clearCompleted.setAttribute("style", "opacity: 0.5");
      clearCompleted.classList.add("hidden");
    }
    const showAll = document.querySelector(".ListItems");
    showAll.addEventListener("click", (event) => {
      event.preventDefault();
      let listElement = document.querySelectorAll(".todo-list li");
      listElement.forEach((element) => {
        element.classList.remove("hidden");
      });
      showAll.classList.add("active");
      showLeft.classList.remove("active");
      showCompleted.classList.remove("active");
    });
    const showLeft = document.querySelector(".ListItemsLeft");
    showLeft.addEventListener("click", (event) => {
      event.preventDefault();
      let listElement = document.querySelectorAll(".todo-list li");
      listElement.forEach((element) => {
        element.querySelector(":checked")
          ? element.classList.add("hidden")
          : element.classList.remove("hidden");
      });
      showLeft.classList.add("active");
      showAll.classList.remove("active");
      showCompleted.classList.remove("active");
      clearCompleted.setAttribute("style", "opacity: 0.5");
      clearCompleted.classList.add("hidden");
    });
    const showCompleted = document.querySelector(".ListItemsCompleted");
    showCompleted.addEventListener("click", (event) => {
      event.preventDefault();
      let listElement = document.querySelectorAll(".todo-list li");
      listElement.forEach((element: HTMLElement) => {
        element.querySelector(":checked")
          ? element.classList.remove("hidden")
          : element.classList.add("hidden");
      });
      showCompleted.classList.add("active");
      showLeft.classList.remove("active");
      showAll.classList.remove("active");
      clearCompleted.setAttribute("style", "opacity: 0.5");
      clearCompleted.classList.add("hidden");
    });

    clearCompleted.addEventListener("click", (event) => {
      event.preventDefault();
      document
        .querySelectorAll('div input[type="checkbox"]:checked')
        .forEach((element: HTMLElement) => {
          this.removeTodo(element.closest("li"));
          element.closest("li").remove();
          this.saveListTodos();
        });
      clearCompleted.setAttribute("style", "opacity: 0.5");
      clearCompleted.classList.add("hidden");
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
  public changeTitleTodo(todo: HTMLElement): void {
    this.listTodos[this.getIndexOfTodo(todo)]["_title"] =
      todo.querySelector("label").textContent;
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
  public checkListTodos(): void {
    var btnCheckAll = document.getElementById("label-check-all");

    btnCheckAll.addEventListener("click", () => {
      if (this.isFilterAll() === true) {
        var allCheckbox = document.querySelectorAll(
          ".view input[type=checkbox]"
        );
        var allChecked: boolean = Array.from(allCheckbox).every(
          (element: HTMLInputElement) => {
            return element.checked === true;
          }
        );
        if (allChecked) {
          document.getElementById("check-all").classList.remove("active");
          allCheckbox.forEach((element: HTMLInputElement) => {
            element.checked = false;
          });
          this.listTodos.forEach((todo: Todo) => {
            todo["_status"] = false;
          });
          this.saveListTodos();
        } else {
          document.getElementById("check-all").classList.add("active");
          allCheckbox.forEach((element: HTMLInputElement) => {
            element.checked = true;
          });
          this.listTodos.forEach((todo: Todo) => {
            todo["_status"] = true;
          });
          this.saveListTodos();
        }
        this.setCountTodoLeft();
        this.renderUI();
      }
    });
  }
  public isFilterAll(): boolean {
    return document.querySelector(".ListItems").classList.contains("active");
  }
}
const TodoList = new App();
