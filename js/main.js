class Task {
  static count = 0;

  constructor(description, listName) {
    this._id = ++Task.count;
    this._description = description;
    this._listName = listName;
    this._position = null; // Nueva propiedad para almacenar la posición
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
}

let toDoListTasks = [];
  
// Obtener la fecha actual
  const currentDate = new Date();

// Obtener el día de la semana en formato largo
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = currentDate.toLocaleDateString(undefined, options);

  // Obtener el elemento div por su ID
  const currentDateDiv = document.getElementById("current-date");

  // Establecer el contenido del div como la fecha formateada
  currentDateDiv.textContent = formattedDate;

// Obtener elementos del DOM
const completedTaskList = document.querySelector('ul[name="completed-task"]');
const addItemButton = document.querySelector('.add-new-task-button');
const newTaskTemplate = document.getElementById("blueListItem-newTask");
const taskLoaderButton = document.getElementById("taskloader");
const blueToDoListDetails = document.querySelector("#blue-to-do-list-details");
const redToDoListDetails = document.querySelector("#red-to-do-list-details");
const orangeToDoListDetails = document.querySelector("#orange-to-do-list-details");
const yellowToDoListDetails = document.querySelector("#yellow-to-do-list-details");

// Event listeners
addItemButton.addEventListener("click", addNewTaskToDoList);
taskLoaderButton.addEventListener("click", loadItems);

function addTaskToList(task, listElement) {
  listElement.open = true;
  listElement.querySelector('ul').appendChild(task);
}

function findTaskById(taskId) {
  return toDoListTasks.find(task => task.id === taskId);
}

function findTaskByIdAndListName(id, listName) {
  return toDoListTasks.find(task => task.id === id && task.listName === listName);
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
  toDoListTasks = toDoListTasks.filter(task => task.id !== taskId);
}

function validateInput(inputValue) {
  return inputValue.trim() !== "";
}

function toggleDropdown(event) {
  const dropdown = event.currentTarget.closest('.custom-dropdown');
  const summary = dropdown.querySelector('summary');
  summary.click();
}

// Manejo de clasificaciones
function handleClassification(event) {
  const li = event.currentTarget.closest('.task-elementList');
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
      { class: 'changeClass-redButton', value: 'red-to-do-list' },
      { class: 'changeClass-orangeButton', value: 'orange-to-do-list' },
      { class: 'changeClass-yellowButton', value: 'yellow-to-do-list' },
      { class: 'changeClass-blueButton', value: 'blue-to-do-list' }
    ],
    "orange-to-do-list": [
      { class: 'changeClass-orangeButton', value: 'orange-to-do-list' },
      { class: 'changeClass-redButton', value: 'red-to-do-list' },
      { class: 'changeClass-yellowButton', value: 'yellow-to-do-list' },
      { class: 'changeClass-blueButton', value: 'blue-to-do-list' }
    ],
    "yellow-to-do-list": [
      { class: 'changeClass-yellowButton', value: 'yellow-to-do-list' },
      { class: 'changeClass-redButton', value: 'red-to-do-list' },
      { class: 'changeClass-orangeButton', value: 'orange-to-do-list' },
      { class: 'changeClass-blueButton', value: 'blue-to-do-list' }
    ],
    "blue-to-do-list": [
      { class: 'changeClass-blueButton', value: 'blue-to-do-list' },
      { class: 'changeClass-redButton', value: 'red-to-do-list' },
      { class: 'changeClass-orangeButton', value: 'orange-to-do-list' },
      { class: 'changeClass-yellowButton', value: 'yellow-to-do-list' }
    ]
  };

  const selectedClassValues = classValues[buttonValue];

  foundTask.listName = buttonValue;
  currentButton.classList.remove(currentButton.classList.value);
  currentButton.classList.add(selectedClassValues[0].class);
  currentButton.value = buttonValue;

  buttonsDropdownList.forEach((button, index) => {
    const element = selectedClassValues[index+1];
    button.classList.remove(button.classList.value);
    button.classList.add(element.class);
    button.value = element.value;
  });

  const targetDetails = document.getElementById(buttonValue + '-details');
  
  // Agregar la tarea a la lista que corresponde
  addTaskToList(li, targetDetails);
  updateTaskPositions(foundTask.listName);
  updateTaskPositions(actualList);


  li.querySelector(".custom-dropdown").open = false;

  checkListLength (actualToDoList[0].childNodes.length, actualToDoListDetails);
}

