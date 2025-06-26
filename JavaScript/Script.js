const taskInput = document.querySelector('#taskInput');
const addBtn = document.querySelector('#addBtn');
const taskList = document.querySelector('#taskList');
const markAllBtn = document.querySelector('#markAll');
const clearAllBtn = document.querySelector('#clearAll');
const filterButtons = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({ text, done: false });
    saveTasks();
    taskInput.value = '';
    renderTasks();
}

function deleteTask(index) {
    const li = taskList.children[index];
    li.classList.add('exit');
    setTimeout(() => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }, 300);
}

function toggleDone(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function markAll() {
    tasks = tasks.map(task => ({ ...task, done: true }));
    saveTasks();
    renderTasks();
}

function clearAll() {
    tasks = [];
    saveTasks();
    renderTasks();
}

function applyFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    const filtered = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !task.done;
        if (currentFilter === 'done') return task.done;
    });
    filtered.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;

        if (task.done) {
            li.classList.add('done');
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const originalIndex = tasks.findIndex(t => t.text === task.text);
            deleteTask(originalIndex);
        });

        li.addEventListener('click', () => {
            const originalIndex = tasks.findIndex(t => t.text === task.text);
            toggleDone(originalIndex);
        });
        li.appendChild(deleteBtn);
        li.classList.add('enter');
        taskList.appendChild(li);
    });
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
});
markAllBtn.addEventListener('click', markAll);
clearAllBtn.addEventListener('click', clearAll);
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        applyFilter(button.dataset.filter);
    });
});

// Init
renderTasks();