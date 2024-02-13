const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");

// functions
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

const addItem = function (e) {
  e.preventDefault();
  const newInput = itemInput.value;
  // validate input
  if (!newInput) {
    alert("please add an item");
    return;
  }
  // create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newInput));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  itemList.appendChild(li);

  // clear input field
  itemInput.value = "";
};

// event listeners
itemForm.addEventListener("submit", addItem);
