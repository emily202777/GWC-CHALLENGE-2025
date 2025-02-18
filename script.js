function editUsername() {
    let usernameSpan = document.getElementById("username");
    let usernameInput = document.getElementById("username-input");

    // Show input field when clicking the pencil
    usernameInput.value = usernameSpan.textContent;
    usernameSpan.style.display = "none";
    usernameInput.style.display = "inline-block";
    usernameInput.focus();

    // Handle Enter key to save username
    usernameInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            saveUsername();
        }
    });

    // Handle clicking outside the input to save
    usernameInput.addEventListener("blur", saveUsername);
}

function saveUsername() {
    let usernameSpan = document.getElementById("username");
    let usernameInput = document.getElementById("username-input");
    let newUsername = usernameInput.value.trim();

    if (newUsername) {
        usernameSpan.textContent = newUsername;
        localStorage.setItem("username", newUsername);

        // If join date is not set, set it now (first-time username change)
        if (!localStorage.getItem("joinDate")) {
            let today = new Date();
            let formattedDate = today.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            });
            localStorage.setItem("joinDate", formattedDate);
            document.getElementById("join-date").textContent = `Joined: ${formattedDate}`;
        }
    }

    // Hide input field and show username again
    usernameInput.style.display = "none";
    usernameSpan.style.display = "inline";
}



// Load username & join date from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
    let savedUsername = localStorage.getItem("username");
    if (savedUsername) {
        document.getElementById("username").textContent = savedUsername;
    }

    let savedJoinDate = localStorage.getItem("joinDate") || "2/12/2025";
    document.getElementById("join-date").textContent = `Joined: ${savedJoinDate}`;
});

// Load username from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
    let savedUsername = localStorage.getItem("username");
    if (savedUsername) {
        document.getElementById("username").textContent = savedUsername;
    }
});


document.addEventListener("DOMContentLoaded", function () {
    let today = new Date();
    let formattedDate = today.toLocaleDateString("en-US", { 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
    });

    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let joinDate = localStorage.getItem("joinDate") || "2/12/2025"; 

    document.getElementById("currentDate").textContent = formattedDate;
    document.getElementById("timeZone").textContent = timeZone;
    document.getElementById("join-date").textContent = `Joined: ${joinDate}`;

    loadActivities(); // Load saved activities when the page loads
    updateTotalCarbon(); // Update total carbon output
});

function toggleSection(sectionId, button, content) {
    let section = document.getElementById(sectionId);
    if (!section) return;

    let existingBox = section.querySelector(".rectangle");

    if (existingBox) {
        existingBox.style.display = existingBox.style.display === "none" ? "block" : "none";
        return;
    }

    let box = document.createElement("div");
    box.className = "rectangle dynamic-section";
    box.innerHTML = content + `<div class="resizer"></div>`;

    section.appendChild(box);
    section.style.display = "block";
    
    makeDraggable(box);
    makeResizable(box);
}

function toggleActivitiesRectangle(button) {
    let section = document.getElementById("activities-container");
    if (!section) return;

    let existingBox = section.querySelector(".rectangle");
    if (existingBox) {
        existingBox.style.display = existingBox.style.display === "none" ? "block" : "none";
        return;
    }

    // 🏗️ Create Activity Logging Box
    let box = document.createElement("div");
    box.className = "rectangle dynamic-section";
    box.innerHTML = `
        <div class="input-container">
            <input type="text" id="activityInput" placeholder="Type your activity..." class="input-box">
            <button id="saveActivityBtn" class="save-btn">Save</button>
        </div>
        <ul id="activityList"></ul>
        <div class="resizer"></div>
    `;

    section.appendChild(box);
    section.style.display = "block";

    makeDraggable(box);
    makeResizable(box);
    loadActivities(); // 🏆 Load past activities

    // 🔥 Event Listeners for Saving Activities
    let inputField = document.getElementById("activityInput");
    let saveButton = document.getElementById("saveActivityBtn");

    // 🎯 Click Save Button to Save Activity
    saveButton.addEventListener("click", saveActivity);

    // ⏎ Pressing "Enter" Saves Activity
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Stops accidental form submission
            saveActivity();
        }
    });

    // 🚀 Auto-focus input for quick typing
    inputField.focus();
}

