document.addEventListener('DOMContentLoaded', init);

let storeLocationData, productCategoryData, totalSalaryData;
let currentData = []; // Variabel untuk menyimpan data yang sedang ditampilkan

function init() {
    loadData('../store_location.csv', function(data) {
        storeLocationData = data;
        if (document.getElementById('dropdown-table').value === 'store-location') {
            processData('Location Store', storeLocationData);
        }
    });

    loadData('../product_category.csv', function(data) {
        productCategoryData = data;
        if (document.getElementById('dropdown-table').value === 'product-category') {
            processData('Product Category', productCategoryData);
        }
    });

    loadData('../total_salary.csv', function(data) {
        totalSalaryData = data;
        if (document.getElementById('dropdown-table').value === 'total-salary') {
            processData('Total Salary', totalSalaryData);
        }
    });

    document.getElementById('dropdown-table').addEventListener('change', handleDropdownChange);
}

function loadData(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = parseCSV(xhr.responseText);
                callback(data);
            } else {
                console.error('Error fetching data: ', xhr.statusText);
            }
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
    return { headers, data };
}

function processData(title, { headers, data }) {
    const tableContainer = document.getElementById('data-table');
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
    populateTable(tbody, data, headers);

    table.appendChild(thead);
    table.appendChild(tbody);
    newTableContainer.appendChild(table);
    tableContainer.appendChild(newTableContainer);
}

function populateTable(tbody, data, headers) {
    currentData = data; // Menyimpan data yang sedang ditampilkan
    tbody.innerHTML = ''; // Mengosongkan isi tbody

    // Menampilkan setiap baris data dalam tabel
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

function handleDropdownChange() {
    const selectedValue = document.getElementById('dropdown-table').value;
    const tableContainer = document.getElementById('data-table');
    tableContainer.innerHTML = ''; // Clear previous tables

    if (selectedValue === 'store-location' && storeLocationData) {
        processData('Location Store', storeLocationData);
    } else if (selectedValue === 'product-category' && productCategoryData) {
        processData('Product Category', productCategoryData);
    } else if (selectedValue === 'total-salary' && totalSalaryData) {
        processData('Total Salary', totalSalaryData);
    } else if (selectedValue === 'all') {
        if (storeLocationData) {
            processData('Location Store', storeLocationData);
        }
        if (productCategoryData) {
            processData('Product Category', productCategoryData);
        }
        if (totalSalaryData) {
            processData('Total Salary', totalSalaryData);
        }
    }
}





