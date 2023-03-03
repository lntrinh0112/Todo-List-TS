import { Todo } from "./class/Todo.js";
class App {
    constructor() {
        this.listTodos = [];
        this.loadApp();
    }
    loadApp() {
        this.renderData();
        this.renderUI();
    }
    renderData() {
        const data = JSON.parse(localStorage.getItem("todo-list"));
        if (data != null) {
            data.forEach((todo) => {
                this.setCountItemLeft();
            });
        }
    }
    addTodoToListView(newTodo) {
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
            const todoTarget = event.target.parentElement.parentElement;
            console.log(todoTarget);
            this.removeTodo(todoTarget);
            console.log(this.listTodos);
        });
    }
    addTodotoData(todo) {
        this.listTodos.push(todo);
    }
    setCountItemLeft() { }
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
                    console.log(this.listTodos);
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
}
const TodoList = new App();
//# sourceMappingURL=main.js.map