function saveActivity() {
    let input = document.getElementById("activityInput");
    if (!input) return;

    let activity = input.value.trim();
    if (activity === "") return;

    let carbonData = estimateCarbonOutput(activity);
    let activities = JSON.parse(localStorage.getItem("activities")) || [];

    activities.unshift({ 
        name: activity, 
        carbon: carbonData.carbon, 
        category: carbonData.category,
        date: new Date().toISOString() 
    });

    localStorage.setItem("activities", JSON.stringify(activities));

    input.value = "";
    loadActivities();
    updateTotalCarbon();
    updateClimateStreak();
    updateEcoScore(); // 🌟 Update Eco Score dynamically

    console.log("Activity saved:", activities);
}

// 📌 Ensure Save Button Works Even After UI Refresh
function toggleActivitiesRectangle(button) {
    let section = document.getElementById("activities-container");
    if (!section) return;

    let existingBox = section.querySelector(".rectangle");
    if (existingBox) {
        existingBox.style.display = existingBox.style.display === "none" ? "block" : "none";
        return;
    }

    // 🏗️ Rebuild UI for Activity Input
    let box = document.createElement("div");
    box.className = "rectangle dynamic-section";
    box.innerHTML = `
        <div class="input-container">
            <input type="text" id="activityInput" placeholder="Type your activity..." class="input-box">
            <button id="saveActivityBtn" class="save-btn">Save</button>
        </div>
        <ul id="activityList"></ul>
        <div class="resizer"></div>
    `;

    section.appendChild(box);
    section.style.display = "block";

    makeDraggable(box);
    makeResizable(box);
    loadActivities(); // 🏆 Load past activities

    // 🔥 Reattach Event Listener to Save Button
    document.getElementById("saveActivityBtn").addEventListener("click", saveActivity);
}

function toggleMetricsRectangle(button) {
    toggleSection("metrics-container", button, `
        <h3>Your Metrics</h3>
        <div class="metrics-container">
            <div class="small-rectangle metric-container">
                Total Carbon Output: <span id="totalCarbonMetric">0 kg CO₂</span>
                <div class="tooltip">This is the total amount of CO₂ emissions from your logged activities.</div>
            </div>
            <div class="small-rectangle metric-container">
                Climate action streak: <span id="climateStreakValue">0</span>
                <div class="tooltip">Your streak increases when you log eco-friendly activities daily.</div>
            </div>
            <div class="small-rectangle metric-container">
                Eco Score: <span id="ecoScore">N/A</span>
                <div class="tooltip">Eco Score is based on your carbon footprint. A higher score means more eco-friendly choices.</div>
            </div>
        </div>
    `);

    updateTotalCarbon();
    updateClimateStreak();
    updateEcoScore();

    // Add hover effect for all metric containers
    setTimeout(() => { // Delay ensures elements are fully created
        document.querySelectorAll(".metric-container").forEach(container => {
            let tooltip = container.querySelector(".tooltip");

            if (tooltip) {
                container.addEventListener("mouseenter", () => {
                    tooltip.style.opacity = "1";
                    tooltip.style.visibility = "visible";
                });

                container.addEventListener("mouseleave", () => {
                    tooltip.style.opacity = "0";
                    tooltip.style.visibility = "hidden";
                });
            }
        });
    }, 100); // Small timeout to allow the DOM to update
}

function updateEcoScore() {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    
    if (activities.length === 0) {
        document.getElementById("ecoScore").textContent = "100/100"; // Default
        return;
    }

    // Calculate total carbon emissions
    let totalCarbon = activities.reduce((sum, activity) => sum + parseFloat(activity.carbon || 0), 0);

    // Normalize Eco Score (each 1 kg CO₂ = -1 point)
    let ecoScore = Math.max(100 - (totalCarbon * 1), 0).toFixed(1);

    document.getElementById("ecoScore").textContent = `${ecoScore}/100`;
}

// 🌟 Ensure the streak updates on page load
document.addEventListener("DOMContentLoaded", function () {
    updateClimateStreak(); 
});

