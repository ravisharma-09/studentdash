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

if (taskInp) {
    taskInp.addEventListener("keypress", function (e) {
        if (e.key === "Enter") addTask();
    });
}

function addAssignment() {
    const titleInp = document.getElementById("asgTitle");
    const detailInp = document.getElementById("asgDetail");

    const title = titleInp.value.trim();
    const detail = detailInp.value.trim();

    if (title === "") {
        alert("Please enter a title!");
        return;
    }

    const container = document.getElementById("assignmentList");

    const div = document.createElement("div");
    div.className = "assignment-card";

    div.innerHTML = `
        <h3>${title}</h3>
        <p>${detail}</p>
        <button class="done-btn" onclick="this.parentElement.remove()">Mark as Done</button>
    `;

    container.appendChild(div);

    titleInp.value = "";
    detailInp.value = "";
}

function addSubject() {
    const input = document.getElementById("newSubjectInput");
    const name = input.value.trim();

    if (name === "") {
        alert("Enter a subject name!");
        return;
    }

    const grid = document.getElementById("gradesGrid");

    const div = document.createElement("div");
    div.className = "card subject-card";

    div.innerHTML = `
        <h3>${name}</h3>
        <table class="exam-table" style="width: 100%; text-align: left; margin-top: 10px; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid #eee;">
                    <th style="padding: 8px;">Exam</th>
                    <th style="padding: 8px;">Score</th>
                </tr>
            </thead>
            <tbody class="exam-list-body"></tbody>
        </table>
        <div class="add-exam-form">
            <input type="text" placeholder="Exam Name" class="exam-name">
            <div style="display: flex; gap: 8px;">
                <input type="number" placeholder="Marks" class="exam-marks">
                <input type="number" placeholder="Out of" class="exam-total">
            </div>
            <button onclick="addExam(this)">Add Exam</button>
        </div>
    `;

    grid.appendChild(div);
    input.value = "";
}

function addExam(btn) {
    const form = btn.parentElement;
    const nameInp = form.querySelector(".exam-name");
    const marksInp = form.querySelector(".exam-marks");
    const totalInp = form.querySelector(".exam-total");

    const name = nameInp.value.trim();
    const marks = marksInp.value;
    const total = totalInp.value;

    if (name === "" || marks === "" || total === "") {
        alert("Please fill all fields!");
        return;
    }

    const card = form.parentElement;
    const tbody = card.querySelector(".exam-list-body");

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td style="padding: 8px; border-bottom: 1px solid #f9f9f9;">${name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #f9f9f9;">${marks}/${total}</td>
    `;

    tbody.appendChild(tr);

    // clear inputs
    nameInp.value = "";
    marksInp.value = "";
    totalInp.value = "";
}
