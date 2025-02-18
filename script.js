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

// 🔮 AI-Powered Function to Generate Smart Recommendations
function generateRecommendations() {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    let recommendationsList = document.getElementById("recommendations-list");

    if (!recommendationsList) return;

    recommendationsList.innerHTML = ""; // Clear old recommendations

    // 🚨 If fewer than 3 activities, prompt user to log more
    if (activities.length < 3) {
        let listItem = document.createElement("li");
        listItem.textContent = "Log more activities before generating recommendations!";
        recommendationsList.appendChild(listItem);
        return; // Stop function if not enough data
    }

    // 🌱 Eco-Friendly Tips Based on High-Carbon Activities
    const recommendationMap = {
        "driving": "Consider biking, walking, or using public transport to reduce emissions.",
        "plane": "Flying produces high CO₂—try train or carpooling for shorter trips!",
        "meat": "Try swapping meat for plant-based alternatives to lower your carbon footprint.",
        "laundry": "Wash clothes in cold water and air dry to save energy!",
        "plastic": "Reduce plastic use by carrying a reusable water bottle and bags.",
        "electricity": "Use LED bulbs and turn off appliances when not in use to save energy."
    };

    // 🔍 Find the Activity with the Highest Carbon Output
    let highestCarbonActivity = null;
    let highestCarbonValue = 0;

    activities.forEach(activity => {
        let carbonValue = parseFloat(activity.carbon);
        if (carbonValue > highestCarbonValue) {
            highestCarbonValue = carbonValue;
            highestCarbonActivity = activity.name.toLowerCase(); // Store lowercase activity name
        }
    });

    // 🚦 If all logged activities have `0 kg CO₂` or lower, display eco-friendly message
    if (highestCarbonValue === 0) {
        let listItem = document.createElement("li");
        listItem.textContent = "You're already making great eco-friendly choices!";
        recommendationsList.appendChild(listItem);
        return;
    }

    // 📝 Provide a Recommendation Based on the Highest Carbon Activity
    let recommendation = "Consider making small changes to reduce your carbon footprint!";
    
    for (const key in recommendationMap) {
        if (highestCarbonActivity.includes(key)) {
            recommendation = recommendationMap[key];
            break;
        }
    }

    let listItem = document.createElement("li");
    listItem.textContent = recommendation;
    recommendationsList.appendChild(listItem);
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

// 🔄 Function to Load Activities and Assign Proper Carbon Colors
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
            <span class="carbon-square" id="carbon-square-${index}" style="background-color: ${color};">
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


// ✏️ Allow Users to Manually Adjust Carbon Output
function updateCarbon(index, newValue) {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];

    newValue = parseFloat(newValue);
    if (!isNaN(newValue)) {
        activities[index].carbon = newValue;
        localStorage.setItem("activities", JSON.stringify(activities));
        updateTotalCarbon(); // 🔥 Update total carbon output
        updateCarbonColor(index, newValue); // 🔥 Update color of the square
    }
}



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
