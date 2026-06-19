// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Current filter
let currentFilter = "all";

// DOM elements
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const categoryInput = document.getElementById("category");
const dueDateInput = document.getElementById("dueDate");

const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressFill = document.getElementById("progressFill");

// Load theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
}

// Display existing tasks
displayTasks();


// ====================
// Event Listeners
// ====================

// Add button
addBtn.addEventListener("click", addTask);

// Enter key support
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Search
searchInput.addEventListener("input", displayTasks);

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        displayTasks();

    });

});


// Theme toggle
document.getElementById("themeToggle")
.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {

        localStorage.setItem("theme", "light");

    }
    else {

        localStorage.setItem("theme", "dark");

    }

});


// Clear All
document.getElementById("clearAll")
.addEventListener("click", () => {

    if (confirm("Delete all tasks?")) {

        tasks = [];

        saveTasks();

    }

});



// ====================
// Add Task
// ====================

function addTask() {

    let text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task!");

        return;

    }

    let date = new Date();

    tasks.push({

        text: text,

        priority: priorityInput.value,

        category: categoryInput.value,

        dueDate: dueDateInput.value,

        completed: false,

        createdAt: date.toLocaleString()

    });

    // Clear input fields

    taskInput.value = "";

    dueDateInput.value = "";

    saveTasks();

}



// ====================
// Save Tasks
// ====================

function saveTasks() {

    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

    displayTasks();

}
// ====================
// Display Tasks
// ====================

function displayTasks() {

    taskList.innerHTML = "";

    let searchValue = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(task => {

        // Search condition
        let matchesSearch =
            task.text.toLowerCase().includes(searchValue) ||
            task.category.toLowerCase().includes(searchValue);

        // Filter condition
        let matchesFilter = true;

        if (currentFilter === "completed") {

            matchesFilter = task.completed;

        }
        else if (currentFilter === "pending") {

            matchesFilter = !task.completed;

        }

        return matchesSearch && matchesFilter;

    });


    // Display tasks

    filteredTasks.forEach((task, index) => {

        let originalIndex = tasks.indexOf(task);

        let li = document.createElement("li");

        li.classList.add("task");

        // Priority border color
        if (task.priority === "High") {

            li.classList.add("high");

        }
        else if (task.priority === "Medium") {

            li.classList.add("medium");

        }
        else {

            li.classList.add("low");

        }

        // Completed style
        if (task.completed) {

            li.classList.add("completed");

        }

        li.innerHTML = `

        <div class="task-info">

            <h3>${task.text}</h3>

            <p>
                📂 Category :
                ${task.category}
            </p>

            <p>
                ⚡ Priority :
                ${task.priority}
            </p>

            <p>
                📅 Due Date :
                ${task.dueDate || "Not Set"}
            </p>

            <p>
                🕒 Added :
                ${task.createdAt}
            </p>

        </div>


        <div class="actions">

            <button
            class="complete-btn"
            onclick="toggleTask(${originalIndex})">

            ✓

            </button>


            <button
            class="edit-btn"
            onclick="editTask(${originalIndex})">

            Edit

            </button>


            <button
            class="delete-btn"
            onclick="deleteTask(${originalIndex})">

            Delete

            </button>

        </div>

        `;

        taskList.appendChild(li);

    });


    updateStats();

}
// ====================
// Toggle Complete
// ====================

function toggleTask(index) {

    tasks[index].completed =
        !tasks[index].completed;

    saveTasks();

}



// ====================
// Edit Task
// ====================

function editTask(index) {

    let newText = prompt(

        "Edit Task",

        tasks[index].text

    );

    if (

        newText !== null &&

        newText.trim() !== ""

    ) {

        tasks[index].text =
            newText.trim();

        saveTasks();

    }

}



// ====================
// Delete Task
// ====================

function deleteTask(index) {

    let answer = confirm(

        "Delete this task?"

    );

    if (answer) {

        tasks.splice(index, 1);

        saveTasks();

    }

}



// ====================
// Update Statistics
// ====================

function updateStats() {

    let total = tasks.length;

    let completed = tasks.filter(

        task => task.completed

    ).length;

    let pending = total - completed;



    totalTasks.innerText = total;

    completedTasks.innerText =
        completed;

    pendingTasks.innerText =
        pending;



    updateProgressBar();

}



// ====================
// Progress Bar
// ====================

function updateProgressBar() {

    let total = tasks.length;

    let completed = tasks.filter(

        task => task.completed

    ).length;



    let percentage = 0;

    if (total > 0) {

        percentage =
            (completed / total) * 100;

    }



    progressFill.style.width =
        percentage + "%";

}



// ====================
// Initial Load
// ====================

displayTasks();