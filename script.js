let tasks = {
    work: JSON.parse(localStorage.getItem("workTasks")) || [],
    study: JSON.parse(localStorage.getItem("studyTasks")) || [],
    exercise: JSON.parse(localStorage.getItem("exerciseTasks")) || [],
    others: JSON.parse(localStorage.getItem("othersTasks")) || []
};

document.addEventListener("DOMContentLoaded", () => {
    loadAllTasks();
    const category = getCategoryFromURL();
    if (!tasks[category]) {
        console.warn(`⚠️ No tasks found for category: ${category}, initializing...`);
        tasks[category] = [];
        saveTasks();
    }
    loadTasks(category);
});

function loadAllTasks() {
    Object.keys(tasks).forEach(category => {
        let storedData = localStorage.getItem(`${category}Tasks`);
        tasks[category] = storedData ? JSON.parse(storedData) : [];
    });
}

function getCategoryFromURL() {
    return window.location.pathname.split('/').pop().split('.')[0].toLowerCase();
}

function addTask(category) {
    const taskInput = document.getElementById("taskInput");
    if (!taskInput || taskInput.value.trim() === "") return;

    const newTaskText = taskInput.value.trim();

    const isDuplicate = tasks[category].some(task => task.text === newTaskText);
    if (isDuplicate) {
        alert("❌ You already have ths on the list!");
        return;
    }

    tasks[category].push({ text: newTaskText, completed: false });
    taskInput.value = "";
    saveTasks();
    loadTasks(category);
}


function loadTasks(category) {
    if (!tasks[category]) {
        console.error(`❌ Category not found in tasks: ${category}`);
        return;
    }

    console.log(`✅ Loading tasks for: ${category}`);

    let storedData = localStorage.getItem(`${category}Tasks`);
    tasks[category] = storedData ? JSON.parse(storedData) : [];

    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");

    if (!taskList) return;
    taskList.innerHTML = "";

    const completedTasks = tasks[category].filter(task => task.completed);
    const incompleteTasks = tasks[category].filter(task => !task.completed);
    const allTasks = [...incompleteTasks, ...completedTasks];

    allTasks.forEach((task, index) => {
        let listItem = document.createElement("li");
        listItem.classList.toggle("completed", task.completed);

        listItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="delete-btn" onclick="removeTask('${category}', ${index})">❌</button>
                <button class="complete-btn" onclick="toggleCompletion('${category}', ${index})">✔️</button>
            </div>
        `;

        taskList.appendChild(listItem);
    });

    if (taskCount) {
        taskCount.innerHTML = `Total Tasks: ${tasks[category].length} | Completed: ${completedTasks.length}`;
    }
}

function removeTask(category, index) {
    const taskList = document.getElementById("taskList").children;
    if (taskList[index]) {
        taskList[index].style.transform = "scale(0)";
        setTimeout(() => {
            tasks[category].splice(index, 1);
            saveTasks();
            loadTasks(category);
        }, 200);
    }
}

function toggleCompletion(category, index) {
    tasks[category][index].completed = !tasks[category][index].completed;
    saveTasks();

    const taskList = document.getElementById("taskList");
    const listItem = taskList.children[index];

    if (tasks[category][index].completed) {
        listItem.classList.add("completed");
    } else {
        listItem.classList.remove("completed");
    }
}

function saveTasks() {
    console.log("Saving tasks...");

    Object.keys(tasks).forEach(category => {
        localStorage.setItem(`${category}Tasks`, JSON.stringify(tasks[category]));
        console.log(`✅ Saved ${category}:`, tasks[category]);
    });
}

function goBack() {
    window.history.back();
}
