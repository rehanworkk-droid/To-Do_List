const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.toggle("completed", task.completed);

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="complete-btn">${task.completed ? "Undo" : "Done"}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Complete toggle
    li.querySelector(".complete-btn").addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks(filter);
    });

    // Edit task
    li.querySelector(".edit-btn").addEventListener("click", () => {
      const newText = prompt("Edit task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks(filter);
      }
    });

    // Delete task
    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks(filter);
    });

    taskList.appendChild(li);
  });
}

// Add new task
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    tasks.push({ text: taskText, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks(document.querySelector(".filters button.active").dataset.filter);
  }
});

// Filters
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

// Initial render
renderTasks();
