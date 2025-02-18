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

    let box = document.createElement("div");
    box.className = "rectangle dynamic-section";
    box.innerHTML = `
        <div class="input-container">
            <input type="text" id="activityInput" placeholder="Type your activity..." class="input-box">
            <button onclick="saveActivity()" class="save-btn">Save</button>
        </div>
        <ul id="activityList"></ul>
        <div class="resizer"></div>
    `;

    section.appendChild(box);
    section.style.display = "block";

    makeDraggable(box);
    makeResizable(box);
    loadActivities(); // Ensure activities are loaded into the UI
}


// 📊 Function to Toggle the Metrics Rectangle
function toggleMetricsRectangle(button) {
    toggleSection("metrics-container", button, `
        <h3>Your Metrics</h3>
        <div class="metrics-container">
            <div class="small-rectangle">Total Carbon Output: <span id="totalCarbonMetric">0 kg CO₂</span></div>
            <div class="small-rectangle" id="loggingStreak">Climate action streak: 0</div>
            <div class="small-rectangle">Diet Score: <span id="dietScore">N/A</span></div>
        </div>
    `);
    updateTotalCarbon(); // Update total carbon when the metrics box is opened
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

// 🔮 AI-Powered Function to Generate Recommendations
function generateRecommendations() {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    let recommendationsList = document.getElementById("recommendations-list");

    if (!recommendationsList) return;

    recommendationsList.innerHTML = ""; // Clear old recommendations

    let ecoFriendlyTips = [
        "Try using public transportation instead of driving.",
        "Switch to reusable water bottles and avoid plastic waste.",
        "Consider a plant-based meal to reduce your carbon footprint.",
        "Turn off lights when leaving a room to save energy.",
        "Unplug electronics when not in use to save electricity.",
        "Compost food waste to reduce landfill contributions.",
        "Support local and sustainable food sources.",
        "Switch to renewable energy sources like solar power."
    ];

    let highEmissionActivityFound = false;

    activities.forEach(activity => {
        if (activity.category === "high") {
            highEmissionActivityFound = true;
        }
    });

    if (highEmissionActivityFound) {
        let suggestion = ecoFriendlyTips[Math.floor(Math.random() * ecoFriendlyTips.length)];
        let listItem = document.createElement("li");
        listItem.textContent = suggestion;
        recommendationsList.appendChild(listItem);
    } else {
        let listItem = document.createElement("li");
        listItem.textContent = "You're already making great eco-friendly choices!";
        recommendationsList.appendChild(listItem);
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
function estimateCarbonOutput(activity) {
    activity = activity.toLowerCase();

    const highEmissionActivities = {
        "driving": 2.5, 
        "car ride": 2.5,
        "plane": 90.0,
        "flying": 90.0,
        "meat": 5.0,
        "beef": 27.0,
        "pork": 12.0,
        "chicken": 6.0,
        "plastic": 2.0,
        "electricity": 1.5,
        "laundry": 1.0
    };

    const lowEmissionActivities = {
        "recycling": 0.0,
        "composting": 0.0,
        "bike": 0.0,
        "walking": 0.0,
        "turn off lights": 0.0,
        "solar energy": 0.0,
        "planting": -5.0,
        "vegan": -2.0
    };

    for (const key in highEmissionActivities) {
        if (activity.includes(key)) {
            return { carbon: highEmissionActivities[key], category: "high" };
        }
    }

    for (const key in lowEmissionActivities) {
        if (activity.includes(key)) {
            return { carbon: lowEmissionActivities[key], category: "low" };
        }
    }

    return { carbon: 1.0, category: "unknown" }; // Default to 1 kg CO₂ if no match
}

// 📝 Function to Save Activities and Update Carbon Output
function saveActivity() {
    let input = document.getElementById("activityInput");
    let activity = input.value.trim();

    if (activity === "") return; // Ignore empty input

    let carbonData = estimateCarbonOutput(activity);
    let activities = JSON.parse(localStorage.getItem("activities")) || [];

    activities.unshift({ name: activity, carbon: carbonData.carbon, category: carbonData.category });
    localStorage.setItem("activities", JSON.stringify(activities));

    input.value = ""; // Clear input field
    loadActivities(); // Reload activities list
    updateTotalCarbon(); // 🔥 Update carbon total immediately
}

// 🔹 Function to Load Activities with Carbon Display
function loadActivities() {
    let activityList = document.getElementById("activityList");
    if (!activityList) return;

    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    activityList.innerHTML = "";

    activities.forEach((activity, index) => {
        let listItem = document.createElement("li");

        let color = activity.category === "high" ? "#D9534F" : "#3BB143";
        let carbonSquare = `<span class="carbon-square" style="background-color: ${color};">${activity.carbon.toFixed(1)} kg CO₂</span>`;

        listItem.innerHTML = `${carbonSquare} ${activity.name} 
            <button class="delete-btn" onclick="deleteActivity(${index})">❌</button>`;

        activityList.appendChild(listItem);
    });
}

// 🔄 Function to Update Total Carbon Output in Metrics
// 🔄 Function to Update Total Carbon Output in Metrics
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

// ❌ Function to Delete Activity and Update Carbon Output
function deleteActivity(index) {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.splice(index, 1);
    localStorage.setItem("activities", JSON.stringify(activities));
    loadActivities(); // Reload activities list
    updateTotalCarbon(); // 🔥 Update carbon total immediately
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
