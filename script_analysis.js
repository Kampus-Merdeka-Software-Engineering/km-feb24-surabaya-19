//create by Farhan

var changeScroll_top = 0;
var changeScroll_bottom = 0;
var navbar = document.querySelector(".navbar"); // Mengubah pemilihan elemen menjadi class navbar
var navLinks = document.querySelectorAll(".navbar-nav a"); // Menambahkan variabel untuk menyimpan semua tautan navbar
var footer = document.querySelector(".footer");
var footerText = document.querySelectorAll(".footer-text");

window.addEventListener("scroll", function(){
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var scrollBottom = window.pageYOffset || document.documentElement.scrollBottom;
  if(scrollTop > changeScroll_top){
    navbar.style.top = "-80px"; // Mengubah style top menjadi -80px untuk menyembunyikan navbar
    navLinks.forEach(function(link) {
      link.style.opacity = "0"; // Menyembunyikan tautan navbar dengan mengubah opacity menjadi 0
      link.style.transition = "0.5s";
    });

    if (scrollBottom > changeScroll_bottom){
      footer.style.bottom = "0"; // Mengubah style top menjadi -80px untuk menyembunyikan navbar
    footerText.forEach(function(link) {
      link.style.opacity = "1"; // Menyembunyikan tautan navbar dengan mengubah opacity menjadi 0
      link.style.transition = "0.5s";
    });
    }
  } else {
    navbar.style.top = "0"; // Mengembalikan style top menjadi 0 untuk menampilkan navbar kembali
    footer.style.bottom = "-80px"
    navLinks.forEach(function(link) {
      link.style.opacity = "1"; // Menampilkan kembali tautan navbar dengan mengubah opacity menjadi 1
      link.style.transition = "0.5s";
    });

    footerText.forEach(function(link) {
      link.style.opacity = "0"; // Menyembunyikan tautan navbar dengan mengubah opacity menjadi 0
      link.style.transition = "0.5s";
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
  if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) { // Mengubah hamburger menjadi hamburgerMenu
    navbarNav.classList.remove("active");
  }
});


const photo_coffe = document.querySelectorAll(".photo_coffe");

document.addEventListener("DOMContentLoaded", function () {
  // Define chart contexts
  const chartCtx = document.getElementById("chart-store").getContext("2d");
  const barchart1Ctx = document.getElementById("barchart1").getContext("2d");
  const barchart2Ctx = document.getElementById("barchart2").getContext("2d");
  const dailyChartContext = document.getElementById("chart-daily").getContext("2d");
  const timeChartContext = document.getElementById("chart-time").getContext("2d");

  // Create charts using predefined functions
  const chartJs = createDoughnutChart(chartCtx);
  const barchart1 = createBarChart(barchart1Ctx, "Total Transactions by Product Category");
  const barchart2 = createBarChart(barchart2Ctx, "Total Monthly Transactions in Each Store");
  const chartJsDaily = createLineChart(dailyChartContext, "Total Transactions per Day for Each Store Location");
  const chartJsTime = createLineChart(timeChartContext, "Total Transactions per Hour for Each Store Location");

  // Fetch and display initial data for specific store locations
  fetchAndDisplayInitialData();

  // Initialize dropdowns
  initializeDropdowns();

  // Close dropdown if clicked outside
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) {
      document.querySelectorAll('.menu').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });

  function initializeDropdowns() {
    document.querySelectorAll('.dropdown1, .dropdown2').forEach(dropdown => {
      const select = dropdown.querySelector('.select');
      const menu = dropdown.querySelector('.menu');
      const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
      const totalTransactionDiv = document.querySelector('.total-transaction');

      // Initialize checkboxes as checked
      checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        
      });

      // Function to update selection and fetch data
      const updateSelection = () => {
        const selectedOptions1 = Array.from(document.querySelectorAll('.dropdown1 input[type="checkbox"]'))
          .filter(cb => cb.checked)
          .map(cb => cb.value);

        const selectedOptions2 = Array.from(document.querySelectorAll('.dropdown2 input[type="checkbox"]'))
          .filter(cb => cb.checked)
          .map(cb => cb.value);

        const selectedText1 = 'Product Category';
        const selectedText2 = 'Product Detail';

        document.querySelector('.dropdown1 .selected').innerText = selectedText1;
        document.querySelector('.dropdown2 .selected').innerText = selectedText2;

        fetchData(selectedOptions1, selectedOptions2)
          .then(filteredData => {
            let totalTransactionQty = transaction_qty;
            const dataDropdown = document.getElementById('dataDropdown');
            const totalTransactionDiv = document.getElementById('totalTransactionDiv');

            dataDropdown.innerHTML = '';
            filteredData.forEach(item => {
              const content = document.createElement('div');
              content.innerText = `${item.product_category}: ${item.transaction_qty}`;
              dataDropdown.appendChild(content);
              totalTransactionQty += item.transaction_qty;
            });

            dataDropdown.classList.add('show');
            totalTransactionDiv.innerText = `Total Transaction Quantity: ${totalTransactionQty}`;

            // Update all charts with filtered data
            updateCharts(chartJs, barchart1, barchart2, chartJsDaily, chartJsTime, filteredData);
          })
          .catch(error => {
            console.error("Error fetching data: ", error);
          });
      };

      // Initialize update for default checked checkboxes
      updateSelection();

      // Add event listener to each checkbox for change event
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelection);
      });

      // Add event listener to toggle menu visibility
      select.addEventListener('click', () => {
        menu.classList.toggle('menu-open');
        select.classList.toggle('select-clicked');
        const pickme = dropdown.querySelector('.pickme');
        pickme.classList.toggle('pickme-rotate');
      });
    });
  }

  function fetchAndDisplayInitialData() {
    fetch("/coffeeShopSalesData.json")
      .then(response => response.json())
      .then(data => {
        const selectedLocations = ["Lower Manhattan", "Astoria", "Hell's Kitchen"];
        const selectedOptions1 = Array.from(document.querySelectorAll('.dropdown1 input[type="checkbox"]'))
          .filter(cb => cb.checked)
          .map(cb => cb.value);

        const selectedOptions2 = Array.from(document.querySelectorAll('.dropdown2 input[type="checkbox"]'))
          .filter(cb => cb.checked)
          .map(cb => cb.value);
          console.log("Sebelum hasil filter ", data.length)

        const filteredData = data.filter(item => 
          selectedLocations.includes(item.store_location) &&
          selectedOptions1.includes(item.product_category) && 
          selectedOptions2.includes(item.product_detail)
        );

        console.log("data dari product_detail", selectedOptions2)
        console.log("Ini hasil filter ", filteredData.length)

        // Update all charts with filtered initial data
        updateCharts(chartJs, barchart1, barchart2, chartJsDaily, chartJsTime, filteredData);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }

  async function fetchData(selectedOptions1, selectedOptions2) {
    const cachedData = localStorage.getItem('cachedData');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return filterData(parsedData, selectedOptions1, selectedOptions2);
    } else {
      const response = await fetch("/coffeeShopSalesData.json");
      const data = await response.json();
      localStorage.setItem('cachedData', JSON.stringify(data));
      return filterData(data, selectedOptions1, selectedOptions2);
    }
  }

  function filterData(data, selectedOptions) {
    return data.filter(item =>
      selectedOptions.includes(item.product_category.selectedOptions1) &&
      selectedOptions.includes(item.product_detail.selectedOptions2)
    );
  }


  function updateCharts(chart1, chart2, chart3, chart4, chart5, data) {
    console.log("Ini datanya", data.length)
    updateDoughnutChart(chart1, data);
    updateBarChart1(chart2, data);
    updateBarChart2(chart3, data);
    updateDailyChart(chart4, data);
    updateTimeChart(chart5, data);
  }

  function createDoughnutChart(ctx) {
    return new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 10,
              },
              boxWidth: 10,
              boxHeight: 10,
            },
          },
          datalabels: {
            formatter: (value, ctx) => value,
            color: '#fff',
            font: {
              weight: 'bold'
            },
          }
        },
        scales: {
          y: {
            display: false,
          },
          x: {
            display: false,
          },
        },
      },
    });
  }

  function createBarChart(ctx, titleText) {
    return new Chart(ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: titleText,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  function createLineChart(ctx, titleText) {
    return new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: titleText,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  function updateDoughnutChart(chart, data) {
    const backgroundColors = ["#FF8F00", "#FFB300", "#FFD54F"];
    const borderColors = ["#FF8F00", "#FFB300", "#FFD54F"];

    const storeLocations = ["Lower Manhattan", "Astoria", "Hell's Kitchen"];
    const chartData = storeLocations.map((storeLocation, index) => {
      const transactions = data.filter(item => item.store_location === storeLocation);
      const totalTransaction = transactions.reduce((acc, current) => acc + parseInt(current.transaction_qty), 0);
      return {
        label: storeLocation,
        value: totalTransaction,
        backgroundColor: backgroundColors[index % backgroundColors.length],
        borderColor: borderColors[index % borderColors.length],
      };
    });

    chart.data.labels = chartData.map(item => item.label);
    chart.data.datasets[0].data = chartData.map(item => item.value);
    chart.data.datasets[0].backgroundColor = chartData.map(item => item.backgroundColor);
    chart.data.datasets[0].borderColor = chartData.map(item => item.borderColor);
    chart.update();
  }

  function updateBarChart1(chart, data) {
    const categoryTransactions = {};
    data.forEach(item => {
      if (!categoryTransactions[item.product_category]) {
        categoryTransactions[item.product_category] = 0;
      }
      categoryTransactions[item.product_category] += parseInt(item.transaction_qty);
    });

    const barchart1Data = {
      labels: Object.keys(categoryTransactions),
      datasets: [
        {
          label: "Total Transactions",
          data: Object.values(categoryTransactions),
          backgroundColor: "#FF8F00",
          borderColor: "#FF8F00",
          borderWidth: 1,
        },
      ],
    };
    chart.data = barchart1Data;
    chart.update();
  }

  function updateBarChart2(chart, data) {
    const monthlyTransactions = {};
    data.forEach(item => {
      const date = new Date(item.transaction_date);
      const month = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      const store = item.store_location;

      if (!monthlyTransactions[month]) {
        monthlyTransactions[month] = {};
      }
      if (!monthlyTransactions[month][store]) {
        monthlyTransactions[month][store] = 0;
      }
      monthlyTransactions[month][store] += parseInt(item.transaction_qty);
    });

    const months = Object.keys(monthlyTransactions);
    const stores = new Set(data.map(item => item.store_location));
    const datasets = Array.from(stores).map((store, index) => ({
      label: store,
      data: months.map(month => monthlyTransactions[month][store] || 0),
      backgroundColor: ["#FF8F00", "#FFB300", "#FFD54F"][index % 3],
      borderColor: ["#FF8F00", "#FFB300", "#FFD54F"][index % 3],
      borderWidth: 1,
    }));

    const barchart2Data = {
      labels: months,
      datasets: datasets,
    };
    chart.data = barchart2Data;
    chart.update();
  }

  function updateDailyChart(chart, data) {
    const dailyTransactions = {};
    data.forEach(item => {
      const day = new Date(item.transaction_date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      if (!dailyTransactions[day]) dailyTransactions[day] = {};
      if (!dailyTransactions[day][item.store_location]) dailyTransactions[day][item.store_location] = 0;
      dailyTransactions[day][item.store_location] += parseInt(item.transaction_qty);
    });

    const dailyChartData = {
      labels: Object.keys(dailyTransactions),
      datasets: Object.keys(dailyTransactions[Object.keys(dailyTransactions)[0]]).map((storeLocation, index) => ({
        label: storeLocation,
        data: Object.keys(dailyTransactions).map(day => dailyTransactions[day][storeLocation] || 0),
        backgroundColor: ["#FF8F00", "#4AA9F5", "#69D318"][index],
        borderColor: ["#FF8F00", "#4AA9F5", "#69D318"][index],
        borderWidth: 2,
      })),
    };

    chart.data = dailyChartData;
    chart.update();
  }

  function updateTimeChart(chart, data) {
    const hourlyTransactions = Array.from({ length: 24 }, (_, hour) => {
      const period = hour < 12 ? 'AM' : 'PM';
      const adjustedHour = hour % 12 || 12; // Adjust 0 hour to 12 for 12 AM
      const timeLabel = `${adjustedHour.toString().padStart(2, "0")}:00 ${period}`;
      return { timeLabel, locations: {} };
    });

    data.forEach(item => {
      const hour = parseInt(item.transaction_time.split(":")[0]);
      const storeLocation = item.store_location;

      if (!hourlyTransactions[hour].locations[storeLocation]) {
        hourlyTransactions[hour].locations[storeLocation] = 0;
      }
      hourlyTransactions[hour].locations[storeLocation] += parseInt(item.transaction_qty);
    });

    const storeLocations = [...new Set(data.map(item => item.store_location))];
    const hourlyChartData = {
      labels: hourlyTransactions.map(entry => entry.timeLabel),
      datasets: storeLocations.map((storeLocation, index) => ({
        label: storeLocation,
        data: hourlyTransactions.map(entry => entry.locations[storeLocation] || 0),
        backgroundColor: ["#FF8F00", "#4AA9F5", "#69D318"][index],
        borderColor: ["#FF8F00", "#4AA9F5", "#69D318"][index],
        borderWidth: 2,
      })),
    };

    chart.data = hourlyChartData;
    chart.update();
  }
});
