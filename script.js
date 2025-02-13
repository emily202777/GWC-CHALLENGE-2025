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
document.addEventListener("DOMContentLoaded", displayCurrentDate);

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

// Function to toggle the metrics rectangle
function toggleMetricsRectangle() {
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

        displayStreak(); // Update streak count in the UI
    } else {
        container.innerHTML = "";
    }
}

// Function to toggle the input field for activity logging
function toggleActivitiesRectangle() {
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

        displayActivities(); // Display stored activities
    } else {
        container.innerHTML = "";
    }
}

// Function to save the activity
function saveActivity() {
    let input = document.getElementById("activityInput").value.trim();
    let todayStr = new Date().toISOString().split("T")[0]; // Get today's date as "YYYY-MM-DD"

    if (input !== "") {
        let activities = JSON.parse(localStorage.getItem("activities")) || [];

        // Add new activity with timestamp
        activities.unshift({ text: input, date: todayStr }); // Store activity with date
        localStorage.setItem("activities", JSON.stringify(activities));

        // Check if it's the first activity logged today
        let lastLogDate = localStorage.getItem("lastLogDate");

        if (lastLogDate !== todayStr) {
            updateStreak(); // Increase streak only if it's the first log of the day
        }

        displayActivities(); // Refresh list to show new item first
        document.getElementById("activityInput").value = ""; // Clear input field
    } else {
        alert("Please enter an activity.");
    }
}

// Function to delete an activity and reset streak if needed
function deleteActivity(index) {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    let todayStr = new Date().toISOString().split("T")[0];

    // Remove the selected activity
    activities.splice(index, 1);
    localStorage.setItem("activities", JSON.stringify(activities));

    // Check if there are any activities left for today
    let hasActivitiesToday = activities.some(activity => activity.date === todayStr);

    if (!hasActivitiesToday) {
        // No activities left for today → Reset streak to 0
        streak = 0;
        localStorage.setItem("streak", streak);
        localStorage.setItem("lastLogDate", ""); // Clear last log date
    }

    displayActivities(); // Refresh displayed list
    displayStreak(); // Update streak display
}

// Function to display the stored activities inside the rectangle
function displayActivities() {
    let activityList = document.getElementById("activityList");
    if (activityList) {
        activityList.innerHTML = ""; // Clear previous list
        let activities = JSON.parse(localStorage.getItem("activities")) || [];

        activities.forEach((activity, index) => {
            let li = document.createElement("li");
            li.textContent = activity.text; // Display activity text

            // Add a delete button
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.className = "delete-btn";
            deleteBtn.onclick = function () {
                deleteActivity(index);
            };

            li.appendChild(deleteBtn);
            activityList.appendChild(li);
        });
    }
}

// Function to toggle the "Your World" section
function toggleWorld() {
    let container = document.getElementById("world-container");

    if (container.innerHTML === "") {
        container.innerHTML = `
            <div class="rectangle">
                <p>Explore your world!</p>
                <button class="maximize-btn" onclick="window.location.href='3d-world.html'">Maximize</button>
            </div>
        `;
    } else {
        container.innerHTML = "";
    }
}


// Function to toggle the "Magic Recommendations" section
function toggleRecommendations() {
    let container = document.getElementById("recommendations-container");
    if (container.innerHTML === "") {
        container.innerHTML = '<div class="rectangle">recommendations text container</div>';
    } else {
        container.innerHTML = "";
    }
}
