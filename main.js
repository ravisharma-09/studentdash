// 1. Dynamic Greeting and Date
function updateHeader() {
    const greetingElement = document.getElementById("greeting-text");
    const dateElement = document.getElementById("date-text");

    const now = new Date();
    const hour = now.getHours();

    // Simple if-else logic for greeting
    let greeting = "Hello";
    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }

    greetingElement.innerText = greeting + ", Student!";
    dateElement.innerText = now.toDateString();
}

// 2. Simple To-Do List Functionality
function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value;

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const list = document.getElementById("taskList");

    // Create new list item
    const newItem = document.createElement("li");
    newItem.innerText = taskText;

    // Add click event to toggle completed status
    newItem.onclick = function () {
        this.classList.toggle("completed");
    };

    // Add to the list
    list.appendChild(newItem);

    // Clear input
    input.value = "";
}

// Run when the page loads
updateHeader();

// Add event listener for Enter key on input
document.getElementById("taskInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
