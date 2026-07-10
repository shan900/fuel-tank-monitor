// SETTINGS
let maxFuel = 0;
let availableFuel = 0;
let currentLang = "en";
let intervalTime = 2000; // 2 sec language switch

// VEHICLE COUNT SETTINGS
let carCount = 0;
let truckCount = 0;
let bikeCount = 0;
let busCount = 0;

// TRANSLATE & UPDATE UI
function translateUI() {
    let percent = maxFuel > 0 ? (availableFuel / maxFuel) * 100 : 0;

    const titleEl = document.getElementById("title");
    const labelTotalEl = document.getElementById("labelTotal");
    const totalValueEl = document.getElementById("totalValue");
    const labelAvailableEl = document.getElementById("labelAvailable");
    const availableValueEl = document.getElementById("availableValue");
    const progressBarEl = document.getElementById("progressBar");
    const statusEl = document.getElementById("status");

    const vehicleTitleEl = document.getElementById("vehicleTitle");
    const carLabelEl = document.getElementById("carLabel");
    const truckLabelEl = document.getElementById("truckLabel");
    const bikeLabelEl = document.getElementById("bikeLabel");
    const busLabelEl = document.getElementById("busLabel");
    const vehicleTotalLabelEl = document.getElementById("vehicleTotalLabel");

    // Reset red classes
    titleEl.classList.remove("red-text");
    statusEl.classList.remove("red-text");

    // Show warning if Available Fuel is zero
    if (availableFuel <= 0) {

        titleEl.innerText = currentLang === "en"
            ? "Fuel Empty"
            : "তেল শেষ";

        titleEl.classList.add("red-text");

        labelTotalEl.innerText = "";
        totalValueEl.innerText = "";

        labelAvailableEl.innerText = currentLang === "en"
            ? "Temporarily Shut Down"
            : "সাময়িক ভাবে বন্ধ আছে";

        availableValueEl.innerText = "";

        progressBarEl.style.width = "0%";

        statusEl.innerText = currentLang === "en"
            ? "FUEL EMPTY"
            : "তেল শেষ";

        statusEl.classList.add("red-text");

        updateVehicleLanguage();
        updateVehicleDisplay();

        return;
    }

    if (currentLang === "en") {
        titleEl.innerText = "Fuel Tank Monitor";
        labelTotalEl.innerText = "Total Fuel";
        totalValueEl.innerText = formatLiters(maxFuel) + " L";

        labelAvailableEl.innerText = "Available Fuel";
        availableValueEl.innerText = formatLiters(availableFuel) + " L";

        statusEl.innerText = "System Running...";

        vehicleTitleEl.innerText = "Vehicle Details";
        carLabelEl.innerText = "Car";
        truckLabelEl.innerText = "Truck";
        bikeLabelEl.innerText = "Bike";
        busLabelEl.innerText = "Bus";
        vehicleTotalLabelEl.innerText = "Total";
    } else {
        titleEl.innerText = "জ্বালানি ট্যাংক মনিটর";
        labelTotalEl.innerText = "মোট জ্বালানি";
        totalValueEl.innerText = formatBangla(maxFuel) + " লিটার";

        labelAvailableEl.innerText = "বর্তমান জ্বালানি";
        availableValueEl.innerText = formatBangla(availableFuel) + " লিটার";

        statusEl.innerText = "সিস্টেম চালু আছে...";

        vehicleTitleEl.innerText = "গাড়ির বিবরণ";
        carLabelEl.innerText = "কার";
        truckLabelEl.innerText = "ট্রাক";
        bikeLabelEl.innerText = "বাইক";
        busLabelEl.innerText = "বাস";
        vehicleTotalLabelEl.innerText = "মোট";
    }

    progressBarEl.style.width = percent + "%";

    updateVehicleDisplay();
}

// UPDATE VEHICLE LANGUAGE WHEN FUEL EMPTY
function updateVehicleLanguage() {
    if (currentLang === "en") {
        document.getElementById("vehicleTitle").innerText = "Vehicle Details";
        document.getElementById("carLabel").innerText = "Car";
        document.getElementById("truckLabel").innerText = "Truck";
        document.getElementById("bikeLabel").innerText = "Bike";
        document.getElementById("busLabel").innerText = "Bus";
        document.getElementById("vehicleTotalLabel").innerText = "Total";
    } else {
        document.getElementById("vehicleTitle").innerText = "গাড়ির বিবরণ";
        document.getElementById("carLabel").innerText = "কার";
        document.getElementById("truckLabel").innerText = "ট্রাক";
        document.getElementById("bikeLabel").innerText = "বাইক";
        document.getElementById("busLabel").innerText = "বাস";
        document.getElementById("vehicleTotalLabel").innerText = "মোট";
    }
}

// UPDATE VEHICLE DISPLAY
function updateVehicleDisplay() {
    let totalVehicle = carCount + truckCount + bikeCount + busCount;

    if (currentLang === "en") {
        document.getElementById("carCount").innerText = carCount;
        document.getElementById("truckCount").innerText = truckCount;
        document.getElementById("bikeCount").innerText = bikeCount;
        document.getElementById("busCount").innerText = busCount;
        document.getElementById("vehicleTotal").innerText = totalVehicle;
    } else {
        document.getElementById("carCount").innerText = formatBangla(carCount);
        document.getElementById("truckCount").innerText = formatBangla(truckCount);
        document.getElementById("bikeCount").innerText = formatBangla(bikeCount);
        document.getElementById("busCount").innerText = formatBangla(busCount);
        document.getElementById("vehicleTotal").innerText = formatBangla(totalVehicle);
    }
}

// FORMAT NUMBERS
function formatLiters(value) {
    return value.toLocaleString('en-US');
}

function formatBangla(value) {
    const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return value.toString().split('').map(d => banglaDigits[d] || d).join('');
}

// AUTO LANGUAGE SWITCH EVERY 2 SEC
setInterval(() => {
    currentLang = currentLang === "en" ? "bn" : "en";
    translateUI();
}, intervalTime);

// FETCH DATA EVERY 3 SEC
function fetchFuelData() {
    fetch("get_data.php?t=" + new Date().getTime())
        .then(res => res.json())
        .then(data => {
            console.log("Fetched data:", data);

            if (data.total_fuel !== undefined && data.available_fuel !== undefined) {
                maxFuel = parseInt(data.total_fuel);
                availableFuel = parseInt(data.available_fuel);
            }

            if (data.car_count !== undefined) {
                carCount = parseInt(data.car_count);
            }

            if (data.truck_count !== undefined) {
                truckCount = parseInt(data.truck_count);
            }

            if (data.bike_count !== undefined) {
                bikeCount = parseInt(data.bike_count);
            }

            if (data.bus_count !== undefined) {
                busCount = parseInt(data.bus_count);
            }

            translateUI();
        })
        .catch(err => console.log("Error fetching data:", err));
}

// INITIAL LOAD
fetchFuelData();
setInterval(fetchFuelData, 3000);