function updateClimateStreak() {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    let streakElement = document.getElementById("loggingStreak");
    
    if (!streakElement) return; // Prevent errors

    if (activities.length === 0) {
        streakElement.textContent = "Climate action streak: 0";
        localStorage.setItem("climateStreak", "0");
        return;
    }

    // 🗓️ Extract unique days when activities were logged
    let activityDates = activities.map(activity => {
        let date = new Date(activity.date);
        return date.toDateString(); // Normalize to avoid time mismatches
    });

    let uniqueDays = [...new Set(activityDates)]; // Remove duplicate days
    uniqueDays.sort((a, b) => new Date(b) - new Date(a)); // Sort descending

    // 🔄 Calculate Streak
    let streak = 1; // Start with 1 day
    for (let i = 0; i < uniqueDays.length - 1; i++) {
        let currentDate = new Date(uniqueDays[i]);
        let previousDate = new Date(uniqueDays[i + 1]);

        let diffInDays = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
        
        if (diffInDays === 1) {
            streak++; // Count consecutive day
        } else {
            break; // Streak broken
        }
    }

    // 🔥 Save and Update UI
    streakElement.textContent = `Climate action streak: ${streak}`;
    localStorage.setItem("climateStreak", streak.toString());
}


// 🔮 Function to Toggle "Magic Recommendations"
function toggleRecommendations(button) {
    let section = document.getElementById("recommendations-container");
    if (!section) return;

    let existingBox = section.querySelector(".rectangle");

    if (existingBox) {
        existingBox.style.display = existingBox.style.display === "none" ? "block" : "none";
        return;
    }

    let box = document.createElement("div");
    box.className = "rectangle dynamic-section";
    box.innerHTML = `
        <h3>Magic Recommendations</h3>
        <p>Based on your activities, here are some suggestions:</p>
        <ul id="recommendations-list"></ul>
        <div class="resizer"></div>
    `;

    section.appendChild(box);
    section.style.display = "block";

    makeDraggable(box);
    makeResizable(box);
    generateRecommendations(); // 🔥 Generate recommendations based on activity log
}

function generateRecommendations() {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    let recommendationsList = document.getElementById("recommendations-list");

    if (!recommendationsList) return;
    recommendationsList.innerHTML = ""; // Clear old recommendations

    // 🚨 If no activities logged, prompt user to log some
    if (activities.length === 0) {
        let listItem = document.createElement("li");
        listItem.textContent = "Log some activities to get personalized recommendations!";
        recommendationsList.appendChild(listItem);
        return;
    }

    // 🌱 Define High-Carbon Activity Recommendations
    const recommendationMap = {
        "driving": ["Try carpooling with a colleague or a friend!", "Use public transport for shorter trips.", "Consider biking or walking instead of driving."],
        "plane": ["Book flights with lower CO₂ emissions.", "Consider train travel for shorter distances.", "Try video conferencing instead of flying for business."],
        "meat consumption": ["Try a plant-based meal once a week!", "Reduce red meat intake to lower your carbon footprint.", "Buy locally sourced food to cut transportation emissions."],
        "laundry": ["Wash clothes in cold water to save energy.", "Air dry your clothes instead of using a dryer."],
        "plastic": ["Carry a reusable water bottle to reduce plastic waste.", "Avoid single-use plastics like bags and straws."],
        "electricity use": ["Unplug devices when not in use.", "Use LED bulbs to save energy.", "Switch to renewable energy sources if available."]
    };

    // 🔍 Find the **Highest Carbon Activities**
    let maxCarbon = Math.max(...activities.map(a => parseFloat(a.carbon) || 0)); // Find the highest carbon value

    if (maxCarbon === 0) {
        let listItem = document.createElement("li");
        listItem.textContent = "You're already making great eco-friendly choices!";
        recommendationsList.appendChild(listItem);
        return;
    }

    let highCarbonActivities = activities
        .filter(activity => parseFloat(activity.carbon) === maxCarbon) // Find all activities that match the highest CO₂ output
        .map(activity => activity.name.toLowerCase());

    // 📝 Provide a Recommendation Based on High Carbon Activities
    let recommendations = new Set(); // Use a Set to avoid duplicate suggestions

    for (let category in recommendationMap) {
        if (highCarbonActivities.some(activity => activity.includes(category))) {
            recommendationMap[category].forEach(rec => recommendations.add(rec)); // Add all suggestions
        }
    }

    // 🔥 Display Recommendations
    if (recommendations.size === 0) {
        recommendationsList.innerHTML = "<li>No specific recommendations found. Keep making eco-friendly choices!</li>";
    } else {
        recommendations.forEach(rec => {
            let listItem = document.createElement("li");
            listItem.textContent = rec;
            recommendationsList.appendChild(listItem);
        });
    }
}



