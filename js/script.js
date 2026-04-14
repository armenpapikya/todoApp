let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.getElementById("addBtn").onclick = addTask;
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  input.value = "";
  save();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

function editTask(id, newText) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, text: newText } : t
  );
  save();
  render();
}

function setFilter(type) {
  filter = type;
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
}

function render() {
  list.innerHTML = "";

  let filtered = tasks;
  if (filter === "active") {
    filtered = tasks.filter(t => !t.completed);
  } else if (filter === "completed") {
    filtered = tasks.filter(t => t.completed);
  }

  filtered.forEach(task => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = task.completed ? "completed" : "";

    span.onclick = () => toggleTask(task.id);

    span.ondblclick = () => {
      const inputEdit = document.createElement("input");
      inputEdit.value = task.text;

      inputEdit.onblur = () => {
        editTask(task.id, inputEdit.value);
      };

      li.replaceChild(inputEdit, span);
      inputEdit.focus();
    };

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => deleteTask(task.id);

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  counter.textContent = `${activeCount} tasks left`;
}

render();