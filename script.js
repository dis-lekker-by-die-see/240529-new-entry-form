
let clubSelected = false;
let wasNewClubOptionSelected = false;
let selectedFileName = "";
let updatedData = {};
let newRowNumbers = { club: 0, teams: 0, horses: 0, riders: 0, entries: 0 };
let events = {};
const price馬 = 12000;
//*///////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function() {
    fetch('json_files_list.json')
        .then(response => response.json())
        .then(data => {
            const clubData = data;
            processClubSelection(clubData);
            console.log(clubData); // For debugging purposes
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
});
//*///////////////////////////////////////////////////////////////////////////////////////////////////////
function processClubSelection(clubData) {
    const clubSelectContainer = document.getElementById('clubSelectContainer');
    const clubSelect = document.getElementById('clubSelect');
    const codeInput = document.getElementById('codeInput');
    const submitButton = document.getElementById('submitButton');
    const newClubRecord = document.createElement('option');

    newClubRecord.value = "new-club";
    newClubRecord.textContent = "- - 新登録 - -";
    clubSelect.appendChild(newClubRecord);
    clubData.forEach(club => {
        const option = document.createElement('option'); // <option value="">Select a club</option>
        option.value = club.clubName;
        option.textContent = club.clubName;
        clubSelect.appendChild(option); // <select id="clubSelect">
    });
    clubSelect.addEventListener('change', function() {
        const selectedClub = clubSelect.value;
        if (selectedClub === "new-club") {
            clubSelectContainer.style.display = 'none';
            const clubInfoContainer = document.getElementById('clubInfoContainer');
            clubInfoContainer.style.display = 'block';
            fetchAndParseJSON('dummy.json', false);
            wasNewClubOptionSelected = true;
        } else if (selectedClub !== "") {
            codeInput.style.display = 'block';
            submitButton.style.display = 'block';
            codeInput.focus();
        } //else {
        //     codeInput.style.display = 'block'; //'none';
        //     submitButton.style.display = 'none';
        // }
    });
    submitButton.addEventListener('click', function() {
        const selectedClub = clubSelect.value;
        const inputCode = codeInput.value;
        const club = clubData.find(club => club.clubName === selectedClub);
        if (club && parseInt(inputCode) === club.code) {
            clubSelectContainer.style.display = 'none';
            const clubInfoContainer = document.getElementById('clubInfoContainer');
            clubInfoContainer.style.display = 'block';
            selectedFileName = club.fileName;
            fetchAndParseJSON(selectedFileName, true);
        } else {
            codeInput.style.border = '2px solid red';
        }
    });
    codeInput.addEventListener('keypress', function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); 
            submitButton.click(); // Trigger the click event on the button
        }
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//              Read data
async function fetchAndParseJSON(file, canEdit) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('JSON Data:', data);
        
        // Extract necessary information
        const club = data.club;
        const teams = data.teams;
        const horses = data.horses;
        const riders = data.riders;
        if (canEdit){
            // Call functions to display data in tables
            displayClub(club, true);
            displayTeams(teams, true);
            displayHorses(horses, true);
            displayRiders(riders, true);
        } else {
            displayClub(club, false);
            displayTeams(teams, false);
            displayHorses(horses, false);
            displayRiders(riders, false);
        }
    } catch (error) {
        console.error('Error fetching or parsing the JSON file:', error);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//          Display Tables 
function displayClub(club, canEdit) {
    const tableContainer = document.getElementById('clubTableContainer');
    let tableHTML = ``;
    if (wasNewClubOptionSelected) {
        tableHTML += `<p class="clubInfoTableText">
        下記のフォームを使用して、クラブの詳細、チーム、馬、選手を追加してください。
        <br>
        注意：新しいデータはここには保存されません。このフォームは、ダウンロード可能なファイルを生成し、そのファイルをメールで協会に送信する必要があります。
        <br>
        重要：ページをリフレッシュまたは再読み込みすると、すべての変更と新しいデータが失われます。
        </p>`;
    } else {
        tableHTML += `<p class="clubInfoTableText">
        以下は、岡山県馬術連盟が保有するクラブ情報の記録です。
        クラブ情報を最新の状態に保つために、下記のフォームを使用して更新してください。
        クラブ名と住所はここでは変更できません。
        チーム(所属)、馬、選手の追加や削除が可能です。
        この競技に参加しないチーム、馬、選手を削除する必要はありません。
        <br>
        注意：新しいデータや以下のデータの更新はここには保存されません。このフォームは、ダウンロード可能なファイルを生成し、そのファイルをメールで連盟に送信する必要があります。
        <br>
        重要：ページをリフレッシュまたは再読み込みすると、すべての変更と新しいデータが失われます。
        </p>`;
    }
    tableHTML += `<table><tr><th>団体名</th><th>申込責任者</th><th>携帯</th><th>電話</th><th>email</th><th>FAX</th><th>住所</th></tr>`;
    club.forEach(c => {
        tableHTML += `<tr>
            <td>${c.clubName}</td>
            <td contenteditable="${canEdit}">${c.registrationOfficer}</td>
            <td contenteditable="${canEdit}">${c.mobile}</td>
            <td contenteditable="${canEdit}">${c.phone}</td>
            <td contenteditable="${canEdit}">${c.email}</td>
            <td contenteditable="${canEdit}">${c.fax}</td>
            <td>${c.address}</td>
        </tr>`;
    });
    tableHTML += `</table>`;
    tableHTML += `<button style="display: none;" id="addClubRow" class="addRowButton" data-new-row-number="1" data-container-id="clubTableContainer" data-headers="1,2,3,4,5,6,7">追加</button>`; //
    tableContainer.innerHTML = tableHTML;
    tableContainer.style.display = 'block';
    if (wasNewClubOptionSelected) {
        document.getElementById('addClubRow').style.display = 'block';
    } 
    document.getElementById('addClubRow').addEventListener('click', handleAddRow);
}
///////////////////////////////////////
function displayTeams(teams, canEdit) {
    const tableContainer = document.getElementById('teamsTableContainer');
    let tableHTML = ``;
    tableHTML += `<p class="clubInfoTableText">
        いくつかの団体・乗馬クラブには複数の所属・チームがあります。例えば、(団体) 蒜山ホースパーク >> (所属) 蒜山ホースパーク、(団体) 蒜山ホースパーク >> (所属) 真庭市スポーツ少年団。
        <br>
        所属名・チームが団体名・乗馬クラブと同じ場合は、ここに団体名をもう一度追加してください。
        </p>`;
    tableHTML += `<table><tr><th>番</th><th>所属名</th>`;
    if (canEdit) {
        tableHTML += `<th>削除</th></tr>`;
    } else {
        tableHTML += `</tr>`;
    }
    teams.forEach(t => {
        tableHTML += `<tr>
            <td>${t.number}</td>
            <td contenteditable="${canEdit}">${t.teamName}</td>`;
        if (canEdit) {
            tableHTML += `<td><button class="deleteRow"> X </button></td></tr>`;
        }else {
            tableHTML += `</tr>`;
        }
        newRowNumbers.teams = +t.number + 1;
    });
    tableHTML += `</table>`;
    tableHTML += `<button id="addTeamRow" class="addRowButton" data-new-row-number="${newRowNumbers.teams}" data-container-id="teamsTableContainer" data-headers="Number,Team Name">追加</button>`;
    tableContainer.innerHTML = tableHTML;
    tableContainer.style.display = 'block';
    Array.from(document.getElementsByClassName('deleteRow')).forEach(button => {
        button.addEventListener('click', deleteRow);
    });
    document.getElementById('addTeamRow').addEventListener('click', handleAddRow);
}
/////////////////////////////////////////
function displayHorses(horses, canEdit) {
    const tableContainer = document.getElementById('horsesTableContainer');
    let tableHTML = `<table><tr><th>番</th><th>馬名</th><th>フリガナ</th><th>登録番号</th><th>性別</th><th>年齢</th><th>毛色</th><th>品種</th><th>産地</th><th>所有者</th>`;
    if (canEdit) {
        tableHTML += `<th>削除</th></tr>`;
    } else {
        tableHTML += `</tr>`;
    }
    horses.forEach(h => {
        tableHTML += `<tr>
            <td>${h.number}</td>
            <td contenteditable="${canEdit}">${h.horseName}</td>
            <td contenteditable="${canEdit}">${h.horseNameFurigana}</td>
            <td contenteditable="${canEdit}">${h.horseRegNumber}</td>
            <td contenteditable="${canEdit}">${h.horseSex}</td>
            <td contenteditable="${canEdit}">${h.horseAge}</td>
            <td contenteditable="${canEdit}">${h.horseColor}</td>
            <td contenteditable="${canEdit}">${h.horseBreed}</td>
            <td contenteditable="${canEdit}">${h.horseOrigin}</td>
            <td contenteditable="${canEdit}">${h.horseOwner}</td>`;
        if (canEdit) {
            tableHTML += `<td><button class="deleteRow"> X </button></td></tr>`;
        }else {
            tableHTML += `</tr>`;
        }
        newRowNumbers.horses = +h.number + 1;
    });
    tableHTML += `</table>`;
    tableHTML += `<button id="addHorseRow" class="addRowButton" data-new-row-number="${newRowNumbers.horses}" data-container-id="horsesTableContainer" data-headers="Number,Horse Name,Horse Name Furigana,Horse Reg Number,Horse Sex,Horse Age,Horse Color,Horse Breed,Horse Origin,Horse Owner">追加</button>`;
    tableContainer.innerHTML = tableHTML;
    tableContainer.style.display = 'block';
    Array.from(document.getElementsByClassName('deleteRow')).forEach(button => {
        button.addEventListener('click', deleteRow);
    });
    document.getElementById('addHorseRow').addEventListener('click', handleAddRow);
}
/////////////////////////////////////////
function displayRiders(riders, canEdit) {
    const tableContainer = document.getElementById('ridersTableContainer');
    let tableHTML = `<table><tr><th>番</th><th>選手名</th><th>フリガナ</th><th>登録番号</th><th>性別</th>`;
    if (canEdit) {
        tableHTML += `<th>削除</th></tr>`;
    } else {
        tableHTML += `</tr>`;
    }
    riders.forEach(r => {
        tableHTML += `<tr>
            <td>${r.number}</td>
            <td contenteditable="${canEdit}">${r.riderName}</td>
            <td contenteditable="${canEdit}">${r.riderNameFurigana}</td>
            <td contenteditable="${canEdit}">${r.riderRegNumber}</td>
            <td contenteditable="${canEdit}">${r.riderSex}</td>`;
        if (canEdit) {
            tableHTML += `<td><button class="deleteRow"> X </button></td></tr>`;
        }else {
            tableHTML += `</tr>`;
        }
        newRowNumbers.riders = +r.number + 1;
    });
    tableHTML += `</table>`;
    tableHTML += `<button id="addRiderRow" class="addRowButton" data-new-row-number="${newRowNumbers.riders}" data-container-id="ridersTableContainer" data-headers="Number,Rider Name,Rider Name Furigana,Rider Reg Number,Rider Sex">追加</button>`;
    tableContainer.innerHTML = tableHTML;
    tableContainer.style.display = 'block';
    Array.from(document.getElementsByClassName('deleteRow')).forEach(button => {
        button.addEventListener('click', deleteRow);
    });
    document.getElementById('addRiderRow').addEventListener('click', handleAddRow);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//          [追加] & [ X ] table buttons

function deleteRow(event) {
    const row = event.target.closest('tr');
    row.parentNode.removeChild(row);
}
//////////////////////////////
function handleAddRow(event) {
    const containerId = event.target.getAttribute('data-container-id');
    const headers = event.target.getAttribute('data-headers').split(',');
    addRow(containerId, headers); 
}
///////////////////////////
function validateRow(row) {
    const cells = row.querySelectorAll('td');
    for (let cell of cells) {
        const select = cell.querySelector('select');
        if (select) {
            if (select.value === '' || select.value === null) {
                return false;
            }
        } else {
            const isContentEditable = cell.getAttribute('contenteditable');
            if (isContentEditable === 'true' && cell.textContent.trim() === '') {
                return false;
            }
        }
    }
    return true; 
}
///////////////////////////////////////
function addRow(containerId, headers) {  
    let newRowNumber = 0;
    const tableContainer = document.getElementById(containerId);
    const table = tableContainer.querySelector('table');
    const newRow = document.createElement('tr');
    if (containerId === 'clubTableContainer') {
        newRowNumber = newRowNumbers.club;
    } else if (containerId === 'teamsTableContainer') {
        newRowNumber = newRowNumbers.teams;
    } else if (containerId === 'horsesTableContainer') {
        newRowNumber = newRowNumbers.horses;
    } else if (containerId === 'ridersTableContainer') {
        newRowNumber = newRowNumbers.riders;
    };
    
    headers.forEach(header => {
        let newCell = document.createElement('td');
        if (header === 'Number') {
            newCell.innerHTML = `${newRowNumber}`
        } else if (header === 'Horse Sex') {
            newCell.innerHTML = `<select class="horseSex" required>
                                    <option value="" disabled selected>性別</option>
                                    <option value="セン">セン</option>
                                    <option value="牝">牝</option>
                                    <option value="牡">牡</option>
                                </select>`;
        } else if (header === 'Horse Color') {
            newCell.innerHTML = `<select class="horseColor" required>
                                    <option value="" disabled selected>毛色</option>
                                    <option value="鹿毛">鹿毛</option>
                                    <option value="黒鹿毛">黒鹿毛</option>
                                    <option value="栗毛">栗毛</option>
                                    <option value="芦毛">芦毛</option>
                                    <option value="栃栗毛">栃栗毛</option>
                                    <option value="青鹿毛">青鹿毛</option>
                                    <option value="青毛">青毛</option>
                                    <option value="粕毛">粕毛</option>
                                    <option value="ブチ">ブチ</option>
                                </select>`;
        } else if (header === 'Rider Sex') {
            newCell.innerHTML = `<select class="riderSex" required>
                                    <option value="" disabled selected>性別</option>
                                    <option value="女子">女子</option>
                                    <option value="男子">男子</option>
                                </select>`;
        } else {
            newCell.setAttribute('contenteditable', 'true');
        }
        newRow.appendChild(newCell);
    });
    table.appendChild(newRow);
    const addButton = tableContainer.querySelector('.addRowButton');
    addButton.textContent = '更新';
    if (containerId === 'teamsTableContainer') {
        newRowNumbers.teams += 1;
    } else if (containerId === 'horsesTableContainer') {
        newRowNumbers.horses += 1;
    } else if (containerId === 'ridersTableContainer') {
        newRowNumbers.riders += 1;
    };
    addButton.removeEventListener('click', handleAddRow);
    addButton.addEventListener('click', () => {
        if (validateRow(newRow)) {
            if (containerId != 'clubTableContainer') {
                addButton.textContent = '追加';
                addButton.addEventListener('click', handleAddRow);
            }
        } else {
            alert('Please fill in all cells.');
        }
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//          [Update Button] at bottom of all Tables 
document.getElementById('updateButton').addEventListener('click', function() {
    const tableContainers = ['clubTableContainer', 'teamsTableContainer', 'horsesTableContainer', 'ridersTableContainer'];
    let isEmptyTable = false;
    tableContainers.forEach(containerId => {
        const tableName = containerId.replace(/TableContainer/i, '');  // 'i' makes it case-insensitive
        if (tableName == 'club') {
            headers = [
                "clubName",
                "registrationOfficer",
                "mobile",
                "phone",
                "email",
                "fax",
                "address"
            ]
        } else if (tableName == 'teams') {
            headers = [
                "number",
                "teamName"
            ]
        } else if (tableName == 'horses') {
            headers = [
                "number",
                "horseName",
                "horseNameFurigana",
                "horseRegNumber",
                "horseSex",
                "horseAge",
                "horseColor",
                "horseBreed",
                "horseOrigin",
                "horseOwner"
            ]
        } else if (tableName == 'riders') {
            headers = [
                "number",
                "riderName",
                "riderNameFurigana",
                "riderRegNumber",
                "riderSex"
            ]
        }
        const table = document.getElementById(containerId).querySelector('table');
        let rows = [];
        if (wasNewClubOptionSelected) {
            rows = Array.from(table.rows).slice(2); // Skip the header row & dummy info row
        } else {
            rows = Array.from(table.rows).slice(1); // Skip the header row
        }
        let cells = []; 
        const data = rows.map(row => {
            if (wasNewClubOptionSelected) {
                cells = Array.from(row.cells);            
            } else {
                cells = Array.from(row.cells);//.slice(0, -1); // Exclude the last cell of each row
            }
            return cells.reduce((obj, cell, index) => {
                const select = cell.querySelector('select');
                if (select) {
                    obj[headers[index]] = select.value;
                } else {
                    obj[headers[index]] = cell.textContent.trim();
                }
                return obj;
            }, {});
        }).filter(row => !Object.values(row).some(value => value === ''));
        if (data.length === 0) {
            isEmptyTable = true;
        } else {
            updatedData[tableName] = data;
        }
    });
    if (isEmptyTable) {
        const userChoice = confirm("One or more tables have no valid data rows. Click 'Cancel' to go back and edit, or 'OK' to reload the page.");
        if (userChoice) {
            window.location.reload(); 
        } else {
            return;
        }
    } else {

        const userChoiceToProceed = confirm(`Are you sure you want to continue to Entries? You cannot come back.\n\n'Cancel' to keep editing.\n'OK' to continue to Entries.`);
        if (userChoiceToProceed) {
            console.log('Updated Data:', updatedData);
            clubInfoContainer.style.display = 'none';        
            const entriesContainer = document.getElementById('entriesContainer');
            entriesContainer.style.display = 'block';
            displayEntries(true);
            loadEventCSV();
        } else {
            return;
        }
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//          Entries 
function displayEntries() {
    const tableContainer = document.getElementById('entriesTableContainer');
    let tableHTML = `<h2>Entries</h2>`
    tableHTML += `
        <table><tr>
            <th>番</th>
            <th>所属</th>
            <th>競技番号</th>
            <th>日付</th>
            <th>種目名</th>
            <th>競技名</th>
            <th>選手名</th>
            <th>選手登録番号</th>
            <th>馬名</th>
            <th>馬登録番号</th>
            <th>区分</th>
            <th>エントリー料</th>
            <th>備考</th>
        </tr></table>`;
    //tableHTML += `<button id="addEntryRow" class="addEntryRowButton" 
    //data-headers="number,teamName,scheduleNumber,scheduleDate,eventCode,eventName,riderName,riderRegNumber,horseName,horseRegNumber,priceCode,price,comment">追加</button>`;
    tableContainer.innerHTML = tableHTML;
    tableContainer.style.display = 'block';
    document.getElementById('addEntryRow').addEventListener('click', handleAddEntryRow);

}
//////////////////////////////
function handleAddEntryRow(event) {
    //const containerId = event.target.getAttribute('data-container-id');
    const headers = event.target.getAttribute('data-headers').split(',');
    const data = event.target.getAttribute('data-schedule-data');
    addEntryRow(headers);
}
/////////////////////////////////////////////////////
function addEntryRow(headers) {
    const tableContainer = document.getElementById('entriesTableContainer');
    const table = tableContainer.querySelector('table');
    const newRow = document.createElement('tr');
    if (!validateAllInputs()) {
        alert('Please fill all required fields before adding a new entry.');
        return; // Stop the function if not all inputs are valid
    }
    newRowNumbers.entries += 1;
    headers.forEach(header => {
        let newCell = document.createElement('td');
        let inputElement = null; // To hold any input/select element for validation purpose
        switch (header) {
            case 'number':
                newCell.textContent = `${newRowNumbers.entries}`;
                break;
            case 'teamName':
                inputElement = document.createElement('select');
                inputElement.className = "teamSelect";
                inputElement.required = true;
                break;
            case 'scheduleNumber':
                inputElement = document.createElement('input');
                inputElement.type = 'number';
                inputElement.className = 'scheduleNumber';
                inputElement.min = '1';
                inputElement.max = '999';
                inputElement.required = true;
                newCell.appendChild(inputElement);
                newCell.appendChild(document.createElement('div')).className = "category";
                newCell.lastChild.style.display = 'none';
                break;
            case 'scheduleDate':
            case 'eventCode':
            case 'eventName':
            case 'priceCode':
            case 'price':
                newCell.innerHTML = `<span class="${header}"></span>`;
                break;
            case 'riderName':
                inputElement = document.createElement('select');
                inputElement.className = 'riderSelect';
                inputElement.required = true;
                break;
            case 'riderRegNumber':
                newCell.innerHTML = `<span class="riderSelectRegNumber"></span>`;
                break;
            case 'horseName':
                inputElement = document.createElement('select');
                inputElement.className = 'horseSelect';
                inputElement.required = true;
                break;
            case 'horseRegNumber':
                newCell.innerHTML = `<span class="horseSelectRegNumber"></span>`;
                break;
            case 'comment':
                inputElement = document.createElement('textarea');
                inputElement.className = 'entryComment';
                inputElement.rows = '1';
                inputElement.cols = '15';
                inputElement.placeholder = '選択：2A、OP、等';
                break;
            default:
                newCell.textContent = '';
                break;
        }
        if (inputElement) {
            newCell.appendChild(inputElement);
        }
        newRow.appendChild(newCell);
    });
    table.appendChild(newRow);
    updateSelectOptions(); 
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
function validateAllInputs() {
    let isValid = true;
    const inputs = document.querySelectorAll('#entriesTableContainer input, #entriesTableContainer select, #entriesTableContainer textarea');
    inputs.forEach(input => {
        if (!input.value && input.required) {
            input.style.borderColor = 'red'; 
            isValid = false; 
        } else {
            input.style.borderColor = ''; 
        }
    });
    return isValid;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
async function loadEventCSV() {
    try {
        const response = await fetch('仮日程.csv'); 
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text();
        const lines = text.trim().split('\n');
        for (const line of lines) {
            const [scheduleNumber, scheduleDate, eventNumber, category, eventCode,
                  eventName, eventDescription, priceCode, price] = line.split(',');
            if (scheduleDate && scheduleNumber && eventName) {
                events[scheduleNumber.trim()] = {
                    scheduleDate: scheduleDate.trim(),
                    eventName: eventName.trim(),
                    category: category.trim(),
                    eventCode: eventCode.trim(),
                    eventDescription: eventDescription.trim(),
                    priceCode: priceCode.trim(),
                    price: parseFloat(price.trim())
                };
            }
        }
        console.log('Events loaded:', events); // For debugging purposes
    } catch (error) {
        console.error('Error loading the CSV file:', error);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
function updateSelectOptions() {
    const teamSelects = document.querySelectorAll('.teamSelect');
    teamSelects.forEach(select => {
        select.innerHTML = '';
        updatedData.teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.teamName;
            option.textContent = team.teamName;
            select.appendChild(option);
        });
        select.focus();
    });
    /////////////////////////////////////////////////////////////////////
    const scheduleNumbers = document.querySelectorAll('.scheduleNumber');
    scheduleNumbers.forEach(input => {
        input.addEventListener('input', function() {
            const parentElement = this.closest('.entriesTableContainer > table > tr'); // Find the closest parent container
            const scheduleNumber = this.value.trim();
            if (events[scheduleNumber]) {
                const eventData = events[scheduleNumber];
                parentElement.querySelector('.eventName').textContent = eventData.eventName;
                parentElement.querySelector('.scheduleDate').textContent = eventData.scheduleDate;
                parentElement.querySelector('.category').textContent = eventData.category;
                parentElement.querySelector('.eventCode').textContent = eventData.eventCode;
                parentElement.querySelector('.priceCode').textContent = eventData.priceCode;
                parentElement.querySelector('.price').textContent = eventData.price.toString();
            } else {
                parentElement.querySelector('.eventName'). textContent= '';
                parentElement.querySelector('.scheduleDate').textContent = '';
                parentElement.querySelector('.category').textContent = '';
                parentElement.querySelector('.eventCode').textContent = '';
                parentElement.querySelector('.priceCode').textContent = '';
                parentElement.querySelector('.price').textContent = '';
            }
        });
    });
    //////////////////////////////////////////////////////////////
    const riderSelects = document.querySelectorAll('.riderSelect');
    riderSelects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = ''; 
        updatedData.riders.forEach(rider => {
            const option = document.createElement('option');
            option.value = rider.riderName;
            option.textContent = rider.riderName;
            option.setAttribute('data-reg-number', rider.riderRegNumber);
            select.appendChild(option);
        });
        select.value = selectedValue; 
        select.addEventListener('change', function() {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption) {
                const regNumber = selectedOption.getAttribute('data-reg-number');
                const nextTableCell = select.parentElement.nextElementSibling;
                if (nextTableCell) {
                    const regNumberSpan = nextTableCell.querySelector('.riderSelectRegNumber');
                    if (regNumberSpan) {
                        regNumberSpan.textContent = regNumber;
                    } else {
                        //console.error('Reg number span not found in the next table cell');
                    }
                } else {
                    //console.error('Next table cell not found');
                }
            } else {
                //console.error('Selected option is undefined');
            }
        });
        const event = new Event('change');
        select.dispatchEvent(event);
    });
    //////////////////////////////////////////////////////////////
    const horseSelects = document.querySelectorAll('.horseSelect');
    horseSelects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = ''; 
        updatedData.horses.forEach(horse => {
            const option = document.createElement('option');
            option.value = horse.horseName;
            option.textContent = horse.horseName;
            option.setAttribute('data-reg-number', horse.horseRegNumber);
            select.appendChild(option);
        });
        select.value = selectedValue; 
        select.addEventListener('change', function() {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption) {
                const regNumber = selectedOption.getAttribute('data-reg-number');
                const nextTableCell = select.parentElement.nextElementSibling;
                if (nextTableCell) {
                    const regNumberSpan = nextTableCell.querySelector('.horseSelectRegNumber');
                    if (regNumberSpan) {
                        regNumberSpan.textContent = regNumber;
                    } else {
                        //console.error('Reg number span not found in the next table cell');
                    }
                } else {
                    //console.error('Next table cell not found');
                }
            } else {
                //console.error('Selected option is undefined');
            }
        });
        const event = new Event('change');
        select.dispatchEvent(event);
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//          [Create File Button] at bottom of Entries 

document.getElementById('updateDataWithEntriesButton').addEventListener('click', function() {
    //const entriesTableData = extractEntriesTableData();
    updatedData['entries'] = extractEntriesTableData();
    updatedData['fees'] = calculateFees();
    console.log('Updated Data With Entries:', updatedData);


    ////////////////////////////////////////////
    const tableContainer = document.getElementById('feesTableContainer');
    let feesTableHTML = `
        <h4>エントリー料 / Fees</h4>
        <table>
            <tr>
                <th>費用項目</th>
                <th>数</th>
                <th>金額</th>
            </tr>
            <tr>
                <td>馬登録料</td>
                <td>${updatedData.fees[0].count}</td>
                <td>${updatedData.fees[0].amount}</td>
            </tr>
            <tr>
                <td>公認競技</td>
                <td>${updatedData.fees[1].count}</td>
                <td>${updatedData.fees[1].amount}</td>
            </tr>
            <tr>
                <td>一般競技</td>
                <td>${updatedData.fees[2].count}</td>
                <td>${updatedData.fees[2].amount}</td>
            </tr>
            <tr>
                <td>一般競技 (フレンドシップ)</td>
                <td>${updatedData.fees[3].count}</td>
                <td>${updatedData.fees[3].amount}</td>
            </tr>
            <tr>
                <td>一般競技 (ジムカーナ)</td>
                <td>${updatedData.fees[4].count}</td>
                <td>${updatedData.fees[4].amount}</td>
            </tr>
            <tr>
                <td>一般競技 (クロス)</td>
                <td>${updatedData.fees[5].count}</td>
                <td>${updatedData.fees[5].amount}</td>
            </tr>
            <tr>
                <td>合計</td>
                <td></td>
                <td>${updatedData.fees[0].amount
                    +updatedData.fees[1].amount
                    +updatedData.fees[2].amount
                    +updatedData.fees[3].amount
                    +updatedData.fees[4].amount
                    +updatedData.fees[5].amount}</td>
            </tr>
        </table>
    `;
    //////////////////////////////////////////////////
    tableContainer.innerHTML = feesTableHTML;
    tableContainer.style.display = 'block';
    const downloadAndFinishButton = document.getElementById('downloadJsonAndFinishButton');
    downloadAndFinishButton.style.display = 'block';

});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function extractEntriesTableData() {
    const table = document.getElementById('entriesTableContainer').querySelector('table');
    const rows = table.querySelectorAll('tr');
    const entries = [];
    const headers = [
        "number",
        "teamName",
        "scheduleNumber",
        "scheduleDate",
        "eventCode",
        "eventName",
        "riderName",
        "riderRegNumber",
        "horseName",
        "horseRegNumber",
        "priceCode",
        "price",
        "comment",
        "category"
    ]
    Array.from(rows).slice(1).forEach(row => {
        const cells = row.querySelectorAll('td');
        const entry = {};
        let isRowValid = true;
        cells.forEach((cell, index) => {
            const header = headers[index];
            let value = '';
            const inputElement = cell.querySelector('input, select, textarea');
            const textElement = cell.querySelector('span, div');
            if (inputElement) {
                value = inputElement.value;
            } else if (textElement) {
                value = textElement.textContent;
            } else {
                value = cell.textContent; // Fallback to direct cell text content
            }
            value = value.trim();
            entry[header] = value;
            if (['teamName', 'scheduleNumber', 'riderName', 'horseName'].includes(header) && !value) {
                isRowValid = false; // Invalidate the row if any crucial field is empty
            }
        });
        entry['category'] = row.querySelector('.category').textContent;
        if (isRowValid) {
            entries.push(entry);
        }
    });
    return entries;
}

//////////////////////////////////////////////////////////////////////////////////////////////
function calculateFees() {
    let fees = [
        { 
            item: '馬',
            count: 0,
            amount: 0
        },
        {
            item: '公認',
            count: 0,
            amount: 0
        },
        { 
            item: '一般',
            count: 0,
            amount: 0
        },
        {
            item: 'フレンドシップ',
            count: 0,
            amount: 0
        },
        { 
            item: 'ジムカーナ',
            count: 0,
            amount: 0
        },
        {
            item: 'クロス',
            count: 0,
            amount: 0
        }
    ];
    const horseCounts = {};
    updatedData.entries.forEach(entry => {
        horseCounts[entry.horseName] = (horseCounts[entry.horseName] || 0) + 1;
        if (entry.priceCode == "公認") {
            fees[1].count += 1;
            fees[1].amount += parseFloat(entry.price);
        }
        if (entry.priceCode == "一般") {
            fees[2].count += 1;
            fees[2].amount = parseFloat(entry.price);
        }
        if (entry.priceCode == "フレンドシップ") {
            fees[3].count += 1;
            fees[3].amount = parseFloat(entry.price);
        }
        if (entry.priceCode == "ジムカーナ") {
            fees[4].count += 1;
            fees[4].amount = parseFloat(entry.price);
        }
        if (entry.priceCode == "クロス") {
            fees[5].count += 1;
            fees[5].amount = parseFloat(entry.price);
        }
    });
    fees[0].count = Object.keys(horseCounts).length;
    fees[0].amount = fees[0].count * price馬;
    return fees;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById('downloadJsonAndFinishButton').addEventListener('click', function() {
    downloadArrayAsJson(selectedFileName);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
function downloadArrayAsJson(filename) {
    const jsonString = JSON.stringify(updatedData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download.json';
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// // Example usage
// const data = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
// downloadArrayAsJson(data, 'users.json');




////////////////////////////////////////////////////////////////////////////////////////////////////////