function checkListLength(currentToDoList, currentDetailsElement) {
  
  if (currentToDoList === 0) {
    currentDetailsElement.open = false;
  }

}

function editListItem(event) {
  const li = event.currentTarget.closest('.task-elementList');
  const inputElement = li.querySelector(".taskDescription");
  const taskId = parseInt(li.id);

  inputElement.removeAttribute("readonly");
  inputElement.focus();

  inputElement.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const newDescription = inputElement.value.trim();

      if (newDescription === "") {
        const foundTask = findTaskById(taskId);
        const actualList = foundTask.listName;
        const actualToDoList = document.getElementsByClassName(actualList);
        const actualToDoListDetails = actualToDoList[0].parentNode;
        // Si el usuario deja el campo en blanco y presiona Enter, elimina la tarea
        li.remove();
        deleteTaskById(taskId);
        checkListLength (actualToDoList[0].childNodes.length, actualToDoListDetails);
      } else if (newDescription !== inputElement.defaultValue) {
        // Si el usuario hace modificaciones en la descripción de la tarea
        updateTaskDescription(taskId, newDescription);
      }

      inputElement.setAttribute("readonly", true);
    }
  });
}

function upListItem(event) {
  const listItem = event.target.closest('li');
  const previousListItem = listItem.previousElementSibling;

  if (previousListItem) {
    listItem.parentNode.insertBefore(listItem, previousListItem);
    const listId = listItem.parentNode.id;
    updateTaskPositions(listId);
  }
}

function addNewTaskToDoList(event) {
  event.preventDefault();

  // Obtiene el valor del input y elimina espacios en blanco al inicio y final
  const newTaskInput = document.getElementById("new-task-input").value;

  // Si el input está vacío se sale da la función
  if (!validateInput(newTaskInput)) return;
  
  const listName = "blue-to-do-list";

  // Crea una nueva instancia de la clase Task con la descripción y listName predeterminados
  const newTask = new Task(newTaskInput, listName);
  toDoListTasks.push(newTask);

  // Clona el template y obtener la referencia al elemento de la nueva tarea
  const newTaskListItem = newTaskTemplate.content.cloneNode(true).firstElementChild;

  // Obtiene el elemento <input> dentro del elemento de la nueva tarea
  const inputElement = newTaskListItem.querySelector(".taskDescription");

  // Obtiene las referencias de los botones
  const blueButton = newTaskListItem.querySelector('.changeClass-blueButton');
  const redButton = newTaskListItem.querySelector('.changeClass-redButton');
  const orangeButton = newTaskListItem.querySelector('.changeClass-orangeButton');
  const yellowButton = newTaskListItem.querySelector('.changeClass-yellowButton');
  const upArrowButton = newTaskListItem.querySelector(".upArrow-button");
  const editItemButton = newTaskListItem.querySelector(".edit-item-button");

  // Agregar eventos de clic a los botones
  blueButton.addEventListener("click", toggleDropdown);
  redButton.addEventListener("click", handleClassification);
  orangeButton.addEventListener("click", handleClassification);
  yellowButton.addEventListener("click", handleClassification);
  upArrowButton.addEventListener("click", upListItem);
  editItemButton.addEventListener("click", editListItem);

  // Asigna el valor del input en el elemento <span> de la nueva tarea
  inputElement.value = newTask.description;

  // Asigna el id de la tarea al nuevo elemento <li>
  newTaskListItem.id = newTask.id;

  // Agregar la nueva tarea a la lista azul
  addTaskToList(newTaskListItem, blueToDoListDetails);

  // Restablecer el valor del input a vacío
  document.getElementById("new-task-input").value = "";

  updateTaskPositions(listName);
}

function loadItems() {
  const listNames = ["red-to-do-list", "orange-to-do-list", "yellow-to-do-list"];
  const focusOnSixList = document.getElementById('focusOn-sixList');

  const template = document.getElementById("focusOn-elementsList");

  let loadedItems = 0;

  for (const listName of listNames) {
    const tasks = toDoListTasks.filter(task => task.listName === listName);
    const sortedTasks = tasks.sort((a, b) => a.position - b.position);

    for (const task of sortedTasks) {
      const listItem = document.getElementById(task.id);

      if (listItem) {
        const clonedTemplate = template.content.cloneNode(true).firstElementChild;
        const descriptionElement = clonedTemplate.querySelector(".taskDescription-elementList");
        const returnButton = clonedTemplate.querySelector(".return-task-button");
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

function handleReturnTask (){
  console.log("retorno")
}

function handleStartTask(){
  console.log("Empieza")
}
