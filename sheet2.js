var changeScroll_top = 0;
var changeScroll_bottom = 0;
var navbar = document.querySelector(".navbar");
var navLinks = document.querySelectorAll(".navbar-nav a");
var footer = document.querySelector(".footer");
var footerText = document.querySelectorAll(".footer-text");

window.addEventListener("scroll", function(){
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var scrollBottom = window.pageYOffset + window.innerHeight;

  if(scrollTop > changeScroll_top && scrollTop > 80){
    navbar.style.top = "-80px";
    navLinks.forEach(function(link) {
      link.style.opacity = "0";
    });
  } else {
    navbar.style.top = "0";
    navLinks.forEach(function(link) {
      link.style.opacity = "1";
    });
  }

  if (scrollBottom >= document.documentElement.scrollHeight - 2) {
    footer.style.bottom = "0";
    footerText.forEach(function(link) {
      link.style.opacity = "1";
    });
  } else {
    footer.style.bottom = "-80px";
    footerText.forEach(function(link) {
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
  if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) { // Mengubah hamburger menjadi hamburgerMenu
    navbarNav.classList.remove("active");
  }
});

document.addEventListener('DOMContentLoaded', init);

        let coffeeShopData = "/coffeeShopSalesData.json";
        let currentData = [];
        const pageSize = 10;
        let currentPage = 1;

        function init() {
            loadData(coffeeShopData, function(data) {
                coffeeShopData = data;
                currentData = coffeeShopData; // Set initial data to the complete dataset
                processData('Coffee Shop Sales', currentData);
                updatePagination(currentData);
            });

            document.getElementById('filter-button').addEventListener('click', handleFilter);
            document.getElementById('prev-button').addEventListener('click', () => changePage(-1));
            document.getElementById('next-button').addEventListener('click', () => changePage(1));
        }

        function loadData(url, callback) {
            fetch(coffeeShopData)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => callback(data))
                .catch(error => console.error('Error fetching data: ', error));
        }

        function processData(title, data) {
            const headers = Object.keys(data[0]);
            const tableContainer = document.getElementById('data-table');
            tableContainer.innerHTML = ''; // Clear previous table

            // Create a new table container
            const newTableContainer = document.createElement('div');
            newTableContainer.classList.add('table-container');
            
            // Add title for the table
            const tableTitle = document.createElement('h2');
            tableTitle.textContent = title;
            newTableContainer.appendChild(tableTitle);

            const table = document.createElement('table');
            table.classList.add('styled-table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            // Get column headers
            const headerRow = document.createElement('tr');
            headers.forEach(col => {
                const th = document.createElement('th');
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
            tbody.innerHTML = ''; // Clear tbody content

            // Display each row of data in the table
            data.forEach(row => {
                const tr = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = row[header];
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        }

        function handleFilter() {
            const filterType = document.getElementById('filter-type').value;
            const filterValue = document.getElementById('filter-value').value.toLowerCase();

            if (filterType && filterValue) {
                console.log('Filtering data:', filterType, filterValue);

                const filteredData = coffeeShopData.filter(item => {
                    const filterText = filterValue.toLowerCase();
                    let isFiltered = false;

                    if (filterType === 'store_location') {
                        isFiltered = item.store_location.toLowerCase().includes(filterText);
                    } else if (filterType === 'product_category') {
                        isFiltered = item.product_category.toLowerCase().includes(filterText);
                    } else if (filterType === 'product_type') {
                        isFiltered = item.product_type.toLowerCase().includes(filterText);
                    }

                    return isFiltered;
                });

                console.log('Filtered data:', filteredData);

                if (filteredData.length > 0) {
                    alert('Data ditemukan!');
                } else {
                    alert('Data tidak ditemukan.');
                }

                currentData = filteredData;
                currentPage = 1;
                processData('Filtered Coffee Shop Sales', currentData.slice(0, pageSize));
                updatePagination(currentData);
            }
        }

        function updatePagination(data) {
            const totalPages = Math.ceil(data.length / pageSize);
            document.getElementById('prev-button').disabled = currentPage === 1;
            document.getElementById('next-button').disabled = currentPage === totalPages;
            document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
        }

        function changePage(direction) {
            currentPage += direction;
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            const dataToShow = currentData.slice(start, end);
            populateTable(document.querySelector('tbody'), dataToShow, Object.keys(currentData[0]));
            updatePagination(currentData);
        }


