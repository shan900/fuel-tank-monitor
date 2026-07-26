// ============================================================
//  SETTINGS
// ============================================================
let maxFuel = 0;
let availableFuel = 0;
let currentLang = "en";
let intervalTime = 2000; // 2 sec language switch

let carCount = 0;
let truckCount = 0;
let bikeCount = 0;
let busCount = 0;
let temperature = 0;

// ============================================================
//  DOM REFS (cached for performance)
// ============================================================
const $ = id => document.getElementById(id);

// Fuel card elements
const titleEl = $("title");
const labelTotalEl = $("labelTotal");
const totalValueEl = $("totalValue");
const labelAvailableEl = $("labelAvailable");
const availableValueEl = $("availableValue");
const progressBarEl = $("progressBar");
const statusEl = $("status");
const fuelPercentDisplay = $("fuelPercent");
const statusDotEl = $("statusDot");
const langBadgeEl = $("langBadge");

// Vehicle elements
const vehicleTitleEl = $("vehicleTitle");
const carLabelEl = $("carLabel");
const truckLabelEl = $("truckLabel");
const bikeLabelEl = $("bikeLabel");
const busLabelEl = $("busLabel");
const vehicleTotalLabelEl = $("vehicleTotalLabel");
const carCountEl = $("carCount");
const truckCountEl = $("truckCount");
const bikeCountEl = $("bikeCount");
const busCountEl = $("busCount");
const vehicleTotalEl = $("vehicleTotal");

// Temperature elements
const tempValueEl = $("temperatureValue");
const tempStatusEl = $("tempStatus");

// Stats elements
const totalFuelDisplay = $("totalFuelDisplay");
const availFuelDisplay = $("availFuelDisplay");
const fuelPercentDisplayStats = $("fuelPercentDisplay");
const tempDisplay = $("tempDisplay");
const tempStatusLabel = $("tempStatusLabel");
const fuelChange1 = $("fuelChange1");
const fuelChange2 = $("fuelChange2");

// Vehicle count display (dashboard)
const carCountDisplay = $("carCountDisplay");
const truckCountDisplay = $("truckCountDisplay");
const bikeCountDisplay = $("bikeCountDisplay");
const busCountDisplay = $("busCountDisplay");
const totalVehiclesDisplay = $("totalVehicles");
const actionTotalVehicles = $("actionTotalVehicles");
const activeAlertsDisplay = $("activeAlerts");
const totalRefillsDisplay = $("totalRefills");
const efficiencyDisplay = $("efficiency");

// Clock elements
const sidebarTime = $("sidebarTime");
const sidebarDate = $("sidebarDate");
const liveTime = $("liveTime");
const liveDate = $("liveDate");

// ============================================================
//  HELPERS
// ============================================================
function formatLiters(value) {
    return value.toLocaleString('en-US');
}

function formatBangla(value) {
    const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return value.toString().split('').map(d => banglaDigits[d] || d).join('');
}

function getPercent() {
    return maxFuel > 0 ? (availableFuel / maxFuel) * 100 : 0;
}

// ============================================================
//  UPDATE STATUS DOT
// ============================================================
function updateStatusDot(percent) {
    if (!statusDotEl) return;
    statusDotEl.className = 'status-dot';
    if (availableFuel <= 0 || percent < 5) {
        statusDotEl.classList.add('danger');
    } else if (percent < 25) {
        statusDotEl.classList.add('warning');
    }
}

// ============================================================
//  UPDATE TEMP STATUS
// ============================================================
function updateTempStatus(temp) {
    if (tempStatusEl) {
        if (temp >= 35) {
            tempStatusEl.textContent = 'Critical';
            tempStatusEl.style.color = '#f87171';
        } else if (temp >= 30) {
            tempStatusEl.textContent = 'Warming';
            tempStatusEl.style.color = '#fbbf24';
        } else {
            tempStatusEl.textContent = 'Normal';
            tempStatusEl.style.color = 'rgba(255,255,255,0.2)';
        }
    }
}

// ============================================================
//  UPDATE VEHICLE DISPLAY
// ============================================================
function updateVehicleDisplay() {
    const totalVehicle = carCount + truckCount + bikeCount + busCount;
    const isBn = currentLang === "bn";

    // Left panel vehicle counts
    if (carCountEl) carCountEl.innerText = isBn ? formatBangla(carCount) : carCount;
    if (truckCountEl) truckCountEl.innerText = isBn ? formatBangla(truckCount) : truckCount;
    if (bikeCountEl) bikeCountEl.innerText = isBn ? formatBangla(bikeCount) : bikeCount;
    if (busCountEl) busCountEl.innerText = isBn ? formatBangla(busCount) : busCount;
    if (vehicleTotalEl) vehicleTotalEl.innerText = isBn ? formatBangla(totalVehicle) : totalVehicle;

    // Dashboard vehicle counts
    if (carCountDisplay) carCountDisplay.textContent = carCount;
    if (truckCountDisplay) truckCountDisplay.textContent = truckCount;
    if (bikeCountDisplay) bikeCountDisplay.textContent = bikeCount;
    if (busCountDisplay) busCountDisplay.textContent = busCount;
    if (totalVehiclesDisplay) totalVehiclesDisplay.textContent = totalVehicle;
    if (actionTotalVehicles) actionTotalVehicles.textContent = totalVehicle;
}

