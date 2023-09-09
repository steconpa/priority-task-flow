class Task {
  static count = 0;

  constructor(description, listName) {
    this._id = ++Task.count;
    this._creationDate = new Date();
    this._description = description;
    this._listName = listName;
    this._position = 0;
    this._dueDate = null;
    this._onFocusList = false;
    this._inProgress = false;
    this._completed = false;
    this._pomodoroTracking = [];
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

  get onFocusList() {
    return this._onFocusList;
  }

  set onFocusList(booleanFocus) {
    this._onFocusList = booleanFocus;
  }

  get inProgress() {
    return this._inProgress;
  }

  set inProgress(booleanProgress) {
    this._inProgress = booleanProgress;
  }

  get completed() {
    return this._completed;
  }

  set completed(booleanCompleted) {
    this._completed = booleanCompleted;
  }

  get pomodoroTracking() {
    return this._pomodoroTracking;
  }

  set pomodoroTracking(newPomodoro) {
    this._pomodoro = newPomodoro;
  }
}

class DueDate {
  constructor(date) {
    this._date = new Date(date);
    this.adjustTimezoneOffset();
  }

  get date() {
    return this._date;
  }

  set date(newDate) {
    this._date = new Date(newDate);
  }

  isPastDue() {
    const currentDate = new Date();
    return this._date < currentDate;
  }

  toString() {
    const options = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' };
    return this._date.toLocaleDateString(undefined, options);
  }

  adjustTimezoneOffset() {
    const timezoneOffset = this._date.getTimezoneOffset();
    this._date.setMinutes(this._date.getMinutes() - timezoneOffset);
  }

  formatDate() {
    const year = this._date.getFullYear();
    const month = String(this._date.getMonth() + 1).padStart(2, "0");
    const day = String(this._date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}

class PomodoroTimer {
  constructor(minPomodoro, minShortBreak, minLongBreak) {
    this.workDuration = minPomodoro;
    this.shortBreakDuration = minShortBreak;
    this.longBreakDuration = minLongBreak;
    this.sessionsCompleted = 0; // Número de sesiones de trabajo completadas
    this.timer = null; // Referencia al temporizador actual
  }

  startWorkSession() {
    this.startTimer(this.workDuration, this.onWorkSessionComplete.bind(this));
  }

  startShortBreak() {
    this.startTimer(this.shortBreakDuration, this.onShortBreakComplete.bind(this));
  }

  startLongBreak() {
    this.startTimer(this.longBreakDuration, this.onLongBreakComplete.bind(this));
  }

  startTimer(duration, onComplete) {
    clearInterval(this.timer);
    const endTime = new Date().getTime() + duration * 60000; // Calcular el tiempo de finalización en milisegundos

    this.timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const remainingTime = endTime - currentTime;

      if (remainingTime > 0) {
        // Actualizar el tiempo restante en el cronómetro
        const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.updateTimerDisplay(timeString);
      } else {
        // El tiempo ha llegado a cero, detener el temporizador y llamar a la función de completado
        clearInterval(this.timer);
        onComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.timer);
    // Agregar lógica adicional para pausar el temporizador
  }

  postponeTask() {
    clearInterval(this.timer);
    // Agregar lógica adicional para posponer la tarea
  }

  completeTask() {
    clearInterval(this.timer);
    // Agregar lógica adicional para marcar la tarea como completada
  }

  onWorkSessionComplete() {
    this.sessionsCompleted++;
    if (this.sessionsCompleted % 4 === 0) {
      this.startLongBreak();
    } else {
      this.startShortBreak();
    }
  }

  onShortBreakComplete() {
    this.startWorkSession();
  }

  onLongBreakComplete() {
    this.startWorkSession();
  }

  updateTimerDisplay(timeString) {
    // Actualizar el elemento HTML que muestra el tiempo restante en el cronómetro
    const timerDisplay = document.getElementById('pomodoro-stopwatch-display-input');
    timerDisplay.value = timeString;
  }
}

// Evento de clic para pausar el temporizador
/* const pauseButton = document.getElementById('pause-button');
pauseButton.addEventListener('click', () => {
  pomodoroTimer.pauseTimer();
}); */

// Evento de clic para posponer la tarea
/* const postponeButton = document.getElementById('postpone-button');
postponeButton.addEventListener('click', () => {
  pomodoroTimer.postponeTask();
}); */

// Evento de clic para completar la tarea
/* const completeButton = document.getElementById('complete-button');
completeButton.addEventListener('click', () => {
  pomodoroTimer.completeTask();
}); */

// Evento de clic para iniciar el descanso largo
/* const startLongBreakButton = document.getElementById('start-long-break-button');
startLongBreakButton.addEventListener('click', () => {
  pomodoroTimer.startLongBreak();
}); */

let toDoListTasks = [];
let pomodoroTimer = {};

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
const takeOnSixTasksButton = document.getElementById("take-on-six-tasks-button");
const startTasksButton = document.getElementById("start-tasks-button");

// Event listeners
addItemButton.addEventListener("click", addNewTaskToDoList);
updateTaskButton.addEventListener("click", updateTaskElement);
deleteTaskButton.addEventListener("click", deleteTaskElement);
takeOnSixTasksButton.addEventListener("click", takeOnSixTasks);
startTasksButton.addEventListener("click", handleStartTasks);

const tabElement = document.querySelectorAll(".tab-element");
const sections = document.querySelectorAll("main section");

tabElement.forEach((element) => {
  element.addEventListener("click", () => {
    const target = element.dataset.target;
    tabElement.forEach((li) => li.classList.remove("active"));
    element.classList.add("active");

    sections.forEach((section) => {
      section.style.display = section.id === target ? "block" : "none";
    });
  });
});

function addTaskToList(taskListItem, listName) {
  document.getElementById(listName).appendChild(taskListItem);
}

function findTaskById(taskId) {
  return toDoListTasks.find((task) => task.id === taskId);
}

function getTaskOnFocusList() {
  return toDoListTasks.filter((task) => task.onFocusList && !task.completed);
}

function removeTaskFromList(listName, taskId) {
  const tbody = document.getElementById(listName);
  const tr = tbody.querySelector(`tr[data-task-id="${taskId}"]`);
  
  if (tr) {
    tr.remove();
  }

}

function getTasksByListName(listName) {
  const filteredTasks = toDoListTasks.filter((task) => {
    return task.listName === listName && !task.onFocusList;
  });
  
  const sortedTasks = filteredTasks.sort((taskA, taskB) => {
    return taskA.position - taskB.position;
  });
  
  return sortedTasks;
}

function toggleListDetails(lengthCurrentList, listName) {
  const listDetails = document.getElementById(`${listName}-details`);
  const spanSummaryElement = document.querySelector(`.${listName}-summary span`);

  spanSummaryElement.textContent = `(${lengthCurrentList})`;

  listDetails.open = lengthCurrentList > 0;

  if (!listDetails.open) {
    spanSummaryElement.textContent = "";
  }
}

function getTasksByPositionAndList(position, listName) {
  return toDoListTasks.filter((task) => task.listName === listName && task.position > position && !task.onFocusList);
}

function decreasePositionByOne(tasks) {
  tasks.forEach((task) => {
    task.position -= 1;
  });
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

function classifyTask(event) {
  const newListName = event.currentTarget.getAttribute("value");
  const taskId = parseInt(event.currentTarget.getAttribute("data-task-id"));
  const taskItemElement = event.currentTarget.closest(".task-element-item");

  const task = findTaskById(taskId);

  const previousList = task.listName;
  const previousPosition = task.position;

  task.listName = newListName;
  const taksInListName = getTasksByListName(task.listName);
  task.position = taksInListName.length;

  if (previousList !== "uncategorized-to-do-list") {
    const tasksToDecrease = getTasksByPositionAndList(previousPosition, previousList);
    decreasePositionByOne(tasksToDecrease);

    const taksInpreviousListName = getTasksByListName(previousList);
    toggleListDetails(taksInpreviousListName.length, previousList);
  }

  const tableBody = document.getElementById(newListName);
  const newTaskRowItem = createNewTaskRowItem(task);
  tableBody.appendChild(newTaskRowItem);

  // Remove the task from its current list
  taskItemElement.remove();

  // Toggle list details based on the list length
  toggleListDetails(task.position, newListName);
}

/**
 * Handles the editing of a task description.
 * @param {Event} event - dblclick event on the task description.
 */
function editTaskDescription(event) {
  // Obtener referencias a los elementos add-task-form y update-task-form
  const addTaskForm = document.getElementById("add-task-form");
  const updateTaskForm = document.getElementById("update-task-form");

  // Obtener referencias a los elementos necesarios
  const inputEditTask = document.getElementById("update-task-input");
  const listItem = event.currentTarget.parentNode;
  const taskDescription = event.currentTarget.closest(".task-description");
  const taskId = parseInt(taskDescription.dataset.taskId);

  // Encontrar la tarea por su ID
  const foundTask = findTaskById(taskId);

  // Ocultar el formulario de agregar tarea y mostrar el formulario de actualizar tarea
  addTaskForm.style.display = "none";
  updateTaskForm.style.display = "flex";

  // Establecer el ID de la tarea en el campo de entrada y llenarlo con la descripción de la tarea
  inputEditTask.dataset.taskId = taskId;
  inputEditTask.value = taskDescription.textContent;
  inputEditTask.focus();

  // Eliminar el elemento de la lista del DOM
  listItem.remove();

  // Obtener las tareas que tienen una posición mayor a la tarea actual y el mismo nombre de lista
  const tasksToDecrease = getTasksByPositionAndList(foundTask.position, foundTask.listName);
  const taksInListName = getTasksByListName(foundTask.listName);
  
  if (foundTask.listName !== "uncategorized-to-do-list") {
    // Toggle list details based on the list length
    toggleListDetails(taksInListName.length-1, foundTask.listName);
  }
  
  // Establecer la posición de la tarea encontrada en 0
  foundTask.position = 0;

  // Disminuir la posición en 1 de las tareas obtenidas
  decreasePositionByOne(tasksToDecrease);
}

function upListItem(event) {
  // Obtener el ID de la tarea actual
  const currentTaskId = parseInt(event.currentTarget.getAttribute("data-task-id"));

  // Obtener el elemento de la fila actual y su fila anterior
  const rowItem = event.currentTarget.closest("tr");
  const previousRowItem = rowItem.previousElementSibling;

  // Verificar si existe una fila anterior
  if (previousRowItem) {
    // Obtener el botón de mover hacia arriba en la fila anterior y su ID de tarea asociado
    const moveUpButtonPrevious = previousRowItem.querySelector(".move-up-task-position-button");
    const previousTaskId = parseInt(moveUpButtonPrevious.dataset.taskId);

    // Obtener las tareas actual y anterior
    const currentTask = findTaskById(currentTaskId);
    const previousTask = findTaskById(previousTaskId);

    // Actualizar las posiciones de las tareas
    currentTask.position -= 1;
    previousTask.position += 1;

    // Mover la fila actual antes de la fila anterior en el DOM
    rowItem.parentNode.insertBefore(rowItem, previousRowItem);
  }
}

function updateTaskDueDate(event) {
  const taskId = parseInt(event.currentTarget.dataset.taskId);
  const task = findTaskById(taskId);

  if (task) {
    const inputDate = event.currentTarget.value;
    const newDueDate = new DueDate(inputDate);
    task.dueDate = newDueDate;
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

  clonedRow.dataset.taskId = taskObject.id;

  const clonedDescription = clonedRow.querySelector(".task-description");
  clonedDescription.dataset.taskId = taskObject.id;
  clonedDescription.textContent = taskObject.description;
  clonedDescription.addEventListener("dblclick", editTaskDescription);

  const clonedDueDateInput = clonedRow.querySelector(".task-due-date-input");
  clonedDueDateInput.value = taskObject.dueDate?.formatDate() || "";
  clonedDueDateInput.dataset.taskId = taskObject.id;
  clonedDueDateInput.addEventListener("change", updateTaskDueDate);

  const clonedMoveUp = clonedRow.querySelector(".move-up-task-position-button");
  clonedMoveUp.addEventListener("click", upListItem);
  clonedMoveUp.dataset.taskId = taskObject.id;

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
  document.getElementById("new-task-input").focus();
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
  const taksInListName = getTasksByListName(listName);
  foundTask.position = taksInListName.length;

  // Update the task description with the new description
  foundTask.description = newTaskDescription;

  // Create a new task list item with the updated task
  let newTaskItem
  if (listName === "uncategorized-to-do-list") {
    newTaskItem = createNewTaskListItem(foundTask);
  } else {
    newTaskItem = createNewTaskRowItem(foundTask)
    
    // Toggle list details based on the list length
    toggleListDetails(foundTask.position, listName);
  }
  
  // Add the new task list item to the corresponding task list
  addTaskToList(newTaskItem, listName);
  
  //Reset the update task form and show the add task form
  resetUpdateTaskForm(updateTaskInput, addTaskForm, updateTaskForm);
}

function createOnFocusTask(task, template, focusOnSixList) {
  const clonedTemplate = template.content.cloneNode(true);
  const taskElementItem = clonedTemplate.querySelector(".task-element-item");

  taskElementItem.textContent = task.description;
  taskElementItem.dataset.taskId = task.id;

  focusOnSixList.appendChild(clonedTemplate);
}

function takeOnSixTasks() {
  const listNames = [
    "red-to-do-list",
    "orange-to-do-list",
    "yellow-to-do-list",
  ];

  const focusOnSixList = document.getElementById("focus-on-six-list");
  const template = document.getElementById("focus-on-template");

  let onFocusTask = focusOnSixList.childElementCount;

  if (onFocusTask >= 6) {
    return;
  }

  for (const listName of listNames) {
    const sortedTasks = getTasksByListName(listName);

    if (sortedTasks.length > 0) {

      for (const task of sortedTasks) {
        
        createOnFocusTask(task, template, focusOnSixList);
        removeTaskFromList(listName, task.id);
        onFocusTask = focusOnSixList.childElementCount;
        
        const previousPosition = task.position;
        task.onFocusList = true;
        task.position = onFocusTask;

        const tasksToDecrease = getTasksByPositionAndList(previousPosition, listName);
        decreasePositionByOne(tasksToDecrease);

        const taksListName = getTasksByListName(listName);
        toggleListDetails(taksListName.length, listName);

        if (onFocusTask >= 6) {
          break;
        }
      }
    }
  }

}

function handleReturnTask() {
  console.log("retorno");
}

function showPomodoroSegment() {
  const segment = document.querySelector('.pomodoro-segment');
  segment.classList.add('visible');
}

function createTaskInProgress(task) {
  const taskInProgress = document.getElementById('description-task-in-progress');
  taskInProgress.dataset.taskId = task.id;
  taskInProgress.textContent = task.description;
}

function handleStartTasks() {
  const tasksInProgress = getTaskOnFocusList();
  showPomodoroSegment();
  pomodoroTimerFunction();

  tasksInProgress.forEach(element => {
    element.inProgress = true;
    createTaskInProgress(element);
//
  });
}

function formatTimePomodoroDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
}

function startPomodoroTimer () {
  const timerDisplay = document.getElementById('pomodoro-stopwatch-display-input');
  const typeSession = timerDisplay.dataset.typeSession;
  pomodoroTimer.startWorkSession();
  
  let timeLeft = parseInt (pomodoroTimer[typeSession]) * 60;

  const timer = setInterval(() => {
    timeLeft--;
    timerDisplay.value = formatTimePomodoroDisplay(timeLeft);

    if (timeLeft === 0) {
      clearInterval(timer);
      pomodoroTimer.sessionsCompleted++;
      if (typeSession === 'workDuration') {
        timerDisplay.dataset.typeSession = 'shortBreakDuration';
        pomodoroTimer.startShortBreak();
      } else if (typeSession === 'shortBreakDuration') {
        timerDisplay.dataset.typeSession = 'workDuration';
        pomodoroTimer.startWorkSession();
      }
      return;
    }
  }, 1000);
}

function pomodoroTimerFunction() {
  //valores predeterminados del pomodoro en la sección de configuración
  const minPomodoro = parseInt(document.getElementById('pomodoro-stopwatch-minutes-dropdown').value);
  const minShortBreak = parseInt(document.querySelector('input[name="short-break-option"]:checked').value);
  const minLongBreak = parseInt(document.getElementById('pomodoro-stopwatch-long-break-select').value);
  const dataTypeSesion = document.getElementById('pomodoro-stopwatch-display-input');
  
  pomodoroTimer = new PomodoroTimer(minPomodoro, minShortBreak, minLongBreak);
  dataTypeSesion.value = formatTimePomodoroDisplay(minPomodoro * 60);
  dataTypeSesion.dataset.typeSession = 'workDuration';

  const startTasksButton = document.getElementById('pomodoro-stopwatch-play-button');
  startTasksButton.addEventListener('click', startPomodoroTimer);
}

