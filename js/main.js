class Task {
  static count = 0;

  constructor(description, listName) {
    this._id = ++Task.count;
    this._description = description;
    this._listName = listName;
    this._position = null;
    this._dueDate = null;
  }

  get id() {
    return this._id;
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

// Manejo de clasificaciones
function handleClassification(event) {
  const li = event.currentTarget.closest(".task-elementList");
  const currentButton = li.querySelector(".current-button button");
  const buttonsDropdownList = li.querySelectorAll(".dropdown-list button");
  const idValue = parseInt(li.id);
  const buttonValue = event.target.value;
  const foundTask = findTaskById(idValue);
  const actualList = foundTask.listName;
  const actualToDoList = document.getElementsByClassName(actualList);
  const actualToDoListDetails = actualToDoList[0].parentNode;

  const classValues = {
    "red-to-do-list": [
      { class: "changeClass-redButton", value: "red-to-do-list" },
      { class: "changeClass-orangeButton", value: "orange-to-do-list" },
      { class: "changeClass-yellowButton", value: "yellow-to-do-list" },
      { class: "changeClass-blueButton", value: "blue-to-do-list" },
    ],
    "orange-to-do-list": [
      { class: "changeClass-orangeButton", value: "orange-to-do-list" },
      { class: "changeClass-redButton", value: "red-to-do-list" },
      { class: "changeClass-yellowButton", value: "yellow-to-do-list" },
      { class: "changeClass-blueButton", value: "blue-to-do-list" },
    ],
    "yellow-to-do-list": [
      { class: "changeClass-yellowButton", value: "yellow-to-do-list" },
      { class: "changeClass-redButton", value: "red-to-do-list" },
      { class: "changeClass-orangeButton", value: "orange-to-do-list" },
      { class: "changeClass-blueButton", value: "blue-to-do-list" },
    ],
    "blue-to-do-list": [
      { class: "changeClass-blueButton", value: "blue-to-do-list" },
      { class: "changeClass-redButton", value: "red-to-do-list" },
      { class: "changeClass-orangeButton", value: "orange-to-do-list" },
      { class: "changeClass-yellowButton", value: "yellow-to-do-list" },
    ],
  };

  const selectedClassValues = classValues[buttonValue];

  foundTask.listName = buttonValue;
  currentButton.classList.remove(currentButton.classList.value);
  currentButton.classList.add(selectedClassValues[0].class);
  currentButton.value = buttonValue;

  buttonsDropdownList.forEach((button, index) => {
    const element = selectedClassValues[index + 1];
    button.classList.remove(button.classList.value);
    button.classList.add(element.class);
    button.value = element.value;
  });

  const targetDetails = document.getElementById(buttonValue + "-details");

  // Agregar la tarea a la lista que corresponde
  addTaskToList(li, targetDetails);
  updateTaskPositions(foundTask.listName);
  updateTaskPositions(actualList);

  li.querySelector(".custom-dropdown").open = false;

  checkListLength(actualToDoList[0].childNodes.length, actualToDoListDetails);
}

function checkListLength(currentToDoList, currentDetailsElement) {
  if (currentToDoList === 0) {
    currentDetailsElement.open = false;
  }
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
  const listItem = event.target.closest("li");
  const previousListItem = listItem.previousElementSibling;

  if (previousListItem) {
    listItem.parentNode.insertBefore(listItem, previousListItem);
    const listId = listItem.parentNode.id;
    updateTaskPositions(listId);
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
  const redButton = newTaskListItem.querySelector(".button-assign-task-red-list");
  const orangeButton = newTaskListItem.querySelector(".button-assign-task-orange-list");
  const yellowButton = newTaskListItem.querySelector(".button-assign-task-yellow-list");
  const blueButton = newTaskListItem.querySelector(".button-assign-blue-list");

  // Add event listeners to the buttons and task description
  blueButton.addEventListener("click", handleClassification);
  redButton.addEventListener("click", handleClassification);
  orangeButton.addEventListener("click", handleClassification);
  yellowButton.addEventListener("click", handleClassification);
  taskDescription.addEventListener("dblclick", editTaskDescription);

  // Set the task description and task ID as data attribute
  taskDescription.textContent = newTask.description;
  taskDescription.dataset.taskId = newTask.id;

  // Return the new task list item element
  return newTaskListItem;
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