// ============================================================
//  TRANSLATE & UPDATE UI
// ============================================================
function translateUI() {
    const percent = getPercent();
    const isBn = currentLang === "bn";

    // Update language badge
    if (langBadgeEl) langBadgeEl.textContent = isBn ? 'বাংলা' : 'EN';

    // Remove red classes
    if (titleEl) titleEl.classList.remove("red-text");
    if (statusEl) statusEl.classList.remove("red-text");

    // ----- FUEL EMPTY STATE -----
    if (availableFuel <= 0) {
        if (titleEl) {
            titleEl.innerText = isBn ? "তেল শেষ" : "Fuel Empty";
            titleEl.classList.add("red-text");
        }

        if (labelTotalEl) labelTotalEl.innerText = "";
        if (totalValueEl) totalValueEl.innerText = "";
        if (labelAvailableEl) {
            labelAvailableEl.innerText = isBn ? "সাময়িক বন্ধ" : "Temporarily Shut Down";
        }
        if (availableValueEl) availableValueEl.innerText = "";

        if (progressBarEl) progressBarEl.style.width = "0%";
        if (fuelPercentDisplay) fuelPercentDisplay.textContent = "0%";

        if (statusEl) {
            statusEl.innerText = isBn ? "⛔ তেল শেষ" : "⛔ FUEL EMPTY";
            statusEl.classList.add("red-text");
        }

        if (statusDotEl) statusDotEl.className = 'status-dot danger';

        // Vehicle labels
        if (vehicleTitleEl) vehicleTitleEl.innerText = isBn ? "গাড়ির বিবরণ" : "Vehicle Details";
        if (carLabelEl) carLabelEl.innerText = isBn ? "কার" : "Car";
        if (truckLabelEl) truckLabelEl.innerText = isBn ? "ট্রাক" : "Truck";
        if (bikeLabelEl) bikeLabelEl.innerText = isBn ? "বাইক" : "Bike";
        if (busLabelEl) busLabelEl.innerText = isBn ? "বাস" : "Bus";
        if (vehicleTotalLabelEl) vehicleTotalLabelEl.innerText = isBn ? "মোট" : "Total";

        updateVehicleDisplay();
        return;
    }

    // ----- NORMAL STATE -----
    if (!isBn) {
        // Fuel card
        if (titleEl) titleEl.innerText = "Fuel Monitor";
        if (labelTotalEl) labelTotalEl.innerText = "Total Fuel";
        if (totalValueEl) totalValueEl.innerHTML = formatLiters(maxFuel) + ' <small>L</small>';
        if (labelAvailableEl) labelAvailableEl.innerText = "Available";
        if (availableValueEl) availableValueEl.innerHTML = formatLiters(availableFuel) + ' <small>L</small>';
        if (statusEl) {
            statusEl.innerText = "● System Running";
            statusEl.classList.remove("red-text");
        }

        // Vehicle labels
        if (vehicleTitleEl) vehicleTitleEl.innerText = "Vehicle Details";
        if (carLabelEl) carLabelEl.innerText = "Car";
        if (truckLabelEl) truckLabelEl.innerText = "Truck";
        if (bikeLabelEl) bikeLabelEl.innerText = "Bike";
        if (busLabelEl) busLabelEl.innerText = "Bus";
        if (vehicleTotalLabelEl) vehicleTotalLabelEl.innerText = "Total";

        // Stats
        if (totalFuelDisplay) totalFuelDisplay.innerHTML = formatLiters(maxFuel) + ' <small>L</small>';
        if (availFuelDisplay) availFuelDisplay.innerHTML = formatLiters(availableFuel) + ' <small>L</small>';
        if (fuelPercentDisplayStats) fuelPercentDisplayStats.innerHTML = Math.round(percent) + ' <small>%</small>';
    } else {
        // Fuel card - Bangla
        if (titleEl) titleEl.innerText = "জ্বালানি মনিটর";
        if (labelTotalEl) labelTotalEl.innerText = "মোট জ্বালানি";
        if (totalValueEl) totalValueEl.innerHTML = formatBangla(maxFuel) + ' <small>লি.</small>';
        if (labelAvailableEl) labelAvailableEl.innerText = "বর্তমান";
        if (availableValueEl) availableValueEl.innerHTML = formatBangla(availableFuel) + ' <small>লি.</small>';
        if (statusEl) {
            statusEl.innerText = "● সিস্টেম চালু";
            statusEl.classList.remove("red-text");
        }

        // Vehicle labels - Bangla
        if (vehicleTitleEl) vehicleTitleEl.innerText = "গাড়ির বিবরণ";
        if (carLabelEl) carLabelEl.innerText = "কার";
        if (truckLabelEl) truckLabelEl.innerText = "ট্রাক";
        if (bikeLabelEl) bikeLabelEl.innerText = "বাইক";
        if (busLabelEl) busLabelEl.innerText = "বাস";
        if (vehicleTotalLabelEl) vehicleTotalLabelEl.innerText = "মোট";

        // Stats - Bangla
        if (totalFuelDisplay) totalFuelDisplay.innerHTML = formatBangla(maxFuel) + ' <small>লি.</small>';
        if (availFuelDisplay) availFuelDisplay.innerHTML = formatBangla(availableFuel) + ' <small>লি.</small>';
        if (fuelPercentDisplayStats) fuelPercentDisplayStats.innerHTML = formatBangla(Math.round(percent)) + ' <small>%</small>';
    }

    // Progress bar
    const clampedPercent = Math.min(100, Math.max(0, percent));
    if (progressBarEl) {
        progressBarEl.style.width = clampedPercent + "%";
        progressBarEl.className = "fill";
        if (clampedPercent < 20) progressBarEl.classList.add("low");
        else if (clampedPercent < 50) progressBarEl.classList.add("medium");
        else progressBarEl.classList.add("high");
    }
    if (fuelPercentDisplay) fuelPercentDisplay.textContent = Math.round(clampedPercent) + "%";

    updateStatusDot(clampedPercent);
    updateVehicleDisplay();
}

