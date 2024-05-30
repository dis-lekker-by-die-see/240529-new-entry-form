



// const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
// console.log(currentTimestampInSeconds); // Example output: 1653498845


//*///////////////////////////////////////////////////////////////////////////////////////////////////////
let clubSelected = false;

document.addEventListener("DOMContentLoaded", function() {
    fetch('json_files_list.json')
        .then(response => response.json())
        .then(data => {
            const clubData = data;
            // The rest of the logic will be handled elsewhere
            processClubSelection(clubData);
            console.log(clubData); // For debugging purposes, to verify the data
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
});
//*///////////////////////////////////////////////////////////////////////////////////////////////////////


function processClubSelection(clubData) {
    const clubSelectContainer = document.getElementById('clubSelectContainer');
    const clubSelect = document.getElementById('clubSelect');
    const codeInput = document.getElementById('codeInput');
    const submitButton = document.getElementById('submitButton');
    const resultDiv = document.getElementById('result');

    // Populate the select element with club names
    clubData.forEach(club => {
        const option = document.createElement('option'); // <option value="">Select a club</option>
        option.value = club.clubName;
        option.textContent = club.clubName;
        clubSelect.appendChild(option); // <select id="clubSelect">
    });

    // Add 'not in list' option
    const notInListOption = document.createElement('option');
    notInListOption.value = "not-in-list";
    notInListOption.textContent = "Not in list";
    clubSelect.appendChild(notInListOption);

    // Event listener for club selection
    clubSelect.addEventListener('change', function() {
        const selectedClub = clubSelect.value;
        if (selectedClub === "not-in-list") {
            
            
            clubSelectContainer.style.display = 'none';
            
            ///????

        } else if (selectedClub !== "") {
            codeInput.style.display = 'block';
            submitButton.style.display = 'block';
        } else {
            codeInput.style.display = 'none';
            submitButton.style.display = 'none';
        }
    });

    // Event listener for submit button
    submitButton.addEventListener('click', function() {
        const selectedClub = clubSelect.value;
        const inputCode = codeInput.value;
        const club = clubData.find(club => club.clubName === selectedClub);
        if (club && parseInt(inputCode) === club.code) {
            clubSelectContainer.style.display = 'none';
            const clubInfoContainer = document.getElementById('clubInfoContainer');
            clubInfoContainer.style.display = 'block';

            fetchAndParseJSON(club.fileName);

        } else {
            resultDiv.innerHTML = "もう一度";
            resultDiv.style.color = 'red';
        }
    });
}

///////////////////////////////////////////////////////////////////////////////
//              Table Display

async function fetchAndParseJSON(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Extract necessary information
        const club = data.club;
        const teams = data.teams;
        const horses = data.horses;
        const riders = data.riders;

        // Call functions to display data in tables
        displayClub(club);
        displayTeams(teams);
        displayHorses(horses);
        displayRiders(riders);
    } catch (error) {
        console.error('Error fetching or parsing the JSON file:', error);
    }
}

function displayClub(club) {
    const tableContainer = document.getElementById('clubTableContainer');
    let tableHTML = `<table><tr><th>Club Name</th><th>Registration Officer</th><th>Mobile</th><th>Phone</th><th>Email</th><th>Fax</th></tr>`;
    club.forEach(c => {
        tableHTML += `<tr>
            <td contenteditable="true">${c.clubName}</td>
            <td contenteditable="true">${c.registrationOfficer}</td>
            <td contenteditable="true">${c.mobile}</td>
            <td contenteditable="true">${c.phone}</td>
            <td contenteditable="true">${c.email}</td>
            <td contenteditable="true">${c.fax}</td>
        </tr>`;
    });
    tableHTML += `</table>`;
    tableContainer.innerHTML = tableHTML;
    tableContainer.style.display = 'block';
}

function displayTeams(teams) {
    const tableContainer = document.getElementById('teamsTableContainer');
    let tableHTML = `<table><tr><th>Team Number</th><th>Team Name</th><th>Action</th></tr>`;
    teams.forEach(t => {
        tableHTML += `<tr>
            <td contenteditable="true">${t.teamNumber}</td>
            <td contenteditable="true">${t.teamName}</td>
            <td><button class="deleteRow">Delete</button></td>
        </tr>`;
    });
    tableHTML += `</table>`;
    tableHTML += `<button id="addTeamRow" data-container-id="teamsTableContainer" data-headers="Team Number,Team Name">Add Row</button>`;
    tableContainer.innerHTML = tableHTML;
    tableContainer.style.display = 'block';

    document.getElementById('addTeamRow').addEventListener('click', handleAddRow);
    Array.from(document.getElementsByClassName('deleteRow')).forEach(button => {
        button.addEventListener('click', deleteRow);
    });
}

function displayHorses(horses) {
    const tableContainer = document.getElementById('horsesTableContainer');
    let tableHTML = `<table><tr><th>Horse Number</th><th>Horse Name</th><th>Horse Name Furigana</th><th>Horse Reg Number</th><th>Horse Sex</th><th>Horse Age</th><th>Horse Color</th><th>Horse Breed</th><th>Horse Origin</th><th>Horse Owner</th><th>Action</th></tr>`;
    horses.forEach(h => {
        tableHTML += `<tr>
            <td contenteditable="true">${h.horseNumber}</td>
            <td contenteditable="true">${h.horseName}</td>
            <td contenteditable="true">${h.horseNameFurigana}</td>
            <td contenteditable="true">${h.horseRegNumber}</td>
            <td contenteditable="true">${h.horseSex}</td>
            <td contenteditable="true">${h.horseAge}</td>
            <td contenteditable="true">${h.horseColor}</td>
            <td contenteditable="true">${h.horseBreed}</td>
            <td contenteditable="true">${h.horseOrigin}</td>
            <td contenteditable="true">${h.horseOwner}</td>
            <td><button class="deleteRow">Delete</button></td>
        </tr>`;
    });
    tableHTML += `</table>`;
    tableHTML += `<button id="addHorseRow" data-container-id="horsesTableContainer" data-headers="Horse Number,Horse Name,Horse Name Furigana,Horse Reg Number,Horse Sex,Horse Age,Horse Color,Horse Breed,Horse Origin,Horse Owner">Add Row</button>`;
    tableContainer.innerHTML = tableHTML;
    tableContainer.style.display = 'block';

    document.getElementById('addHorseRow').addEventListener('click', handleAddRow);
    Array.from(document.getElementsByClassName('deleteRow')).forEach(button => {
        button.addEventListener('click', deleteRow);
    });
}

function displayRiders(riders) {
    const tableContainer = document.getElementById('ridersTableContainer');
    let tableHTML = `<table><tr><th>Rider Number</th><th>Rider Name</th><th>Rider Name Furigana</th><th>Rider Reg Number</th><th>Rider Sex</th><th>Action</th></tr>`;
    riders.forEach(r => {
        tableHTML += `<tr>
            <td contenteditable="true">${r.riderNumber}</td>
            <td contenteditable="true">${r.riderName}</td>
            <td contenteditable="true">${r.riderNameFurigana}</td>
            <td contenteditable="true">${r.riderRegNumber}</td>
            <td contenteditable="true">${r.riderSex}</td>
            <td><button class="deleteRow">Delete</button></td>
        </tr>`;
    });
    tableHTML += `</table>`;
    tableHTML += `<button id="addRiderRow" data-container-id="ridersTableContainer" data-headers="Rider Number,Rider Name,Rider Name Furigana,Rider Reg Number,Rider Sex">Add Row</button>`;
    tableContainer.innerHTML = tableHTML;
    tableContainer.style.display = 'block';

    document.getElementById('addRiderRow').addEventListener('click', handleAddRow);
    Array.from(document.getElementsByClassName('deleteRow')).forEach(button => {
        button.addEventListener('click', deleteRow);
    });
}
function deleteRow(event) {
    const row = event.target.closest('tr');
    row.parentNode.removeChild(row);
}

function handleAddRow(event) {
    const containerId = event.target.getAttribute('data-container-id');
    const headers = event.target.getAttribute('data-headers').split(',');
    addRow(containerId, headers);
}

function addRow(containerId, headers) {
    const tableContainer = document.getElementById(containerId);
    const table = tableContainer.querySelector('table');
    const newRow = document.createElement('tr');
    
    headers.forEach(header => {
        const newCell = document.createElement('td');
        newCell.setAttribute('contenteditable', 'true');
        newRow.appendChild(newCell);
    });

    // Add the new row to the table
    table.appendChild(newRow);

    // Change the 'Add Row' button to 'Update Table'
    const addButton = tableContainer.querySelector('button');
    addButton.textContent = 'Update Table';
    addButton.removeEventListener('click', handleAddRow);
    addButton.addEventListener('click', () => {
        if (validateRow(newRow)) {
            addButton.textContent = 'Add Row';
            addButton.addEventListener('click', handleAddRow);
        } else {
            alert('Please fill in all cells.');
        }
    });
}

function validateRow(row) {
    const cells = row.querySelectorAll('td');
    for (let cell of cells) {
        if (cell.textContent.trim() === '') {
            return false;
        }
    }
    return true;
}

//////////////////////////////////////////////////////////////////////////////////
//          Update Button at bottom of Tables 
document.getElementById('updateButton').addEventListener('click', function() {
    const tableContainers = ['clubTableContainer', 'teamsTableContainer', 'horsesTableContainer', 'ridersTableContainer'];
    const updatedData = {};

    tableContainers.forEach(containerId => {
        const table = document.getElementById(containerId).querySelector('table');
        const headers = Array.from(table.rows[0].cells).map(cell => cell.textContent);
        const rows = Array.from(table.rows).slice(1);
        const data = rows.map(row => {
            const cells = Array.from(row.cells);
            return cells.reduce((obj, cell, index) => {
                obj[headers[index]] = cell.textContent;
                return obj;
            }, {});
        });

        updatedData[containerId] = data;
    });

    console.log('Updated Data:', updatedData);
    // Here you can send updatedData to your server or process it further
});




