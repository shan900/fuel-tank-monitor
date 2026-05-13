// SETTINGS
let maxFuel = 0;
let availableFuel = 0;
let currentLang = "en";
let intervalTime = 5000;

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

    titleEl.classList.remove("red-text");

    if (availableFuel <= 0) {
        titleEl.innerText = currentLang === "en" ? "Fuel Empty" : "তেল শেষ";
        titleEl.classList.add("red-text");

        labelTotalEl.innerText = "";
        totalValueEl.innerText = "";
        labelAvailableEl.innerText = currentLang === "en" ? "Temporarily Shut Down" : "সাময়িক ভাবে বন্ধ আছে";
        availableValueEl.innerText = "";
        progressBarEl.style.width = "0%";
        statusEl.innerText = "";
        return;
    }

    if (currentLang === "en") {
        titleEl.innerText = "Fuel Tank Monitor";
        labelTotalEl.innerText = "Total Fuel";
        totalValueEl.innerText = formatLiters(maxFuel) + " L";

        labelAvailableEl.innerText = "Available Fuel";
        availableValueEl.innerText = formatLiters(availableFuel) + " L";

        statusEl.innerText = "System Running...";
    } else {
        titleEl.innerText = "জ্বালানি ট্যাংক মনিটর";
        labelTotalEl.innerText = "মোট জ্বালানি";
        totalValueEl.innerText = formatBangla(maxFuel) + " লিটার";

        labelAvailableEl.innerText = "বর্তমান জ্বালানি";
        availableValueEl.innerText = formatBangla(availableFuel) + " লিটার";

        statusEl.innerText = "সিস্টেম চালু আছে...";
    }

    progressBarEl.style.width = percent + "%";
}

// FORMAT NUMBERS
function formatLiters(value) {
    return value.toLocaleString('en-US');
}

function formatBangla(value) {
    const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return value.toString().split('').map(d => banglaDigits[d] || d).join('');
}

// AUTO LANGUAGE SWITCH
setInterval(() => {
    currentLang = currentLang === "en" ? "bn" : "en";
    translateUI();
}, intervalTime);

// FETCH DATA EVERY 3 SEC
function fetchFuelData() {
    fetch("/get_fuel?t=" + new Date().getTime())
        .then(res => res.json())
        .then(data => {
            console.log("Fetched data:", data);

            if (data.total_fuel !== undefined && data.available_fuel !== undefined) {
                maxFuel = parseInt(data.total_fuel);
                availableFuel = parseInt(data.available_fuel);
                translateUI();
            }
        })
        .catch(err => console.log("Error fetching data:", err));
}

// INITIAL LOAD
fetchFuelData();
setInterval(fetchFuelData, 3000);
