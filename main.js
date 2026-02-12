function updateHeader() {
    const greet = document.getElementById("greeting-text");
    const date = document.getElementById("date-text");

    if (greet && date) {
        const now = new Date();
        const hour = now.getHours();

        let text = "Hello";
        if (hour < 12) text = "Good Morning";
        else if (hour < 18) text = "Good Afternoon";
        else text = "Good Evening";

        greet.innerText = text + ", Student!";

        const opt = { weekday: 'long', month: 'long', day: 'numeric' };
        date.innerText = now.toLocaleDateString('en-US', opt);
    }
}

const quotes = [
    "The best way to predict the future is to create it.",
    "You are capable of more than you know.",
    "Believe you can and you're halfway there.",
    "Don't watch the clock; do what it does. Keep going.",
    "Success is the sum of small efforts, repeated day in and day out."
];

function showQuote() {
    const el = document.getElementById("daily-quote");
    if (el) {
        const i = Math.floor(Math.random() * quotes.length);
        el.innerText = `"${quotes[i]}"`;
    }
}

function updateProgress() {
    const all = document.querySelectorAll("#taskList li");
    const total = all.length;
    const done = document.querySelectorAll("#taskList li.completed").length;

    let pct = 0;
    if (total > 0) {
        pct = Math.round((done / total) * 100);
    }

    const bar = document.querySelector(".progress-fill");
    const txt = document.querySelector(".progress-text");

    if (bar) bar.style.width = pct + "%";
    if (txt) txt.innerText = pct + "%";
}

function addTask() {
    const input = document.getElementById("taskInput");
    const val = input.value.trim();

    if (val === "") {
        alert("Please enter a task!");
        return;
    }

    const list = document.getElementById("taskList");
    const li = document.createElement("li");
    li.innerText = val;

    li.onclick = function () {
        this.classList.toggle("completed");
        updateProgress();
    };

    list.appendChild(li);
    input.value = "";

    updateProgress();
}

function initList() {
    const items = document.querySelectorAll("#taskList li");
    items.forEach(li => {
        li.onclick = function () {
            this.classList.toggle("completed");
            updateProgress();
        };
    });
    updateProgress();
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function saveTable() {
    const tbody = document.getElementById("schedule-body");
    if (!tbody) return;

    const data = {};
    const rows = tbody.querySelectorAll("tr");

    rows.forEach((row, timeIdx) => {
        const cells = row.querySelectorAll("td");
        for (let i = 1; i < cells.length; i++) {
            const day = days[i - 1];
            if (!data[day]) data[day] = [];
            data[day].push(cells[i].innerText);
        }
    });

    localStorage.setItem("mySchedule", JSON.stringify(data));
    updateNextClass();
}

function loadTable() {
    const saved = localStorage.getItem("mySchedule");
    if (!saved) return;

    const data = JSON.parse(saved);
    const tbody = document.getElementById("schedule-body");
    if (!tbody) return;

    const rows = tbody.querySelectorAll("tr");

    rows.forEach((row, timeIdx) => {
        const cells = row.querySelectorAll("td");
        for (let i = 1; i < cells.length; i++) {
            const day = days[i - 1];
            if (data[day] && data[day][timeIdx]) {
                cells[i].innerText = data[day][timeIdx];
            }
        }
    });
}

function setupTableEdits() {
    const tbody = document.getElementById("schedule-body");
    if (!tbody) return;

    tbody.addEventListener("focusout", saveTable);
}

function updateNextClass() {
    const el = document.getElementById("next-class");
    if (!el) return;

    let schedule = JSON.parse(localStorage.getItem("mySchedule"));

    if (!schedule) {
        schedule = {
            "Monday": ["Math", "Science", "History", "Lunch", "English"],
            "Tuesday": ["History", "English", "Math", "Lunch", "Science"],
            "Wednesday": ["Math", "Science", "History", "Lunch", "English"],
            "Thursday": ["History", "English", "Math", "Lunch", "Science"],
            "Friday": ["PE", "Art", "Biology", "Lunch", "Self Study"]
        };
    }

    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const hour = now.getHours();

    const periods = [9, 10, 11, 12, 13];
    let next = "No Classes";

    if (schedule[day]) {
        let idx = -1;
        for (let i = 0; i < periods.length; i++) {
            if (hour < periods[i]) {
                idx = i;
                break;
            }
        }

        if (idx !== -1) {
            next = schedule[day][idx];
        } else if (hour < 9) {
            next = schedule[day][0];
        } else {
            next = "Done for Day";
        }
    } else {
        next = "Weekend!";
    }

    el.innerText = next;
}

updateHeader();
showQuote();
initList();
loadTable();
setupTableEdits();
updateNextClass();

const taskInp = document.getElementById("taskInput");
if (taskInp) {
    taskInp.addEventListener("keypress", function (e) {
        if (e.key === "Enter") addTask();
    });
}
