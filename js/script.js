let todos = [];
let currentFilter = "all";
let todoInput,
  dateInput,
  addBtn,
  filterBtn,
  deleteAllBtn,
  todoList,
  errorMessage;

function toggleComplete(id) {
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
}

function addTodo() {
  const task = todoInput.value.trim();
  const dueDate = dateInput.value;

  if (!task) {
    showError("Task tidak boleh kosong!");
    return;
  }

  if (!dueDate) {
    showError("Tanggal harus diisi!");
    return;
  }

  const today = new Date();
  const selectedDate = new Date(dueDate);
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    showError("Tanggal tidak boleh di masa lalu!");
    return;
  }

  const newTodo = {
    id: Date.now(),
    task: task,
    dueDate: dueDate,
    completed: false,
    createdAt: new Date(),
  };

  todos.push(newTodo);

  todoInput.value = "";
  dateInput.value = "";
  hideError();
  renderTodos();
}

function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(hideError, 3000);
  }
}

function hideError() {
  if (errorMessage) {
    errorMessage.style.display = "none";
  }
}

function deleteAllTodos() {
  if (todos.length === 0) {
    showError("Tidak ada task untuk dihapus!");
    return;
  }

  if (confirm("Apakah Anda yakin ingin menghapus semua task?")) {
    todos = [];
    renderTodos();
  }
}

function toggleFilter() {
  const filters = ["all", "pending", "completed"];
  const currentIndex = filters.indexOf(currentFilter);
  currentFilter = filters[(currentIndex + 1) % filters.length];
  if (filterBtn) {
    filterBtn.textContent = currentFilter.toUpperCase();
  }
  renderTodos();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
}

function renderTodos() {
  if (!todoList) return;

  let filteredTodos = todos;
  if (currentFilter === "pending") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  }

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `
                    <tr>
                        <td colspan="4" class="no-tasks">
                            ${
                              currentFilter === "all"
                                ? "No task found"
                                : currentFilter === "pending"
                                ? "No pending tasks"
                                : "No completed tasks"
                            }
                        </td>
                    </tr>
                `;
    return;
  }

  todoList.innerHTML = filteredTodos
    .map(
      (todo) => `
                        <tr>
                            <td>
                                <span class="task-text ${
                                  todo.completed ? "completed" : ""
                                }">${todo.task}</span>
                            </td>
                            <td>${formatDate(todo.dueDate)}</td>
                            <td>
                                <span class="status-badge ${
                                  todo.completed
                                    ? "status-completed"
                                    : "status-pending"
                                }">
                                    ${todo.completed ? "Completed" : "Pending"}
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn complete-btn" onclick="toggleComplete(${
                                      todo.id
                                    })">
                                        ${todo.completed ? "Undo" : "Complete"}
                                    </button>
                                    <button class="action-btn delete-btn" onclick="deleteTodo(${
                                      todo.id
                                    })">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", function () {
  todoInput = document.getElementById("todoInput");
  dateInput = document.getElementById("dateInput");
  addBtn = document.getElementById("addBtn");
  filterBtn = document.getElementById("filterBtn");
  deleteAllBtn = document.getElementById("deleteAllBtn");
  todoList = document.getElementById("todoList");
  errorMessage = document.getElementById("errorMessage");

  if (
    !todoInput ||
    !dateInput ||
    !addBtn ||
    !filterBtn ||
    !deleteAllBtn ||
    !todoList ||
    !errorMessage
  ) {
    console.error("Beberapa elemen DOM tidak ditemukan!");
    return;
  }

  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTodo();
    }
  });
  filterBtn.addEventListener("click", toggleFilter);
  deleteAllBtn.addEventListener("click", deleteAllTodos);

  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);

  renderTodos();
});
