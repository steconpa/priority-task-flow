class Task {
  static count = 0;

  constructor(description, listName) {
    this._id = ++Task.count;
    this._creationDate = new Date();
    this._description = description;
    this._listName = listName;
    this._position = 0;
    this._dueDate = null;
    this._onFocus = false;
  }

  get id() {
    return this._id;
  }

  get creationDate() {
    return this._creationDate;
  }

  get description() {
    return this._description;
  }

  set description(newDescription) {
    this._description = newDescription;
  }

  get listName() {
    return this._listName;
  }

  set listName(newListName) {
    this._listName = newListName;
  }

  get position() {
    return this._position;
  }

  set position(newPosition) {
    this._position = newPosition;
  }

  get dueDate() {
    return this._dueDate;
  }

  set dueDate(newDate) {
    this._dueDate = newDate;
  }

}

let toDoListTasks = [];

// Obtener la fecha actual
const currentDate = new Date();

// Obtener el día de la semana en formato largo
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const formattedDate = currentDate.toLocaleDateString(undefined, options);

// Obtener el elemento div por su ID
const currentDateDiv = document.getElementById("current-date");

// Establecer el contenido del div como la fecha formateada
currentDateDiv.textContent = formattedDate;

// Obtener elementos del DOM
const addItemButton = document.querySelector(".add-new-task-button");
const updateTaskButton = document.querySelector(".update-task-button");
const deleteTaskButton = document.querySelector(".delete-task-button");
const taskLoaderButton = document.getElementById("taskloader");
const blueToDoListDetails = document.querySelector("#blue-to-do-list-details");
const redToDoListDetails = document.querySelector("#red-to-do-list-details");
const orangeToDoListDetails = document.querySelector(
  "#orange-to-do-list-details"
);
const yellowToDoListDetails = document.querySelector(
  "#yellow-to-do-list-details"
);

// Event listeners
addItemButton.addEventListener("click", addNewTaskToDoList);
updateTaskButton.addEventListener("click",updateTaskElement);
deleteTaskButton.addEventListener("click",deleteTaskElement);
taskLoaderButton.addEventListener("click", loadItems);

function addTaskToList(taskListItem, listName) {
  document.getElementById(listName).appendChild(taskListItem);
}

function findTaskById(taskId) {
  return toDoListTasks.find((task) => task.id === taskId);
}

function findTaskByIdAndListName(id, listName) {
  return toDoListTasks.find(
    (task) => task.id === id && task.listName === listName
  );
}

function updateTaskDescription(taskId, newDescription) {
  const foundTask = findTaskById(taskId);
  foundTask.description = newDescription;
}

function updateTaskPositions(listName) {
  const list = document.getElementById(listName);
  const taskElements = list.childNodes;

  for (let i = 0; i < taskElements.length; i++) {
    const taskId = parseInt(taskElements[i].id);
    const task = findTaskByIdAndListName(taskId, listName);
    task.position = i + 1;
  }
}

function deleteTaskById(taskId) {
  toDoListTasks = toDoListTasks.filter((task) => task.id !== taskId);
}

function toggleListDetails(lengthCurrentList, listDetailsName) {
  const listDetails = document.getElementById(`${listDetailsName}-details`);
  listDetails.open = lengthCurrentList > 0;
}

/*
 * Validates the input value for a task.
 * @param {string} inputValue - The input value to validate.
 * @returns {string|boolean} - The validated input value if valid, otherwise false.
 */
function validateInput(inputValue) {
  // Trim the input value to remove leading and trailing whitespace
  const trimmedValue = inputValue.trim();

  // Replace newline characters with a space
  const valueWithoutLines = trimmedValue.replace(/\n/g, ' ');

  // Check if the value is not empty and does not exceed 250 characters
  const isValid = valueWithoutLines !== "" && valueWithoutLines.length <= 250;

  // Return the validated input value if valid, otherwise false
  return isValid ? valueWithoutLines : false;
}

function classifyTask(event) {
  const listNameValue = event.currentTarget.getAttribute("value");
  const taskId = parseInt(event.currentTarget.getAttribute("data-task-id"));
  const taskListItem = event.currentTarget.closest(".task-element-item");

  const task = findTaskById(taskId);
  task.listName = listNameValue;

  const newTaskRowItem = createNewTaskRowItem(task);

  const tableBody = document.getElementById(listNameValue);

  tableBody.appendChild(newTaskRowItem);

  // Remove the task from its current list
  taskListItem.remove();

  // Toggle list details based on the list length
  toggleListDetails(tableBody.children.length, listNameValue);
}