// 🌍 Function to Toggle "Your World"
function toggleWorld(button) {
    let section = document.getElementById("world-container");
    if (!section) return;

    let existingBox = section.querySelector(".rectangle");

    if (existingBox) {
        existingBox.style.display = existingBox.style.display === "none" ? "block" : "none";
        return;
    }

    let box = document.createElement("div");
    box.className = "rectangle dynamic-section";
    box.innerHTML = `
        <h3>Your World</h3>
        <p>Visualize your environmental impact.</p>
        <button class="maximize-btn" onclick="window.location.href='3d-world.html'">Maximize</button>
        <div class="resizer"></div>
    `;

    section.appendChild(box);
    section.style.display = "block";

    makeDraggable(box);
    makeResizable(box);
}


// 🌱 AI Function to Estimate Carbon Output
// 🌱 AI-Enhanced Carbon Output Estimator
function estimateCarbonOutput(activity) {
    activity = activity.toLowerCase();

    // 🔹 Improved dataset with real-world carbon output estimates (kg CO₂ per activity)
    const carbonDatabase = [
        { keywords: ["driving", "car ride"], carbon: 2.5 },
        { keywords: ["bus ride", "public transport"], carbon: 0.5 },
        { keywords: ["plane", "flying", "airplane"], carbon: 90.0 },
        { keywords: ["train", "subway"], carbon: 0.2 },
        { keywords: ["walking", "bike", "cycling"], carbon: 0.0 },
        { keywords: ["meat", "beef", "burger"], carbon: 27.0 },
        { keywords: ["chicken", "pork"], carbon: 6.0 },
        { keywords: ["vegan", "plant-based"], carbon: -2.0 },
        { keywords: ["plastic use", "plastic bottle"], carbon: 2.0 },
        { keywords: ["recycling", "composting"], carbon: 0.0 },
        { keywords: ["laundry", "washing clothes"], carbon: 1.5 },
        { keywords: ["electricity", "power usage"], carbon: 1.0 },
        { keywords: ["solar energy", "renewable"], carbon: -5.0 },
        { keywords: ["turn off lights", "save energy"], carbon: 0.0 }
    ];

    // 🔍 Try to match the activity with the database
    for (let entry of carbonDatabase) {
        if (entry.keywords.some(keyword => activity.includes(keyword))) {
            return { carbon: entry.carbon, category: entry.carbon > 0 ? "high" : "low" };
        }
    }

    // 🧠 If no match is found, estimate based on GPT-style logic (fallback)
    return gptEstimateCarbon(activity);
}

// 🌍 Fallback AI-Based Estimation Using GPT-style Logic
function gptEstimateCarbon(activity) {
    if (activity.includes("miles") || activity.includes("km")) {
        let distance = parseFloat(activity.match(/\d+/)); // Extract number from text
        if (!isNaN(distance)) {
            if (activity.includes("car")) return { carbon: distance * 0.25, category: "high" };
            if (activity.includes("bike")) return { carbon: 0, category: "low" };
            if (activity.includes("plane")) return { carbon: distance * 0.5, category: "high" };
        }
    }

    // 🌿 Default "unknown" category (neutral)
    return { carbon: 1.0, category: "unknown" };
}


