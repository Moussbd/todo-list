const itemForm = document.getElementById("item-form");
const formBtn = itemForm.querySelector("button");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemClear = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const items = itemList.getElementsByTagName("li");

let isEditMode = false;

// functions
const displayItems = function () {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
};

const createIcon = function (classList) {
  const icon = document.createElement("i");
  icon.className = classList;
  return icon;
};
const createButton = function (classList) {
  const button = document.createElement("button");
  button.className = classList;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
};

const onAddItemSubmit = function (e) {
  e.preventDefault();
  const newItem = itemInput.value;
  // validate input
  if (!newItem) {
    alert("please add an item");
    return;
  }

  // check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("item already exits");
      return;
    }
  }
  // create item DOM element
  addItemToDOM(newItem);

  //add item to local storage
  addItemToStorage(newItem);
  // clear input field
  itemInput.value = "";

  // show input buttons
  checkUI();
};

const addItemToDOM = function (item) {
  // create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  itemList.appendChild(li);
};

const addItemToStorage = function (item) {
  const ItemsFromStorage = getItemsFromStorage();
  // add new item to array
  ItemsFromStorage.push(item);

  // convert to json string and set to local storage
  localStorage.setItem("items", JSON.stringify(ItemsFromStorage));
};

const getItemsFromStorage = function () {
  let ItemsFromStorage;
  if (localStorage.getItem("items") === null) {
    ItemsFromStorage = [];
  } else {
    ItemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return ItemsFromStorage;
};

const onClickItem = function (e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

const checkIfItemExists = function (item) {
  const itemsFromStorage = getItemsFromStorage();

  return itemsFromStorage.includes(item);
};

const setItemToEdit = function (item) {
  itemList
    .querySelectorAll("li")
    .forEach((li) => li.classList.remove("edit-mode"));
  isEditMode = true;
  item.classList.add("edit-mode");

  formBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Update Item`;
  formBtn.style.backgroundColor = "#228b22";
  itemInput.value = item.textContent;
};

const removeItem = function (item) {
  if (confirm("are you sure?")) {
    // remove item from DOM
    item.remove();

    // remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
};

const removeItemFromStorage = function (item) {
  let itemsFromStorage = getItemsFromStorage();

  // filter out items to be remove
  itemsFromStorage = itemsFromStorage.filter((i) => i != item);

  // re-set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

const clearItems = function (e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // clear from local storage
  localStorage.removeItem("items");
  checkUI();
};

const filterItems = function (e) {
  const text = e.target.value.toLowerCase();

  [...items].forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

const checkUI = function () {
  itemInput.value = "";
  if (items.length === 0) {
    itemClear.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    itemClear.style.display = "block";
    itemFilter.style.display = "block";
  }

  formBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
  formBtn.style.backgroundColor = "#333";

  isEditMode = false;
};

// initialize app
const init = function () {
  // event listeners
  itemForm.addEventListener("submit", onAddItemSubmit);

  itemList.addEventListener("click", onClickItem);
  itemClear.addEventListener("click", clearItems);

  itemFilter.addEventListener("input", filterItems);

  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
};

init();