/**
 * Handles the editing of a task description.
 * @param {Event} event - dblclick event on the task description.
 */
function editTaskDescription(event) {
  // Get references to the add-task-form and update-task-form elements
  const addTaskForm = document.getElementById("add-task-form");
  const updateTaskForm = document.getElementById("update-task-form");

  // Get references to the necessary elements
  const inputEditTask = document.getElementById("update-task-input");
  const listItem = event.currentTarget.parentNode;
  const taskDescription = event.currentTarget.closest(".task-description");
  const taskId = parseInt(taskDescription.dataset.taskId);

  // Hide the add task form and show the update task form
  addTaskForm.style.display = "none";
  updateTaskForm.style.display = "flex";

  // Set the task ID to the input and populate the input with the task description
  inputEditTask.dataset.taskId = taskId;
  inputEditTask.value = taskDescription.textContent;
  inputEditTask.focus();

  // Remove the list item from the DOM
  listItem.remove();
}

function upListItem(event) {
  const rowItem = event.target.closest("tr");
  const previousRowItem = rowItem.previousElementSibling;

  if (previousRowItem) {
    rowItem.parentNode.insertBefore(rowItem, previousRowItem);
    //const listId = listItem.parentNode.id;
    //updateTaskPositions(listId);
  }
}

/*
 * Creates a new task list item element based on the provided task.
 * @param {Task} newTask - The new task object.
 * @returns {HTMLElement} - The newly created task list item element.
 */
function createNewTaskListItem(newTask) {
  // Get the template for a new uncategorized task
  const newTaskTemplate = document.getElementById("new-uncategorized-task-template");

  // Clone the template and get a reference to the new task list item element
  const newTaskListItem = newTaskTemplate.content.cloneNode(true).firstElementChild;

  // Get references to the task description and buttons within the new task list item
  const taskDescription = newTaskListItem.querySelector(".task-description");
  taskDescription.addEventListener("dblclick", editTaskDescription);
  taskDescription.textContent = newTask.description;
  taskDescription.dataset.taskId = newTask.id;
  
  const buttons = newTaskListItem.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", classifyTask);
    button.dataset.taskId = newTask.id;
  });

  // Return the new task list item element
  return newTaskListItem;
}

function createNewTaskRowItem(taskObject) {
  // Get the template for a new uncategorized task
  const template = document.getElementById("task-row-item");
  const clonedRow = template.content.cloneNode(true).firstElementChild;

  const clonedDescription = clonedRow.querySelector(".task-description");
  clonedDescription.dataset.taskId = taskObject.id;
  clonedDescription.textContent = taskObject.description;
  clonedDescription.addEventListener("dblclick", editTaskDescription);

  const clonedDueDate = clonedRow.querySelector(".task-due-date");
  const clonedDueDateInput = clonedDueDate.querySelector(".task-due-date-input");
  clonedDueDateInput.value = taskObject.dueDate || "";
  clonedDueDate.dataset.taskDueDate = taskObject.dueDate || "";

  const clonedCategoryButtons = clonedRow.querySelectorAll(".task-recategory-buttons button");
  clonedCategoryButtons.forEach((button) => {
    button.addEventListener("click", classifyTask);
    button.dataset.taskId = taskObject.id;
  });

  // Return the new task list item element
  return clonedRow;
}

/*
 * Event handler for adding a new task to the to-do list.
 * @param {Event} event - event click of the add-new-task-button.
 */
function addNewTaskToDoList(event) {
  event.preventDefault();

  // Get the value of the new task input
  const newTaskInput = document.getElementById("new-task-input").value;

  // Validate the input
  const validatedInput = validateInput(newTaskInput);

  // If the input is not valid, exit the function
  if (!validatedInput) return;

  // Define the list name for the new task
  const listName = "uncategorized-to-do-list";

  // Create a new instance of the Task class
  const newTask = new Task(validatedInput, listName);

  // Add the new task to the toDoListTasks array
  toDoListTasks.push(newTask);

  // Create a new task list item element
  const newTaskListItem = createNewTaskListItem(newTask);

  // Add the new task list item to the specified list
  addTaskToList(newTaskListItem, listName);

  // Reset the value of the new-task-input
  document.getElementById("new-task-input").value = "";
}

