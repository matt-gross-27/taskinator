var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
  event.preventDefault();
  var taskItemEl = document.createElement("li");
  taskItemEl.className = "task-item";
  taskItemEl.textContent = "What the Task!?";
  tasksToDoEl.appendChild(taskItemEl);
}

formEl.addEventListener("submit", createTaskHandler)
