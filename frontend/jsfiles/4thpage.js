// Global variables
const userData = JSON.parse(localStorage.getItem("userData"));
let newDataUser;

// Function to fetch user data

function getInfoPage() {
  window.open("../htmlPages/5thshowinfo.html")
}
async function getUserData() {
  try {
    const userName = userData.name;

    try {
      const response = await fetch(
        `http://localhost:8000/api/userByName?name=${userName}`
      );

      if (response.ok) {
        let userData = await response.json();
        newDataUser = userData;
        console.log("User Data:", userData);
      } else {
        console.error("Error fetching user data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Display user information in the navigation and dashboard
if (userData) {
  const navUser = document.getElementById("userName");
  navUser.innerHTML = ` <p> Welcome, ${userData.name}</p>`;

  const userDataDisplay = document.getElementById("userDataDisplay");
  userDataDisplay.innerHTML = `
    <p>Name: ${userData.name}</p>
    <p>Email: ${userData.email}</p>
    <p>Phone: ${userData.phone}</p>
    <!-- Add more fields as needed -->
  `;
} else {
  console.error("User data not found in localStorage");
}

// Execute code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Placeholder data for financial and crop health information
  const financialData = {
    totalRevenue: 15000,
    totalExpenses: 5000,
    netIncome: 10000,
  };

  const cropHealthData = {
    cropStatus: "Good",
    healthRecommendations: "Continue regular watering and monitor for pests.",
  };

  // Display weather information
  document.getElementById("temperature").textContent = weatherData.temperature;
  document.getElementById("humidity").textContent = weatherData.humidity;
  document.getElementById("precipitation").textContent =
    weatherData.precipitation;

  // Display financial information
  document.getElementById("total-revenue").textContent =
    financialData.totalRevenue;
  document.getElementById("total-expenses").textContent =
    financialData.totalExpenses;
  document.getElementById("net-income").textContent = financialData.netIncome;

  // Display crop health information
  document.getElementById("crop-status").textContent =
    cropHealthData.cropStatus;
  document.getElementById("health-recommendations").textContent =
    cropHealthData.healthRecommendations;
});

document.addEventListener("DOMContentLoaded", () => {
  // Placeholder data for summary, crop list, and marketplace
  const summaryData = {
    cultivatedArea: "100 acres",
    totalCrops: 5,
    estimatedIncome: 10000,
  };

  const cropListData = [
    {
      name: "Wheat",
      plantedDate: "2023-01-01",
      harvestDate: "2023-05-01",
      yield: 2000,
    },
    {
      name: "Corn",
      plantedDate: "2023-02-15",
      harvestDate: "2023-08-15",
      yield: 3000,
    },
  ];

  const marketplaceData = [
    { cropName: "Wheat", intentToSell: true, market: "Local Market A" },
    { cropName: "Corn", intentToSell: false, market: "Local Market B" },
  ];

  // Display summary information
  document.getElementById("cultivated-area").textContent =
    summaryData.cultivatedArea;
  document.getElementById("total-crops").textContent = summaryData.totalCrops;
  document.getElementById("estimated-income").textContent =
    summaryData.estimatedIncome;

  // Display crop list
  const cropListElement = document.getElementById("crop-list");
  if (newDataUser && newDataUser.crops && newDataUser.crops.length > 0) {
    newDataUser.crops.forEach((crop) => {
      const listItem = document.createElement("li");
      listItem.className = "crop-list-item";
      listItem.innerHTML = `
        <strong>${crop.cropName}</strong><br>
        Planting Date: ${crop.plantingDate}<br>
        Harvest Date: ${crop.harvestDate}<br>
        Estimated Yield: ${crop.estimatedYield} kg
      `;
      cropListElement.appendChild(listItem);
    });
  } else {
    const noCropMessage = document.createElement("p");
    noCropMessage.textContent =
      'No crops available. Start by adding crops using the "Add Crop" button.';
    cropListElement.appendChild(noCropMessage);
  }

  // Display marketplace information
  const marketplaceListElement = document.getElementById("marketplace-list");
  marketplaceData.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.cropName} - ${
      entry.intentToSell ? "Available for sale" : "Not available for sale"
    } at ${entry.market}`;
    marketplaceListElement.appendChild(listItem);
  });
});

// Open the modal for adding a new crop
function openAddCropModal() {
  document.getElementById("addCropModal").style.display = "block";
}

// Close the modal for adding a new crop
function closeAddCropModal() {
  document.getElementById("addCropModal").style.display = "none";
  window.location.reload();
}

// Fetch weather information from a third-party API
(async () => {
  const url =
    "https://weatherapi-com.p.rapidapi.com/current.json?q=Tumkur&lat=13.34&lon=77.1";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "84c94dd0d6msheae7948b6ede92ep17df21jsn9cfe3063a5fd",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      const result = await response.json();
      updateWeatherInfo(result);
    } else {
      console.error("Failed to fetch weather data. Status: " + response.status);
    }
  } catch (error) {
    console.error(error);
  }
})();

// Update weather information in the UI
function updateWeatherInfo(result) {
  if (result.current) {
    const temperature = result.current.temp_c;
    const humidity = result.current.humidity;
    const precipitation = result.current.precip_mm;
    const temperatureElement = document.getElementById("temperature");
    const humidityElement = document.getElementById("humidity");
    const precipitationElement = document.getElementById("precipitation");

    temperatureElement.textContent = `Temperature: ${temperature} °C`;
    humidityElement.textContent = `Humidity: ${humidity}%`;
    precipitationElement.textContent = `Precipitation: ${precipitation} mm`;
  }
}

// Event listener for adding a new crop
document
  .getElementById("addCropForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const cropName = document.getElementById("CROP").value;
    const plantingDate = document.getElementById("plantingDate").value;
    const harvestDate = document.getElementById("harvestDate").value;
    const estimatedYield = document.getElementById("estimatedYield").value;

    const userName = userData.name;

    const cropData = {
      cropName,
      plantingDate,
      harvestDate,
      estimatedYield,
    };

    try {
      const response = await fetch("http://localhost:8000/api/addCrop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          crop: cropData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        console.error("Failed to add crop. Status: " + response.status);
      }
    } catch (error) {
      console.error("Error adding crop:", error);
    }

    closeAddCropModal();
  });

// Function to update crop management section
function updateCropManagement(crops) {
  const cropListElement = document.getElementById("crop-list");

  cropListElement.innerHTML = "";

  if (crops.length > 0) {
    crops.forEach((crop) => {
      const listItem = document.createElement("li");
      listItem.className = "crop-list-item";

      listItem.innerHTML = `
        <strong>${crop.cropName}</strong><br>
        Planting Date: ${crop.plantingDate}<br>
        Harvest Date: ${crop.harvestDate}<br>
        Estimated Yield: ${crop.estimatedYield} kg
      `;

      cropListElement.appendChild(listItem);
    });
  } else {
    const noCropMessage = document.createElement("p");
    noCropMessage.textContent =
      'No crops available. Start by adding crops using the "Add Crop" button.';
    cropListElement.appendChild(noCropMessage);
  }
}

// Call updateCropManagement with the correct data
updateCropManagement(newDataUser.crops);

// ... (remaining code)

if (userData) {
  const navUser = document.getElementById("userName");
  navUser.innerHTML = ` <p> Welcome, ${userData.name}</p>`;

  const userDataDisplay = document.getElementById("userDataDisplay");
  userDataDisplay.innerHTML = `
    <p>Name: ${userData.name}</p>
    <p>Email: ${userData.email}</p>
    <p>Phone: ${userData.phone}</p>
    <!-- Add more fields as needed -->
  `;

  // Add the following code
  const userGreeting = document.getElementById("userNameNav");
  userGreeting.textContent = userData.name;
} else {
  console.error("User data not found in localStorage");
}
