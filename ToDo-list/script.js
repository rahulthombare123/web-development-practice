// ----------- STORAGE & STATE -----------
let todos = [];
let currentFilter = "all";   // 'all', 'active', 'completed'

// DOM elements
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addTodoBtn");
const todoListContainer = document.getElementById("todoList");
const itemsLeftSpan = document.querySelector("#itemsLeftCounter span");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

// ----- Helper: save to localStorage -----
function saveTodosToLocal() {
  localStorage.setItem("todo_list_app", JSON.stringify(todos));
}

// ----- Load initial data -----
function loadTodos() {
  const stored = localStorage.getItem("todo_list_app");
  if (stored) {
    todos = JSON.parse(stored);
  } else {
    // default demo tasks
    todos = [
      { id: Date.now() + 1, text: "Write your first task", completed: false },
      { id: Date.now() + 2, text: "Click checkbox to complete", completed: true },
      { id: Date.now() + 3, text: "Edit or delete with icons", completed: false }
    ];
    saveTodosToLocal();
  }
}

// ----- update remaining count (active tasks) -----
function updateItemsLeft() {
  const activeTasks = todos.filter(todo => !todo.completed).length;
  itemsLeftSpan.innerText = activeTasks;
}

// ----- Render list based on currentFilter -----
function renderTodos() {
  let filteredTodos = [];
  if (currentFilter === "all") {
    filteredTodos = [...todos];
  } else if (currentFilter === "active") {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  if (!filteredTodos.length) {
    let emptyMessage = "";
    if (currentFilter === "all") emptyMessage = "✨ No tasks yet. Add one above!";
    else if (currentFilter === "active") emptyMessage = "🏆 All tasks completed! Great job.";
    else emptyMessage = "✔️ No completed tasks yet.";
    todoListContainer.innerHTML = `<div class="empty-message"><i class="far fa-smile"></i> ${emptyMessage}</div>`;
    updateItemsLeft();
    return;
  }

  // build HTML for each task
  let tasksHtml = "";
  filteredTodos.forEach(todo => {
    const completedClass = todo.completed ? "completed" : "";
    const checkedAttr = todo.completed ? "checked" : "";
    tasksHtml += `
      <div class="todo-item ${completedClass}" data-id="${todo.id}">
        <input type="checkbox" class="todo-checkbox" ${checkedAttr} data-id="${todo.id}">
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <div class="action-buttons">
          <button class="edit-btn" data-id="${todo.id}" title="Edit task"><i class="fas fa-pencil-alt"></i></button>
          <button class="delete-btn" data-id="${todo.id}" title="Delete task"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `;
  });
  todoListContainer.innerHTML = tasksHtml;
  updateItemsLeft();
}

// simple XSS protection
function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ----- add new todo -----
function addTodo() {
  let newText = todoInput.value.trim();
  if (newText === "") {
    todoInput.style.border = "1px solid #ffbcbc";
    setTimeout(() => { todoInput.style.border = ""; }, 500);
    return;
  }
  const newTodo = {
    id: Date.now(),
    text: newText,
    completed: false
  };
  todos.push(newTodo);
  saveTodosToLocal();
  // after adding, reset filter to 'all' so user sees new task
  currentFilter = "all";
  updateActiveFilterButton();
  todoInput.value = "";
  renderTodos();
  todoInput.focus();
}

// ----- delete todo -----
function deleteTodoById(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodosToLocal();
  renderTodos();
}

// ----- toggle complete status -----
function toggleComplete(id, isChecked) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = isChecked;
    saveTodosToLocal();
    renderTodos();
  }
}

// ----- edit todo text (prompt)-----
function editTodoById(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  let newText = prompt("✏️ Edit your task", todo.text);
  if (newText !== null) {
    newText = newText.trim();
    if (newText === "") {
      alert("Task cannot be empty.");
      return;
    }
    todo.text = newText;
    saveTodosToLocal();
    renderTodos();
  }
}

// ----- clear all completed tasks -----
function clearCompleted() {
  const hadCompleted = todos.some(t => t.completed);
  if (!hadCompleted) return;
  todos = todos.filter(todo => !todo.completed);
  saveTodosToLocal();
  renderTodos();
}

// ----- update active filter button UI -----
function updateActiveFilterButton() {
  filterBtns.forEach(btn => {
    const filterValue = btn.getAttribute("data-filter");
    if (filterValue === currentFilter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// ----- set filter and re-render -----
function setFilter(filter) {
  currentFilter = filter;
  updateActiveFilterButton();
  renderTodos();
}

// ---------- EVENT DELEGATION (handling dynamic elements) ----------
function attachGlobalDelegation() {
  todoListContainer.addEventListener("click", (e) => {
    // Delete button
    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
      e.preventDefault();
      const id = parseInt(deleteBtn.getAttribute("data-id"));
      if (id) deleteTodoById(id);
      return;
    }
    // Edit button
    const editBtn = e.target.closest(".edit-btn");
    if (editBtn) {
      e.preventDefault();
      const id = parseInt(editBtn.getAttribute("data-id"));
      if (id) editTodoById(id);
      return;
    }
  });

  // Change event for checkboxes (toggle)
  todoListContainer.addEventListener("change", (e) => {
    const checkbox = e.target.closest(".todo-checkbox");
    if (checkbox) {
      const id = parseInt(checkbox.getAttribute("data-id"));
      if (id) {
        toggleComplete(id, checkbox.checked);
      }
    }
  });
}

// ----- filter buttons listeners -----
function bindFilterListeners() {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      if (filter === "all") setFilter("all");
      else if (filter === "active") setFilter("active");
      else if (filter === "completed") setFilter("completed");
    });
  });
}

// ----- add button & enter key -----
function bindInputEvents() {
  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo();
    }
  });
  clearCompletedBtn.addEventListener("click", clearCompleted);
}

// ----- focus helper -----
function setInitialFocus() {
  todoInput.focus();
}

// ----- initialization -----
function init() {
  loadTodos();
  attachGlobalDelegation();
  bindFilterListeners();
  bindInputEvents();
  renderTodos();
  setInitialFocus();
}

// Start the app when DOM is ready
document.addEventListener("DOMContentLoaded", init);