function updateClimateStreak() {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    let streakElement = document.getElementById("loggingStreak");
    
    if (!streakElement) return; // Prevent errors

    if (activities.length === 0) {
        streakElement.textContent = "Climate action streak: 0";
        localStorage.setItem("climateStreak", "0");
        return;
    }

    // 🗓️ Extract unique days when activities were logged
    let activityDates = activities.map(activity => {
        let date = new Date(activity.date);
        return date.toDateString(); // Normalize to avoid time mismatches
    });

    let uniqueDays = [...new Set(activityDates)]; // Remove duplicate days
    uniqueDays.sort((a, b) => new Date(b) - new Date(a)); // Sort descending

    // 🔄 Calculate Streak
    let streak = 1; // Start with 1 day
    for (let i = 0; i < uniqueDays.length - 1; i++) {
        let currentDate = new Date(uniqueDays[i]);
        let previousDate = new Date(uniqueDays[i + 1]);

        let diffInDays = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
        
        if (diffInDays === 1) {
            streak++; // Count consecutive day
        } else {
            break; // Streak broken
        }
    }

    // 🔥 Save and Update UI
    streakElement.textContent = `Climate action streak: ${streak}`;
    localStorage.setItem("climateStreak", streak.toString());
}

function loadActivities() {
    let activityList = document.getElementById("activityList");
    if (!activityList) return;

    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    activityList.innerHTML = ""; // Clear previous activities

    activities.forEach((activity, index) => {
        let listItem = document.createElement("li");

        let carbonValue = parseFloat(activity.carbon);
        let color = carbonValue > 0 ? "#D9534F" : "#3BB143"; // Red for emitting, green for neutral

        let carbonSquare = `
            <span class="carbon-square" style="background-color: ${color};">
                <input type="number" value="${carbonValue.toFixed(1)}" 
                    class="carbon-input" id="carbon-input-${index}" 
                    onchange="updateCarbon(${index}, this.value)">
                kg CO₂
            </span>`;

        listItem.innerHTML = `${carbonSquare} ${activity.name} 
            <button class="delete-btn" onclick="deleteActivity(${index})">❌</button>`;

        activityList.appendChild(listItem);
    });
}

function updateCarbon(index, newValue) {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];

    newValue = parseFloat(newValue);
    if (!isNaN(newValue) && newValue >= 0) {
        activities[index].carbon = newValue;
        localStorage.setItem("activities", JSON.stringify(activities));
        updateTotalCarbon();
        updateEcoScore(); // 🌟 Update Eco Score dynamically
        updateCarbonColor(index, newValue);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updateEcoScore(); 
});

function updateTotalCarbon() {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    
    // Ensure we're summing only valid numeric values
    let totalCarbon = activities.reduce((sum, activity) => {
        let carbonValue = parseFloat(activity.carbon); // Convert to a number
        return isNaN(carbonValue) ? sum : sum + carbonValue; // Ignore NaN values
    }, 0);

    let carbonMetric = document.getElementById("totalCarbonMetric");
    if (carbonMetric) {
        carbonMetric.textContent = `${totalCarbon.toFixed(1)} kg CO₂`;
    }
}

function updateCarbonColor(index, newValue) {
    let carbonSquare = document.getElementById(`carbon-input-${index}`).parentNode;
    let color = newValue > 0 ? "#D9534F" : "#3BB143"; // Red for high emissions, green for low/neutral
    carbonSquare.style.backgroundColor = color;
}

function deleteActivity(index) {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.splice(index, 1);
    localStorage.setItem("activities", JSON.stringify(activities));
    loadActivities();
    updateTotalCarbon();
    updateEcoScore(); // 🌟 Update Eco Score dynamically
}



// 🏆 Dragging Function
function makeDraggable(element) {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    element.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("resizer")) return;
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        element.style.position = "absolute";

        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", () => { 
            isDragging = false; 
            document.removeEventListener("mousemove", onDrag); 
        });
    });

    function onDrag(e) {
        if (!isDragging) return;
        element.style.left = `${e.clientX - offsetX}px`;
        element.style.top = `${e.clientY - offsetY}px`;
    }
}

// 🔧 Resizing Function
function makeResizable(element) {
    let resizer = element.querySelector(".resizer");
    if (!resizer) return;

    let isResizing = false;

    resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isResizing = true;

        document.addEventListener("mousemove", onResize);
        document.addEventListener("mouseup", () => { 
            isResizing = false; 
            document.removeEventListener("mousemove", onResize); 
        });
    });

    function onResize(e) {
        if (!isResizing) return;
        element.style.width = `${e.clientX - element.getBoundingClientRect().left}px`;
        element.style.height = `${e.clientY - element.getBoundingClientRect().top}px`;
    }
}
