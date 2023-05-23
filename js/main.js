class Task {
  static count = 0;

  constructor(description, listName) {
    this._id = ++Task.count;
    this._description = description;
    this._listName = listName;
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

}

let toDoListTasks = [];

// Obtener elementos del DOM
const completedTaskList = document.querySelector('ul[name="completed-task"]');
const addItemButton = document.querySelector(
  'button[name="add-new-task-button"]'
);
const newTaskTemplate = document.getElementById("blueListItem-newTask");
const taskLoaderButton = document.getElementById("taskloader");
const blueToDoListDetails = document.querySelector("#blue-to-do-list-details");
const redToDoListDetails = document.querySelector("#red-to-do-list-details");
const orangeToDoListDetails = document.querySelector("#orange-to-do-list-details");
const yellowToDoListDetails = document.querySelector("#yellow-to-do-list-details");

// Event listeners
addItemButton.addEventListener("click", addNewTaskToDoList);
taskLoaderButton.addEventListener("click", loadItems);

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
  const foundTask = toDoListTasks.find(task => task.id === idValue);
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
  targetDetails.open = true;
  targetDetails.querySelector('ul').appendChild(li);

  li.querySelector(".custom-dropdown").open = false;

  checkListLength (actualToDoList[0].childNodes.length, actualToDoListDetails);
}

function checkListLength(currentToDoList, currentDetailsElement) {
  
  if (currentToDoList === 0) {
    currentDetailsElement.open = false;
  }

}

function editListItem(event) {
  const liElement = event.target.parentNode;
  const spanElement = liElement.querySelector("span");
  const inputElement = document.getElementById("new-task-input");

  // Obtener el valor del <li> y asignarlo al <input>
  inputElement.value = spanElement.textContent;
  inputElement.focus();

  // Eliminar el <li> de la lista
  liElement.remove();
}

function upListItem(event) {
  const listItem = event.target.parentNode;
  const previousListItem = listItem.previousElementSibling;

  if (previousListItem) {
    listItem.parentNode.insertBefore(listItem, previousListItem);
  }
}

function addNewTaskToDoList(event) {
  event.preventDefault();

  // Obtiene el valor del input y elimina espacios en blanco al inicio y final
  const newTaskInput = document.getElementById("new-task-input").value.trim();

  // Si el input está vacío se sale da la función
  if (newTaskInput.trim() === "") return;
  
  // Crea una nueva instancia de la clase Task con la descripción y lista predeterminada
  const newTask = new Task(newTaskInput, "blue-to-do-list");
  toDoListTasks.push(newTask);


  // Clona el template y obtener la referencia al elemento de la nueva tarea
  const newTaskListItem =
    newTaskTemplate.content.cloneNode(true).firstElementChild;

  // Obtiene el elemento <span> dentro del elemento de la nueva tarea
  const spanElement = newTaskListItem.querySelector("span");

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
  spanElement.textContent = newTask.description;

  // Asigna el id de la tarea al nuevo elemento <li>
  newTaskListItem.id = newTask.id;

  // Agregar la nueva tarea a la lista azul
  blueToDoListDetails.open = true;
  blueToDoListDetails.querySelector('ul').appendChild(newTaskListItem);

  // Restablecer el valor del input a vacío
  document.getElementById("new-task-input").value = "";
}

function loadItems() {
  const redList = redToDoListDetails.querySelectorAll(".task-elementList");
  const orangeList = orangeToDoListDetails.querySelectorAll(".task-elementList");
  const yellowList = yellowToDoListDetails.querySelectorAll(".task-elementList");

  const focusOnSixList = document.querySelector('ul[name="focusOn-sixList"]');
  focusOnSixList.innerHTML = "";

  let loadedItems = 0;

  // Cargar elementos de la lista roja
  loadedItems = loadItemsFromList(redList, loadedItems, focusOnSixList);

  // Si aún se necesitan más elementos, cargar de la lista naranja
  if (loadedItems < 6) {
    loadedItems = loadItemsFromList(orangeList, loadedItems, focusOnSixList);
  }

  // Si aún se necesitan más elementos, cargar de la lista amarilla
  if (loadedItems < 6) {
    loadedItems = loadItemsFromList(yellowList, loadedItems, focusOnSixList);
  }
}

function loadItemsFromList(list, loadedItems, targetList) {
  let itemsToLoad = 6 - loadedItems;
  let itemsLoaded = 0;

  for (let i = 0; i < list.length; i++) {
    if (itemsLoaded >= itemsToLoad) {
      break;
    }

    const liElement = document.createElement("li");
    liElement.textContent = list[i].textContent;
    targetList.appendChild(liElement);

    list[i].remove();

    itemsLoaded++;
  }

  return loadedItems + itemsLoaded;
}

function createDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerHTML =
    '<img src="icons/icons8-delete-icon-16.png" alt="Eliminar tarea">';

  deleteButton.addEventListener("click", function (event) {
    event.target.closest("li").remove();
  });

  return deleteButton;
}
