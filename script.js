let tasks = {
    work: JSON.parse(localStorage.getItem("workTasks")) || [],
    study: JSON.parse(localStorage.getItem("studyTasks")) || [],
    exercise: JSON.parse(localStorage.getItem("exerciseTasks")) || [],
    others: JSON.parse(localStorage.getItem("othersTasks")) || []
};

function addTask(category) {
    const taskInput = document.getElementById("taskInput");
    if (taskInput && taskInput.value.trim() !== "") {
        tasks[category].push({ text: taskInput.value, completed: false });
        taskInput.value = "";
        saveTasks();
        loadTasks(category);
    }
}

function loadTasks(category) {
    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");
    taskList.innerHTML = "";

    if (!tasks[category]) return; // ป้องกันกรณี category ผิดพลาด

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

        // เพิ่ม Animation ให้ค่อยๆ โผล่มา
        setTimeout(() => {
            listItem.style.transform = "scale(1)";
        }, 50);
    });

    if (taskCount) {
        taskCount.innerHTML = `Total Tasks: ${tasks[category].length} | Completed: ${completedTasks.length}`;
    }
}

function toggleCompletion(category, index) {
    tasks[category][index].completed = !tasks[category][index].completed; // สลับสถานะงาน
    saveTasks();
    loadTasks(category);
}

function removeTask(category, index) {
    const taskList = document.getElementById("taskList").children;

    if (taskList[index]) {
        // ทำให้ Task หายไปก่อนลบ
        taskList[index].style.transform = "scale(0)";
        setTimeout(() => {
            tasks[category].splice(index, 1);
            saveTasks();
            loadTasks(category);
        }, 200);
    }
}

function saveTasks() {
    localStorage.setItem("workTasks", JSON.stringify(tasks.work));
    localStorage.setItem("studyTasks", JSON.stringify(tasks.study));
    localStorage.setItem("exerciseTasks", JSON.stringify(tasks.exercise));
    localStorage.setItem("othersTasks", JSON.stringify(tasks.others));
}

function goBack() {
    window.history.back();
}

document.addEventListener("DOMContentLoaded", () => {
    const category = window.location.pathname.split('/').pop().split('.')[0];
    loadTasks(category);
});
