import { Todo } from "./class/Todo.js";
class App {
    constructor() {
        this.listTodos = [];
        this.loadApp();
    }
    loadApp() {
        this.renderData();
        this.renderUI();
        this.setCountTodoLeft();
    }
    renderData() {
        const data = JSON.parse(localStorage.getItem("list-todos"));
        if (data !== null) {
            data.forEach((todo) => {
                this.addTodoToListView(todo);
                this.addTodotoData(todo);
            });
        }
    }
    addTodoToListView(newTodo) {
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
            const todoTarget = event.target.parentElement.parentElement;
            this.removeTodo(todoTarget);
            todoTarget.remove();
            this.saveListTodos();
            this.setCountTodoLeft();
        });
        inputCheck.addEventListener("click", (event) => {
            const todoTarget = event.target.parentElement.parentElement;
            this.changeStatusTodo(todoTarget);
            this.saveListTodos();
            this.setCountTodoLeft();
        });
    }
    addTodotoData(todo) {
        this.listTodos.push(todo);
    }
    renderUI() {
        const input = document.getElementById("new-todo");
        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                var valueInput = input["value"];
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
    clearInput() {
        document.getElementById("new-todo")["value"] = "";
    }
    removeTodo(todo) {
        this.listTodos.splice(this.getIndexOfTodo(todo), 1);
    }
    getIndexOfTodo(todo) {
        return Array.from(todo.parentElement.children).indexOf(todo);
    }
    saveListTodos() {
        localStorage.setItem("list-todos", JSON.stringify(this.listTodos));
    }
    changeStatusTodo(todo) {
        this.listTodos[this.getIndexOfTodo(todo)]["_status"] =
            this.getCurrentStatusTodo(todo);
    }
    getCurrentStatusTodo(todo) {
        return todo.querySelector("input[type='checkbox']")
            .checked;
    }
    setCountTodoLeft() {
        document.querySelector(".todo-count strong").innerHTML =
            this.findTodoLeft().length.toString();
    }
    findTodoLeft() {
        return this.listTodos.filter((todo) => {
            return todo["_status"] === false;
        });
    }
}
const TodoList = new App();
//# sourceMappingURL=main.js.map