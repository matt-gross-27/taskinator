// ~*~*~*~*~*~Global Variables~*~*~*~*~*~
var tasks = [];
var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;

// ~*~*~*~*~*~Functions~*~*~*~*~*~
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
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    // package up data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
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
  // make li draggable
  listItemEl.setAttribute("draggable","true");
  // identify where to select status
  var statusSelectEl = listItemEl.querySelector("select[name='status-change']")
  // set status dropdown to correct value and add li to correct list
  switch(taskDataObj.status) {
    case "to do":
      statusSelectEl.selectedIndex = 0;
      tasksToDoEl.appendChild(listItemEl);
      break;
    case "in progress":
      statusSelectEl.selectedIndex = 1;
      tasksInProgressEl.appendChild(listItemEl);
      break;
    case "completed":
      statusSelectEl.selectedIndex = 2;
      tasksCompletedEl.appendChild(listItemEl);
      break;
  };
  // add data-id to the task object and set value
  taskDataObj.id = taskIdCounter;
  // add the entire object to the tasks array
  tasks.push(taskDataObj);
  // save task
  saveTasks();
  // increase task counter for next unique id
  taskIdCounter ++;
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
  // remove entire li from the dom
  var taskSelected = document.querySelector(".task-item[data-task-id ='" + taskId + "']");
  taskSelected.remove();

  //create an array to hold updated list of tasks
  var updatedTaskArr = [];
  //loop through tasks array
  for (let i = 0; i < tasks.length; i++) {
    // if id does NOT match deleted tasks id push obj to updatedTaskArr
    if(tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  };
  // set global tasks[] = updatedTaskArr[]
  tasks = updatedTaskArr;
  saveTasks();
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
  var instructions = document.querySelector("header p");
  instructions.textContent = "Click the button below to save your edited task!";
};

var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;
  alert("Task Updated!");
  formEl.removeAttribute("data-task-id");
  // reset save button and p element
  document.querySelector("#save-task").textContent = "Add Task";
  document.querySelector("header p").textContent = "Click the button below to add a new task!";
  // loop through tasks array and update task object with new content
  for (let i = 0; i < tasks.length; i++) {
    if(tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    };
  };
  saveTasks();
};

var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");
  //get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();
  //find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  switch(statusValue) {
    case "to do":
      tasksToDoEl.appendChild(taskSelected);
      break;
    case "in progress":
      tasksInProgressEl.appendChild(taskSelected);
      break;
    case "completed":
      tasksCompletedEl.appendChild(taskSelected);
      break;
    default:
      break;
  }
  // update task in tasks array
  for (let i = 0; i < tasks.length; i++) {
    if(tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    };
  };
  saveTasks();
};

var dragTaskHandler = function(event) {
  var taskId = event.target.getAttribute("data-task-id");
  event.dataTransfer.setData("text/plain",taskId);
  var getId = event.dataTransfer.getData("text/plain");
};

var dropZoneDragHandler = function(event) {
  var taskListEl = event.target.closest(".task-list");
  if(taskListEl) {
    event.preventDefault();
    taskListEl.setAttribute("style","background: rgba(68, 233, 255, 0.7); border-style: dashed;");
  }
};

var dropTaskHandler = function(event) {
  var id = event.dataTransfer.getData("text/plain");
  var draggableElement = document.querySelector("[data-task-id='" + id + "']");
  var dropZoneEl = event.target.closest(".task-list");
  var statusType = dropZoneEl.id;
  var selectStatusEl = draggableElement.querySelector("select[name='status-change'");
  switch(statusType){
    case "tasks-to-do":
      selectStatusEl.selectedIndex = 0;
      break;
    case "tasks-in-progress":
      selectStatusEl.selectedIndex = 1;
      break;
    case "tasks-completed":
      selectStatusEl.selectedIndex = 2;
      break;
    default:
      break;
  };
  dropZoneEl.appendChild(draggableElement);
  dropZoneEl.removeAttribute("style");
  // update task in tasks array
  for (let i = 0; i < tasks.length; i++) {
    if(tasks[i].id === parseInt(id)) {
      tasks[i].status = selectStatusEl.value.toLowerCase();
    };
  };
  saveTasks();  
};

var dragLeaveHandler = function(event) {
  var taskListEl = event.target.closest(".task-list");
  if(taskListEl) {
    taskListEl.removeAttribute("style");
  };
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
  var savedTasks = localStorage.getItem("tasks");
  if (!savedTasks) {
    return false;
  };
  savedTasks = JSON.parse(savedTasks);
  // loop through savedTasks array
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the `createTaskEl()` function
    createTaskEl(savedTasks[i]);
  };
};

//~*~*~*~*~*~Event Listeners~*~*~*~*~*~
// handle new task creation
formEl.addEventListener("submit", taskFormHandler);
// handle task actions edit and delete
pageContentEl.addEventListener("click", taskButtonHandler);
// handle task status changes (select drop down)
pageContentEl.addEventListener("change",taskStatusChangeHandler);
// handle dragstart, dragover, drop, and dragleave
pageContentEl.addEventListener("dragstart",dragTaskHandler);
pageContentEl.addEventListener("dragover",dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);


// run loadTasks
loadTasks();