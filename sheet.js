const id_sheet = "1qZRjxc623o-hOygSNWisGIUdV9HbWC83_dqE88oeRpI";
const drive =`https://docs.google.com/spreadsheets/d/${id_sheet}/gviz/tq?`;
const sheetName= 'Sheet1';
const query = encodeURIComponent('Select *');
const url = `${drive}$sheet=${sheetName}&tq=${query}`;
const data = [];


document.addEventListener('DOMContentLoaded',init);

function init() {
    fetch(url)
        .then(response => response.text())
        .then(responseText => {
            const json = JSON.parse(responseText.substring(47).slice(0, -2));
            processData(json);
        })
        .catch(error => console.error('Error fetching data: ', error));
}

function processData(json) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Get column headers
    const columns = json.table.cols.map(col => col.label);
    const headerRow = document.createElement('tr');
    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Get rows data
    json.table.rows.forEach(row => {
        const tr = document.createElement('tr');
        row.c.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell ? cell.v : '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    document.getElementById('data-table').appendChild(table);
}

function populateDropdown(dropdownId, data, columnIndex) {
    const dropdown = document.getElementById(dropdownId);
    const uniqueValues = [...new Set(data.map(row => row.c[columnIndex] ? row.c[columnIndex].v : ''))];
    uniqueValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}

function populateTable(tbody, rows) {
    tbody.innerHTML = ''; // Clear existing table body
    rows.forEach(row => {
        const tr = document.createElement('tr');
        row.c.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell ? cell.v : '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function filterTable() {
    const nameFilter = document.getElementById('name-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;

    const filteredData = data.filter(row => {
        const nameCell = row.c[0]; // Assuming the 'Name' column is the first column
        const locationCell = row.c[1]; // Assuming the 'Store Location' column is the second column
        const categoryCell = row.c[2]; // Assuming the 'Product Category' column is the third column

        const nameMatch = !nameFilter || (nameCell && nameCell.v === nameFilter);
        const locationMatch = !locationFilter || (locationCell && locationCell.v === locationFilter);
        const categoryMatch = !categoryFilter || (categoryCell && categoryCell.v === categoryFilter);

        return nameMatch && locationMatch && categoryMatch;
    });

    const tbody = document.querySelector('table tbody');
    populateTable(tbody, filteredData);
}

