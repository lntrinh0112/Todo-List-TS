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
        this.checkListTodos();
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
            var elementEdit = event.target.parentElement
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
        const clearCompleted = document.querySelector(".ClearCompleted");
        if (this.findTodoLeft().length < this.listTodos.length &&
            this.isFilterAll()) {
            clearCompleted.setAttribute("style", "opacity: 1");
            clearCompleted.classList.remove("hidden");
        }
        else {
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
            listElement.forEach((element) => {
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
                .forEach((element) => {
                this.removeTodo(element.closest("li"));
                element.closest("li").remove();
                this.saveListTodos();
            });
            clearCompleted.setAttribute("style", "opacity: 0.5");
            clearCompleted.classList.add("hidden");
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
    changeTitleTodo(todo) {
        this.listTodos[this.getIndexOfTodo(todo)]["_title"] =
            todo.querySelector("label").textContent;
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
    checkListTodos() {
        var btnCheckAll = document.getElementById("label-check-all");
        btnCheckAll.addEventListener("click", () => {
            if (this.isFilterAll() === true) {
                var allCheckbox = document.querySelectorAll(".view input[type=checkbox]");
                var allChecked = Array.from(allCheckbox).every((element) => {
                    return element.checked === true;
                });
                if (allChecked) {
                    document.getElementById("check-all").classList.remove("active");
                    allCheckbox.forEach((element) => {
                        element.checked = false;
                    });
                    this.listTodos.forEach((todo) => {
                        todo["_status"] = false;
                    });
                    this.saveListTodos();
                }
                else {
                    document.getElementById("check-all").classList.add("active");
                    allCheckbox.forEach((element) => {
                        element.checked = true;
                    });
                    this.listTodos.forEach((todo) => {
                        todo["_status"] = true;
                    });
                    this.saveListTodos();
                }
                this.setCountTodoLeft();
                this.renderUI();
            }
        });
    }
    isFilterAll() {
        return document.querySelector(".ListItems").classList.contains("active");
    }
}
const TodoList = new App();
//# sourceMappingURL=main.js.map