// ============================================================
//  UPDATE CLOCK
// ============================================================
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dateShort = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

    if (liveTime) liveTime.textContent = timeStr;
    if (liveDate) liveDate.textContent = dateStr;
    if (sidebarTime) sidebarTime.textContent = timeStr;
    if (sidebarDate) sidebarDate.textContent = dateShort;
}

// ============================================================
//  UPDATE TEMPERATURE DISPLAY
// ============================================================
function updateTemperatureDisplay() {
    if (tempValueEl) {
        tempValueEl.innerText = temperature.toFixed(1) + "°C";
        tempValueEl.className = "temperature-value";
        if (temperature >= 35) {
            tempValueEl.classList.add("temp-danger");
        } else if (temperature >= 30) {
            tempValueEl.classList.add("temp-warning");
        } else {
            tempValueEl.classList.add("temp-normal");
        }
        updateTempStatus(temperature);
    }

    if (tempDisplay) {
        tempDisplay.innerHTML = temperature.toFixed(1) + ' <small>°C</small>';
    }

    if (tempStatusLabel) {
        if (temperature >= 35) {
            tempStatusLabel.textContent = 'CRITICAL';
            tempStatusLabel.style.color = '#f87171';
            tempStatusLabel.className = 'stat-change negative';
        } else if (temperature >= 30) {
            tempStatusLabel.textContent = 'WARMING';
            tempStatusLabel.style.color = '#fbbf24';
            tempStatusLabel.className = 'stat-change neutral';
        } else {
            tempStatusLabel.textContent = 'NORMAL';
            tempStatusLabel.style.color = '#34d399';
            tempStatusLabel.className = 'stat-change positive';
        }
    }
}

// ============================================================
//  UPDATE TREND BARS
// ============================================================
function updateTrendBars(percent) {
    const trendBars = document.querySelectorAll('.trend-bar');
    if (trendBars.length >= 5) {
        const values = [
            Math.min(100, percent),
            Math.min(100, percent * 0.75),
            Math.min(100, percent * 0.5),
            Math.min(100, percent * 0.25),
            0
        ];
        trendBars.forEach((bar, i) => {
            bar.style.width = values[i] + '%';
            const item = bar.closest('.trend-item');
            if (item) {
                const valSpan = item.querySelector('.trend-value');
                if (valSpan) valSpan.textContent = Math.round(values[i]) + '%';
            }
        });
    }
}

// ============================================================
//  FETCH DATA
// ============================================================
function fetchFuelData() {

    Promise.all([
        fetch("/get_fuel").then(res => res.json()),
        fetch("/vehicle_stats").then(res => res.json())
    ])
    .then(([fuel, vehicle]) => {

        console.log(fuel);
        console.log(vehicle);

        maxFuel = parseInt(fuel.total_fuel) || 0;
        availableFuel = parseInt(fuel.available_fuel) || 0;
        temperature = parseFloat(fuel.temperature) || 0;

        carCount = vehicle.Car || 0;
        truckCount = vehicle.Truck || 0;
        bikeCount = vehicle.Bike || 0;
        busCount = vehicle.Bus || 0;

        updateTemperatureDisplay();

        const percent = maxFuel > 0
            ? (availableFuel / maxFuel) * 100
            : 0;

        updateTrendBars(percent);
        translateUI();
        updateClock();

    })
    .catch(err => {
        console.error("Fetch Error:", err);
    });

}
// ============================================================
//  AUTO LANGUAGE SWITCH
// ============================================================
setInterval(() => {
    currentLang = currentLang === "en" ? "bn" : "en";
    translateUI();
}, intervalTime);

// ============================================================
//  INIT
// ============================================================
fetchFuelData();
setInterval(fetchFuelData, 3000);
setInterval(updateClock, 1000);
