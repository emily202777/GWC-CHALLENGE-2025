// Global variables
let streak = parseInt(localStorage.getItem("streak")) || 0; // Load streak from local storage
let loggingStreak = "Climate action streak: " + streak; // Initialize logging streak

// Function to display the current date next to "Your Dashboard"
function displayCurrentDate() {
    let dateElement = document.getElementById("currentDate");
    let today = new Date();
    
    // Format the date as "Month Day, Year" (e.g., "Feb 12, 2025")
    let formattedDate = today.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
    });

    dateElement.textContent = ` | ${formattedDate}`;
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", function () {
    let today = new Date();
    
    let formattedDate = today.toLocaleDateString("en-US", { 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
    });

    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let joinDate = "2/12/2025"; // Static for now, can be dynamically set

    document.getElementById("currentDate").textContent = formattedDate;
    document.getElementById("timeZone").textContent = timeZone;
    document.getElementById("joinDate").textContent = joinDate;
});

// Function to update streak logging
function updateStreak() {
    let todayStr = new Date().toISOString().split("T")[0]; // Get today's date

    let lastLogDate = localStorage.getItem("lastLogDate");

    if (!lastLogDate) {
        // First-time logging
        streak = 1;
    } else {
        let lastDate = new Date(lastLogDate);
        let difference = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24)); // Days between logs

        if (difference === 1) {
            // Logged on consecutive days → increase streak
            streak++;
        } else if (difference > 1) {
            // Missed a day → reset streak
            streak = 1;
        }
    }

    // Save updated streak & last logged date
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastLogDate", todayStr);

    displayStreak(); // Update UI
}

// Function to display the streak count in the UI
function displayStreak() {
    let streakElement = document.getElementById("loggingStreak");
    loggingStreak = "Climate action streak: " + streak; // Update variable

    if (streakElement) {
        streakElement.textContent = loggingStreak; // Update UI
    }
}

// Function to dynamically toggle and position sections below buttons
function toggleSection(sectionId, button) {
    let section = document.getElementById(sectionId);

    // If the section is already displayed, hide it
    if (section.style.display === "block") {
        section.style.display = "none";
        return;
    }

    // Hide all other sections before displaying the new one
    document.querySelectorAll(".dynamic-section").forEach(sec => sec.style.display = "none");

    // Get button position
    let buttonRect = button.getBoundingClientRect();

    // Set position below the button
    section.style.top = `${window.scrollY + buttonRect.bottom + 20}px`; // Adds space below the button
    section.style.left = "50%";
    section.style.transform = "translateX(-50%)";
    section.style.display = "block"; // Show the section
}

// Function to toggle the metrics section
function toggleMetricsRectangle(button) {
    let container = document.getElementById("metrics-container");

    if (container.innerHTML === "") {
        container.innerHTML = `
            <div class="rectangle metrics-box">
                <h3 class="metrics-title">Your Metrics</h3>
                <div class="metrics-container">
                    <div class="small-rectangle">Carbon Output: <span id="carbonOutputMetric">0 kg CO₂</span></div>
                    <div class="small-rectangle" id="loggingStreak">${loggingStreak}</div>
                    <div class="small-rectangle">Diet Score: <span id="dietScore">N/A</span></div>
                </div>
            </div>
        `;

        displayStreak();
    }

    toggleSection("metrics-container", button);
}

// Function to toggle the input field for activity logging
function toggleActivitiesRectangle(button) {
    let container = document.getElementById("activities-container");

    if (container.innerHTML === "") {
        container.innerHTML = `
            <div class="rectangle">
                <div class="input-container">
                    <input type="text" id="activityInput" placeholder="Type your activity..." class="input-box">
                    <button onclick="saveActivity()" class="save-btn">Save</button>
                </div>
                <ul id="activityList"></ul>
            </div>
        `;

        displayActivities();
    }

    toggleSection("activities-container", button);
}

// Function to toggle the "Your World" section
function toggleWorld(button) {
    let container = document.getElementById("world-container");

    if (container.innerHTML === "") {
        container.innerHTML = `
            <div class="rectangle">
                <p>Explore your world!</p>
                <button class="maximize-btn" onclick="window.location.href='3d-world.html'">Maximize</button>
            </div>
        `;
    }

    toggleSection("world-container", button);
}

// Function to toggle the "Magic Recommendations" section
function toggleRecommendations(button) {
    let container = document.getElementById("recommendations-container");

    if (container.innerHTML === "") {
        container.innerHTML = `<div class="rectangle">recommendations text container</div>`;
    }

    toggleSection("recommendations-container", button);
}

function loadUsername() {
    let savedUsername = localStorage.getItem("username");
    if (savedUsername) {
        document.getElementById("username").textContent = savedUsername;
    }
}

// Function to edit the username
function editUsername() {
    let usernameSpan = document.getElementById("username");
    let usernameInput = document.getElementById("username-input");

    usernameInput.value = usernameSpan.textContent; // Set input value to current username
    usernameSpan.style.display = "none"; // Hide username text
    usernameInput.style.display = "inline-block"; // Show input field
    usernameInput.focus(); // Focus on input

    // Save changes when pressing Enter or clicking outside
    usernameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            saveUsername();
        }
    });

    usernameInput.addEventListener("blur", saveUsername);
}

// Function to save username and store it in localStorage
function saveUsername() {
    let usernameSpan = document.getElementById("username");
    let usernameInput = document.getElementById("username-input");

    if (usernameInput.value.trim() !== "") {
        let newUsername = usernameInput.value.trim();
        usernameSpan.textContent = newUsername; // Update username
        localStorage.setItem("username", newUsername); // Save to localStorage
    }

    usernameSpan.style.display = "inline"; // Show username text
    usernameInput.style.display = "none"; // Hide input field
}

// Load username when the page loads
window.onload = function() {
    loadUsername();
};

// Function to load saved username and join date from localStorage
function loadUserData() {
    let savedUsername = localStorage.getItem("username");
    let joinDate = localStorage.getItem("joinDate");

    if (savedUsername) {
        document.getElementById("username").textContent = savedUsername;
    }

    if (joinDate) {
        document.getElementById("join-date").textContent = `Joined: ${joinDate}`;
    }
}

// Function to edit the username
function editUsername() {
    let usernameSpan = document.getElementById("username");
    let usernameInput = document.getElementById("username-input");

    usernameInput.value = usernameSpan.textContent; // Set input value to current username
    usernameSpan.style.display = "none"; // Hide username text
    usernameInput.style.display = "inline-block"; // Show input field
    usernameInput.focus(); // Focus on input

    // Save changes when pressing Enter or clicking outside
    usernameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            saveUsername();
        }
    });

    usernameInput.addEventListener("blur", saveUsername);
}

// Function to save username and store it in localStorage
function saveUsername() {
    let usernameSpan = document.getElementById("username");
    let usernameInput = document.getElementById("username-input");

    if (usernameInput.value.trim() !== "") {
        let newUsername = usernameInput.value.trim();
        usernameSpan.textContent = newUsername; // Update username
        localStorage.setItem("username", newUsername); // Save to localStorage

        // Check if a join date already exists
        if (!localStorage.getItem("joinDate")) {
            let currentDate = new Date().toLocaleDateString(); // Format: MM/DD/YYYY or locale format
            localStorage.setItem("joinDate", currentDate); // Save the first edit date as join date
            document.getElementById("join-date").textContent = `Joined: ${currentDate}`;
        }
    }

    usernameSpan.style.display = "inline"; // Show username text
    usernameInput.style.display = "none"; // Hide input field
}

// Load user data when the page loads
window.onload = function() {
    loadUserData();
};