/**
 * Reset the update-task-form and show the-add-task-form.
 * @param {HTMLElement} updateTaskInput - The update task input element.
 * @param {HTMLElement} addTaskForm - The add task form element.
 * @param {HTMLElement} updateTaskForm - The update task form element.
 */
function resetUpdateTaskForm(updateTaskInput, addTaskForm, updateTaskForm) {
  updateTaskInput.dataset.taskId = 0;
  updateTaskInput.value = "";
  addTaskForm.style.display = "flex";
  updateTaskForm.style.display = "none";
}

/**
 * Deletes the task element from the task list.
 * @param {Event} event - event click on the button delete-task-button.
 */
function deleteTaskElement(event) {
  event.preventDefault();

  // Get the add task form and update task form elements
  const addTaskForm = document.getElementById("add-task-form");
  const updateTaskForm = document.getElementById("update-task-form");

  // Get the delete task input element and retrieve the task ID
  const updateTaskInput = document.getElementById("update-task-input");
  const taskId = parseInt(updateTaskInput.dataset.taskId);

  // Delete the task by ID
  deleteTaskById(taskId);

  //Reset the update task form and show the add task form
  resetUpdateTaskForm(updateTaskInput, addTaskForm, updateTaskForm);
}

/**
 * Updates the task list element with the new task description.
 * @param {Event} event - event click on the button update-task-button.
 */
function updateTaskElement(event) {
  event.preventDefault();

  // Get the add task form and update task form elements
  const addTaskForm = document.getElementById("add-task-form");
  const updateTaskForm = document.getElementById("update-task-form");

  // Get the update task input element and retrieve the new task description
  const updateTaskInput = document.getElementById("update-task-input");
  const newTaskDescription = updateTaskInput.value;

  // Validate the new task description
  const validatedInput = validateInput(newTaskDescription);

  // If the input is not valid, return
  if (!validatedInput) {
    return;
  }

  // Get the task ID from the dataset of the update task input
  const taskId = parseInt(updateTaskInput.dataset.taskId);

  // Find the task in the task list by ID
  const foundTask = findTaskById(taskId);

  // Retrieve the list name of the found task
  const listName = foundTask.listName;

  // Update the task description with the new description
  foundTask.description = newTaskDescription;

  // Create a new task list item with the updated task
  let newTaskItem
  if (listName === "uncategorized-to-do-list") {
    newTaskItem = createNewTaskListItem(foundTask);
  } else {
    newTaskItem = createNewTaskRowItem(foundTask)
  }

  // Add the new task list item to the corresponding task list
  addTaskToList(newTaskItem, listName);

  //Reset the update task form and show the add task form
  resetUpdateTaskForm(updateTaskInput, addTaskForm, updateTaskForm);
}

function loadItems() {
  const listNames = [
    "red-to-do-list",
    "orange-to-do-list",
    "yellow-to-do-list",
  ];
  const focusOnSixList = document.getElementById("focusOn-sixList");

  const template = document.getElementById("focusOn-elementsList");

  let loadedItems = 0;

  for (const listName of listNames) {
    const tasks = toDoListTasks.filter((task) => task.listName === listName);
    const sortedTasks = tasks.sort((a, b) => a.position - b.position);

    for (const task of sortedTasks) {
      const listItem = document.getElementById(task.id);

      if (listItem) {
        const clonedTemplate =
          template.content.cloneNode(true).firstElementChild;
        const descriptionElement = clonedTemplate.querySelector(
          ".taskDescription-elementList"
        );
        const returnButton = clonedTemplate.querySelector(
          ".return-task-button"
        );
        const startButton = clonedTemplate.querySelector(".start-task-button");

        descriptionElement.textContent = task.description;
        clonedTemplate.id = task.id;
        returnButton.addEventListener("click", handleReturnTask);
        startButton.addEventListener("click", handleStartTask);

        focusOnSixList.appendChild(clonedTemplate);
        listItem.parentNode.removeChild(listItem);
        loadedItems++;

        if (loadedItems >= 6) {
          return;
        }
      }
    }
  }
}

function handleReturnTask() {
  console.log("retorno");
}

function handleStartTask() {
  console.log("Empieza");
}
