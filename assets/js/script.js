var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;

var taskFormHandler = function() {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  // check if input values are empty strings
  if(!taskNameInput || !taskTypeInput) {
    alert("Tasks need names and types");
    return false;
  };
  // check if in edit mode
  var isEdit = formEl.hasAttribute("data-task-id");
  if(isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput,taskTypeInput, taskId);
  }
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    // package up data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };  
    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
  }
  // clear the form
  formEl.reset();
};

var createTaskEl = function(taskDataObj){
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id",taskIdCounter);
  // create a div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";
  // add taskInfo div to task-item li
  listItemEl.appendChild(taskInfoEl);
  // create task actions div with (edit delete and select buttons)
  var taskActionsEl = createTaskActions(taskIdCounter);
  // add taskActions div to task-item li
  listItemEl.appendChild(taskActionsEl);
  // add entire li to ul
  tasksToDoEl.appendChild(listItemEl);
  // increase task counter for next unique id
  taskIdCounter ++
};

var createTaskActions = function(taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";
  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);
  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);
  // create dropdown menu
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name","status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(statusSelectEl);
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for ( i = 0; i < statusChoices.length; i++) {
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value",statusChoices[i]);
    //append options to select
    statusSelectEl.appendChild(statusOptionEl);
  }  
  return actionContainerEl;
};

var taskButtonHandler = function(event) {
  // get target element from event
  var targetEl = event.target;
  
  //delete button was clicked
  if(targetEl.matches(".delete-btn")) {
    // get the elements task id
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
  else if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
};

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id ='" + taskId + "']");
  taskSelected.remove();
};

var editTask = function(taskId) {
  // get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id ='" + taskId + "']");
  //get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
  var instructions = document.querySelector("header p")
  instructions.textContent = "Click the button below to save your edited task!"
};

var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;
  alert("Task Updated!");
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
  document.querySelector("header p").textContent = "Click the button below to add a new task!"
}

//Event Listeners
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);