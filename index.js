// Initialize variables
var todoList = [];
var comdoList = [];
var remList = [];
var addButton = document.getElementById("add-button");
var todoInput = document.getElementById("todo-input");
var deleteAllButton = document.getElementById("delete-all");
var allTodos = document.getElementById("all-todos");
var deleteSButton = document.getElementById("delete-selected");

// Event listeners for add and delete
addButton.addEventListener("click", add);
deleteAllButton.addEventListener("click", deleteAll);
deleteSButton.addEventListener("click", deleteS);

// Event listeners for filters and editing
document.addEventListener("click", (e) => {
  if (
    e.target.className.split(" ")[0] == "complete" ||
    e.target.className.split(" ")[0] == "ci"
  ) {
    completeTodo(e);
  }
  if (
    e.target.className.split(" ")[0] == "delete" ||
    e.target.className.split(" ")[0] == "di"
  ) {
    deleteTodo(e);
  }
  if (
    e.target.className.split(" ")[0] == "edit" ||
    e.target.className.split(" ")[0] == "ei"
  ) {
    editTodo(e);
  }
  if (e.target.id == "all") {
    viewAll();
  }
  if (e.target.id == "rem") {
    viewRemaining();
  }
  if (e.target.id == "com") {
    viewCompleted();
  }
});

// Event listener for Enter key
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    add();
  }
});

// Updates the remaining, completed, and main lists
function update() {
  comdoList = todoList.filter((ele) => ele.complete);
  remList = todoList.filter((ele) => !ele.complete);
  document.getElementById("r-count").innerText = todoList.length.toString();
  document.getElementById("c-count").innerText = comdoList.length.toString();
}

// Adds a new task
function add() {
  var value = todoInput.value.trim();
  if (value === "") {
    alert("😮 Task cannot be empty");
    return;
  }
  todoList.push({
    task: value,
    id: Date.now().toString(),
    complete: false,
  });

  todoInput.value = "";
  update();
  addinmain(todoList);
}

// Renders the tasks in the main list
function addinmain(todoList) {
  allTodos.innerHTML = "";
  todoList.forEach((element) => {
    var x = `<li id=${element.id} class="todo-item">
        <p id="task"> ${
          element.complete ? `<strike>${element.task}</strike>` : element.task
        } </p>
        <div class="todo-actions">
            <button class="complete btn btn-success">
                <i class="ci bx bx-check bx-sm"></i>
            </button>
            <button class="edit btn btn-warning">
                <i class="ei bx bx-edit bx-sm"></i>
            </button>
            <button class="delete btn btn-error">
                <i class="di bx bx-trash bx-sm"></i>
            </button>
        </div>
        </li>`;
    allTodos.innerHTML += x;
  });
}

// Deletes a task
function deleteTodo(e) {
  var deleted = e.target.parentElement.parentElement.getAttribute("id");
  todoList = todoList.filter((ele) => ele.id != deleted);
  update();
  addinmain(todoList);
}

// Marks a task as completed
function completeTodo(e) {
  var completed = e.target.parentElement.parentElement.getAttribute("id");
  todoList.forEach((obj) => {
    if (obj.id == completed) {
      obj.complete = !obj.complete;
    }
  });
  update();
  addinmain(todoList);
}

// Deletes all tasks
function deleteAll() {
  todoList = [];
  update();
  addinmain(todoList);
}

// Deletes only completed tasks
function deleteS() {
  todoList = todoList.filter((ele) => !ele.complete);
  update();
  addinmain(todoList);
}

// Filters: View completed tasks
function viewCompleted() {
  addinmain(comdoList);
}

// Filters: View remaining tasks
function viewRemaining() {
  addinmain(remList);
}

// Filters: View all tasks
function viewAll() {
  addinmain(todoList);
}

// Edits a task
function editTodo(e) {
  var editId = e.target.parentElement.parentElement.getAttribute("id");
  var taskElement = e.target.parentElement.parentElement.querySelector("#task");

  var currentTask = taskElement.innerText;
  var inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = currentTask;
  inputField.classList.add("edit-input");

  taskElement.innerHTML = "";
  taskElement.appendChild(inputField);

  var actionDiv =
    e.target.parentElement.parentElement.querySelector(".todo-actions");

  // Hide Complete and Delete buttons
  var completeButton = actionDiv.querySelector(".complete");
  var deleteButton = actionDiv.querySelector(".delete");
  var editButton = actionDiv.querySelector(".edit");
  completeButton.style.display = "none";
  deleteButton.style.display = "none";
  editButton.style.display = "none";

  // Add Save and Cancel buttons
  var saveButton = document.createElement("button");
  saveButton.classList.add("btn", "btn-success", "save-btn");
  saveButton.innerText = "Save";

  var cancelButton = document.createElement("button");
  cancelButton.classList.add("btn", "btn-error", "cancel-btn");
  cancelButton.innerText = "Cancel";

  actionDiv.appendChild(saveButton);
  actionDiv.appendChild(cancelButton);

  // Save button functionality
  saveButton.addEventListener("click", () => {
    var newTask = inputField.value.trim();
    if (newTask === "") {
      alert("Task cannot be empty!");
      return;
    }
    todoList.forEach((obj) => {
      if (obj.id == editId) {
        obj.task = newTask;
      }
    });
    taskElement.innerHTML = newTask;

    // Remove Save and Cancel buttons, restore other buttons
    saveButton.remove();
    cancelButton.remove();
    completeButton.style.display = "inline-block";
    deleteButton.style.display = "inline-block";
    editButton.style.display = "inline-block";

    update();
    addinmain(todoList);
  });

  // Cancel button functionality
  cancelButton.addEventListener("click", () => {
    taskElement.innerHTML = currentTask;

    // Remove Save and Cancel buttons, restore other buttons
    saveButton.remove();
    cancelButton.remove();
    completeButton.style.display = "inline-block";
    deleteButton.style.display = "inline-block";
    editButton.style.display = "inline-block";
  });
}
