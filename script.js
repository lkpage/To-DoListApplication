const list = document.getElementById("taskList");
const input = document.getElementById("inputAddTask");
let LIST = [];
let id = 0;

const CHECK = "fa-check-square";
const UNCHECK = "fa-square";
const LINE_THROUGH = "lineThrough";

let dataInTheLocalStorage = localStorage.getItem("TODO");
if (dataInTheLocalStorage) {
    LIST = JSON.parse(dataInTheLocalStorage);
    loadTaskList(LIST);
    id = LIST.length;
    checkForEmptyTaskList(LIST);
} else {
    LIST = [];
    id = 0;
    checkForEmptyTaskList(LIST);
}

function checkForEmptyTaskList(LIST) {
    let trashedTasks = 0;
    LIST.forEach(item => {
        if (item.trash === true) {
            trashedTasks++;
        }
    });
    if (trashedTasks === LIST.length) {
        document.getElementById("noTasksMessage").style.visibility="visible";
    } else {
        document.getElementById("noTasksMessage").style.visibility="hidden";
    }
}

function loadTaskList(array) {
    array.forEach((item) => addTask(item.task, item.id, item.completed, item.trash))
}

$("button").click(function () {
    const task = input.value;
    if (task) {
        addTask(task, id, false, false);
        LIST.push(
            {
                task: task,
                id: id,
                completed: false,
                trash: false
            }
        )
        localStorage.setItem("TODO", JSON.stringify(LIST));
        id++;
        checkForEmptyTaskList(LIST);
    }
    input.value = "";
});

function addTask(text, id, ifChecked, trash) {         //UI.addToDoToList          OK
    if (trash) { return; }                             //pokud je 'trash' true, nic z kódu níže se neprovede
    const checkBoxIcon = ifChecked ? CHECK : UNCHECK;
    const completed = ifChecked ? LINE_THROUGH : '';
    const listLine = `<li>
<i class="far ${checkBoxIcon}" action="complete" id="${id}"></i>
<p class="task ${completed}">${text}</p>
<i class="far fa-trash-alt" action="delete" id="${id}"></i>
</li>`
    const position = "beforeEnd";
    list.insertAdjacentHTML(position, listLine);
    localStorage.setItem("TODO", JSON.stringify(LIST));
}

list.addEventListener("click", (event) => {     //možné psát i: document.addEventListener(...)
    let element = event.target;
    if (element.attributes.action) {
        const elementAction = element.attributes.action.value;
        if (elementAction == "complete") {
            completeTask(element);
        }
        if (elementAction == "delete") {
            removeTask(element);
        }
    }
    localStorage.setItem("TODO", JSON.stringify(LIST));
});

function completeTask(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".task").classList.toggle(LINE_THROUGH);
    LIST[element.id].completed = LIST[element.id].completed ? false : true;
}

function removeTask(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
    localStorage.setItem("TODO", JSON.stringify(LIST));
    checkForEmptyTaskList(LIST);
}
