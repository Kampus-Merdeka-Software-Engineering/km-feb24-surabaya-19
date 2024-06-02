var changeScroll_top = 0;
var changeScroll_bottom = 0;
var navbar = document.querySelector(".navbar");
var navLinks = document.querySelectorAll(".navbar-nav a");
var footer = document.querySelector(".footer");
var footerText = document.querySelectorAll(".footer-text");

window.addEventListener("scroll", function () {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var scrollBottom = window.pageYOffset + window.innerHeight;

  if (scrollTop > changeScroll_top && scrollTop > 80) {
    navbar.style.top = "-80px";
    navLinks.forEach(function (link) {
      link.style.opacity = "0";
    });
  } else {
    navbar.style.top = "0";
    navLinks.forEach(function (link) {
      link.style.opacity = "1";
    });
  }

  if (scrollBottom >= document.documentElement.scrollHeight - 2) {
    footer.style.bottom = "0";
    footerText.forEach(function (link) {
      link.style.opacity = "1";
    });
  } else {
    footer.style.bottom = "-80px";
    footerText.forEach(function (link) {
      link.style.opacity = "0";
    });
  }

  changeScroll_top = scrollTop;
  changeScroll_bottom = scrollBottom;
});

//Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
//Ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

//Klik diluar sidebar untuk menghilangkan bar
const hamburgerMenu = document.querySelector("#hamburger-menu"); // Mengubah variabel menjadi hamburgerMenu
document.addEventListener("click", function (e) {
  if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
    // Mengubah hamburger menjadi hamburgerMenu
    navbarNav.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", init);

let coffeeShopData = "/coffeeShopSalesData.json";
let currentData = [];
const pageSize = 10;
let currentPage = 1;

function init() {
  loadData(coffeeShopData, function (data) {
    coffeeShopData = data;
    currentData = coffeeShopData; // Set initial data to the complete dataset
    processData("Coffee Shop Sales", currentData);
    updatePagination(currentData);
  });

  document
    .getElementById("filter-button")
    .addEventListener("click", handleFilter);
  document
    .getElementById("prev-button")
    .addEventListener("click", () => changePage(-1));
  document
    .getElementById("next-button")
    .addEventListener("click", () => changePage(1));
}

function loadData(url, callback) {
  fetch(coffeeShopData)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => callback(data))
    .catch((error) => console.error("Error fetching data: ", error));
}

function processData(title, data) {
  const headers = Object.keys(data[0]);
  const tableContainer = document.getElementById("data-table");
  tableContainer.innerHTML = ""; // Clear previous table

  // Create a new table container
  const newTableContainer = document.createElement("div");
  newTableContainer.classList.add("table-container");

  // Add title for the table
  const tableTitle = document.createElement("h2");
  tableTitle.textContent = title;
  newTableContainer.appendChild(tableTitle);

  const table = document.createElement("table");
  table.classList.add("styled-table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Get column headers
  const headerRow = document.createElement("tr");
  headers.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Initial table population
  populateTable(tbody, data.slice(0, pageSize), headers);

  table.appendChild(thead);
  table.appendChild(tbody);
  newTableContainer.appendChild(table);
  tableContainer.appendChild(newTableContainer);
}

function populateTable(tbody, data, headers) {
  tbody.innerHTML = ""; // Clear tbody content

  // Display each row of data in the table
  data.forEach((row) => {
    const tr = document.createElement("tr");
    headers.forEach((header) => {
      const td = document.createElement("td");
      td.textContent = row[header];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function handleFilter() {
  const filterType = document.getElementById("filter-type").value;
  const filterValue = document
    .getElementById("filter-value")
    .value.toLowerCase();

  if (filterType && filterValue) {
    console.log("Filtering data:", filterType, filterValue);

    const filteredData = coffeeShopData.filter((item) => {
      const filterText = filterValue.toLowerCase();
      let isFiltered = false;

      if (filterType === "store_location") {
        isFiltered = item.store_location.toLowerCase().includes(filterText);
      } else if (filterType === "product_category") {
        isFiltered = item.product_category.toLowerCase().includes(filterText);
      } else if (filterType === "product_type") {
        isFiltered = item.product_type.toLowerCase().includes(filterText);
      }

      return isFiltered;
    });

    console.log("Filtered data:", filteredData);

    if (filteredData.length > 0) {
      alert("Data ditemukan!");
    } else {
      alert("Data tidak ditemukan.");
    }

    currentData = filteredData;
    currentPage = 1;
    processData("Filtered Coffee Shop Sales", currentData.slice(0, pageSize));
    updatePagination(currentData);
  }
}

function updatePagination(data) {
  const totalPages = Math.ceil(data.length / pageSize);
  document.getElementById("prev-button").disabled = currentPage === 1;
  document.getElementById("next-button").disabled = currentPage === totalPages;
  document.getElementById(
    "page-info"
  ).textContent = `Page ${currentPage} of ${totalPages}`;
}

function changePage(direction) {
  currentPage += direction;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const dataToShow = currentData.slice(start, end);
  populateTable(
    document.querySelector("tbody"),
    dataToShow,
    Object.keys(currentData[0])
  );
  updatePagination(currentData);
}

// Start Line Chart
// Fungsi untuk menginisialisasi grafik
function initializeChart(selector, title) {
  const chart = document.getElementById(selector).getContext("2d");
  const chartJs = new Chart(chart, {
    type: "line",
    data: [],
    options: {
      title: {
        display: true,
        text: title,
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  return chartJs;
}

// Inisialisasi grafik harian
const chartJsDaily = initializeChart(
  "chart-daily"
  // "Total Transaksi per Hari untuk setiap lokasi toko"
);
// Inisialisasi grafik per jam
const chartJsTime = initializeChart(
  "chart-time"
  // "Total Transaksi per Jam untuk setiap lokasi toko"
);

// Fetch dan proses data dari file JSON
fetch("../coffeeShopSalesData.json")
  .then((response) => response.json())
  .then((data) => {
    const filteredData = data.filter(
      (item) => item.product_category === "Packaged Chocolate"
      // item.product_category === "Branded",
      // item.product_category === "Loose Tea",
      // item.product_category === "Coffee beans",
      // item.product_category === "Flavours",
      // item.product_category === "Drinking Chocolate",
      // item.product_category === "Bakery",
      // item.product_category === "Tea",
      // item.product_category === "Coffee"
    );

    const dailyChartData = processDailyData(filteredData);
    updateChart(chartJsDaily, dailyChartData);

    const hourlyChartData = processHourlyData(filteredData);
    updateChart(chartJsTime, hourlyChartData);
  });

// Fungsi untuk memproses data harian
function processDailyData(data) {
  const dailyTransactions = {};
  data.forEach((item) => {
    const day = new Date(item.transaction_date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    if (!dailyTransactions[day]) dailyTransactions[day] = {};
    if (!dailyTransactions[day][item.store_location])
      dailyTransactions[day][item.store_location] = 0;
    dailyTransactions[day][item.store_location] += parseInt(
      item.transaction_qty
    );
  });

  return {
    labels: Object.keys(dailyTransactions),
    datasets: Object.keys(
      dailyTransactions[Object.keys(dailyTransactions)[0]]
    ).map((storeLocation, index) => ({
      label: storeLocation,
      data: Object.keys(dailyTransactions).map(
        (day) => dailyTransactions[day][storeLocation]
      ),
      backgroundColor: ["#FF8F00", "#4AA9F5", "#69D318"][index],
      borderColor: ["#FF8F00", "#4AA9F5", "#69D318"][index],
      borderWidth: 2,
    })),
  };
}

// Fungsi untuk memproses data per jam
function processHourlyData(data) {
  // Inisialisasi data per jam untuk setiap lokasi toko
  const hourlyTransactions = Array.from({ length: 24 }, (_, hour) => {
    const timeLabel = `${hour.toString().padStart(2, "0")}:00 - ${hour
      .toString()
      .padStart(2, "0")}:59`;
    return { timeLabel, locations: {} };
  });

  data.forEach((item) => {
    const hour = parseInt(item.transaction_time.split(":")[0]);
    const storeLocation = item.store_location;
    const timeLabel = `${hour.toString().padStart(2, "0")}:00 - ${hour
      .toString()
      .padStart(2, "0")}:59`;

    if (!hourlyTransactions[hour].locations[storeLocation]) {
      hourlyTransactions[hour].locations[storeLocation] = 0;
    }
    hourlyTransactions[hour].locations[storeLocation] += parseInt(
      item.transaction_qty
    );
  });

  const storeLocations = [...new Set(data.map((item) => item.store_location))];
  return {
    labels: hourlyTransactions.map((entry) => entry.timeLabel),
    datasets: storeLocations.map((storeLocation, index) => ({
      label: storeLocation,
      data: hourlyTransactions.map(
        (entry) => entry.locations[storeLocation] || 0
      ),
      backgroundColor: ["#FF8F00", "#4AA9F5", "#69D318"][index],
      borderColor: ["#FF8F00", "#4AA9F5", "#69D318"][index],
      borderWidth: 2,
    })),
  };
}

// Fungsi untuk memperbarui grafik
function updateChart(chartJs, chartData) {
  chartJs.data = chartData;
  chartJs.update();
}
// End Line Chart
