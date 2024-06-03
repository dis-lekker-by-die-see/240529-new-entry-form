



// const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
// console.log(currentTimestampInSeconds); // Example output: 1653498845

let clubSelected = false;
let wasNewClubOptionSelected = false;
let updatedData = {};
let newRowNumbers = { club: 0, teams: 0, horses: 0, riders: 0, entries: 1 };
let events = {};
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

            fetchAndParseJSON(club.fileName, true);

        } else {
            codeInput.style.border = '2px solid red';
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
    let tableHTML = `<h2>団体・乗馬クラブ / Organization・Riding Club</h2>`;
    if (wasNewClubOptionSelected) {
        tableHTML += `<p>
        下記のフォームを使用して、クラブの詳細、チーム、馬、選手を追加してください。
        <br>
        注意：新しいデータはここには保存されません。このフォームは、ダウンロード可能なファイルを生成し、そのファイルをメールで協会に送信する必要があります。
        <br>
        重要：ページをリフレッシュまたは再読み込みすると、すべての変更と新しいデータが失われます。
        </p>`;
    } else {
        tableHTML += `<p>
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
    let tableHTML = `<h4>チーム(所属) / Teams</h4>`;
    tableHTML += `<p>
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
    let tableHTML = `<h4>馬 / Horses</h4><table><tr><th>番</th><th>馬名</th><th>フリガナ</th><th>登録番号</th><th>性別</th><th>年齢</th><th>毛色</th><th>品種</th><th>産地</th><th>所有者</th>`;
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
    let tableHTML = `<h4>選手 / Riders</h4><table><tr><th>番</th><th>選手名</th><th>フリガナ</th><th>登録番号</th><th>性別</th>`;
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
/////////////////////////////////////////////////////
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

    // Change the '追加' button to 'Update Table'
    const addButton = tableContainer.querySelector('.addRowButton');
    addButton.textContent = '更新';
    if (containerId === 'clubTableContainer') {
        //newRowNumbers.club += 1;
    } else if (containerId === 'teamsTableContainer') {
        console.log(newRowNumbers.teams);
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
            rows = Array.from(table.rows).slice(2); // Skip the header row dummy info row
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
        console.log('Updated Data:', updatedData);


        clubInfoContainer.style.display = 'none';        

        const entriesContainer = document.getElementById('entriesContainer');
        entriesContainer.style.display = 'block';
        displayEntries(true);


        loadEventCSV();
        
        // const eventForm = document.getElementById('eventForm');
        // const addEntryButton = document.getElementById('addEntryButton');
        // eventForm.style.display = 'block';
        // addEntryButton.style.display = 'block';

        
       

        
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//          Entries 
function displayEntries(canEdit) {
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
    tableHTML += `<button id="addEntryRow" class="addEntryRowButton" 
    data-headers="number,teamName,scheduleNumber,scheduleDate,eventCode,eventName,riderName,riderRegNumber,horseName,horseRegNumber,priceCode,price,comment">追加</button>`;
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

        // Add validation event listener if inputElement exists
        // if (inputElement && inputElement.tagName !== 'SPAN') {
        //     inputElement.addEventListener('change', () => validateCell(inputElement));
        // }

        newRow.appendChild(newCell);
    });

    table.appendChild(newRow);
    updateSelectOptions(); // Assuming this function populates select options
}

// Validation function to check the input and apply styles if necessary
// function validateCell(input) {
//     if (!input.value && input.required) {
//         input.style.borderColor = 'red'; // Apply red border if invalid
//     } else {
//         input.style.borderColor = ''; // Remove border if valid
//     }
// }
function validateAllInputs() {
    let isValid = true;
    const inputs = document.querySelectorAll('#entriesTableContainer input, #entriesTableContainer select, #entriesTableContainer textarea');
    
    inputs.forEach(input => {
        if (!input.value && input.required) {
            input.style.borderColor = 'red'; // Apply red border if invalid
            isValid = false; // Set isValid to false if any input is invalid
        } else {
            input.style.borderColor = ''; // Remove border if valid
        }
    });

    return isValid;
}




// ///////////////////////////////
// function addEntryRow(headers) {  
//     const tableContainer = document.getElementById('entriesTableContainer');
//     const table = tableContainer.querySelector('table');
//     const newRow = document.createElement('tr');
//     headers.forEach(header => {
//         let newCell = document.createElement('td');
//         if (header === 'number') {
//             newCell.innerHTML = `${newRowNumbers.entries}`;
//         } else if (header === 'teamName') {
//             newCell.innerHTML = `<select class="teamSelect" required></select>`;
//         } else if (header === 'scheduleNumber') {
//             newCell.innerHTML = `<input type="number" class="scheduleNumber" min="1" max="999" required>
//                                 <div class="category" style="display: none;"></div>`;
//         } else if (header === 'scheduleDate') {
//             newCell.innerHTML = `<span class="scheduleDate"></span>`;
//         } else if (header === 'eventCode') {
//             newCell.innerHTML = `<span class="eventCode"></span>`;
//         } else if (header === 'eventName') {
//             newCell.innerHTML = `<span class="eventName"></span>`;
//         } else if (header === 'priceCode') {
//             newCell.innerHTML = `<span class="priceCode"></span>`;
//         } else if (header === 'price') {
//             newCell.innerHTML = `<span class="price"></span>`;
//         } else if (header === 'riderName') {
//             newCell.innerHTML = `<select class="riderSelect" required></select>`;
//         } else if (header === 'riderRegNumber') {
//             newCell.innerHTML = `<span class="riderSelectRegNumber"></span>`;
//         } else if (header === 'horseName') {
//             newCell.innerHTML = `<select class="horseSelect" required></select>`;
//         } else if (header === 'horseRegNumber') {
//             newCell.innerHTML = `<span class="horseSelectRegNumber"></span>`;
//         } else if (header === 'comment') {
//             newCell.innerHTML = `<textarea class="entryComment" rows="1" cols="15" placeholder="選択：2A、OP、等"></textarea>`;
//             //newCell.setAttribute('contenteditable', 'true');
//         } else {
//             newCell.innerHTML = ``;
//         }
//         newRow.appendChild(newCell);
//     });
//     table.appendChild(newRow);
//     updateSelectOptions();

//     // Change the '追加' button to 'Update Table'
//     const addButton = tableContainer.querySelector('.addEntryRowButton');
//     addButton.textContent = '更新';
//     newRowNumbers.entries += 1;
//     addButton.removeEventListener('click', handleAddEntryRow);
//     addButton.addEventListener('click', () => {
//         if (validateRow(newRow)) {
//             addButton.textContent = '追加';
//             addButton.addEventListener('click', handleAddEntryRow);
//         } else {
//             alert('Please fill in all cells.');
//         }
//     });
// }


///////////////////////////////////////////////////////////////////////////////////////////////////////
async function loadEventCSV() {
    try {
        const response = await fetch('仮日程.csv'); // Make sure the path is correct
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text();
        const lines = text.trim().split('\n');
        //const events = {}; // This assumes 'events' is not already declared elsewhere
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
///////////////////////////////////////////////////////////////////////////////////////////////////
function displayEntryForm(updatedData) {
    document.getElementById('addEntryButton').addEventListener('click', function() {
        //const entryContainer = document.getElementById('eventForm');
        const eventForm = document.getElementById('eventForm');
        const entryContainer = eventForm.querySelector('.entry-container'); 
        const lastEntry = entryContainer ? entryContainer.lastElementChild : null;
        const errorMessage = document.getElementById('error-message-entry');

        if (lastEntry) {
            const inputs = lastEntry.querySelectorAll('input[required], select[required]');
            const isValid = validateLastInputs(inputs, errorMessage);
            if (!isValid) {
                return;
            }
        }
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';
        const entryNumber = document.querySelectorAll('.entry').length + 1;
        // let charDisplayId = 'entryNumberCharDisplay' + (entryNumber - 1);
        // const entryNumberCharDisplay = document.getElementById(charDisplayId);
        // if (entryNumberCharDisplay) {
        //     entryNumberCharDisplay.textContent = 'C'.repeat(entryNumber - 1);
        // }
        // charDisplayId = 'entryNumberCharDisplay' + (entryNumber);
        entryDiv.innerHTML = `
            
            <div class="entryNumberLine">
                <div class="entryNumber">${entryNumber}</div>
            </div>

            <div class="entry-fields">
                <div>
                    <label for="scheduleNumber">競技番号</label>
                    <input type="number" class="scheduleNumber" min="1" max="999" required>
                    <span class="eventInfoDisplay"></span>
                    <div class="scheduleDate" style="display: none;"></div>
                    <div class="category" style="display: none;"></div>
                    <div class="eventCode" style="display: none;"></div>
                    <div class="eventName" style="display: none;"></div>
                    <div class="priceCode" style="display: none;"></div>
                    <div class="price" style="display: none;"></div>
                </div>
                <div>
                    <label for="teamSelect">所属</label>
                    <select class="teamSelect" required></select>
                </div>
                <div>
                    <label for="riderSelect">選手名</label>
                    <select class="riderSelect" required></select>
                    <div class="riderSelectRegNumber" style="display: none;"></div>
                </div>
                <div>
                    <label for="horseSelect">馬名</label>
                    <select class="horseSelect" required></select>
                    <div class="horseSelectRegNumber" style="display: none;"></div>
                </div>
                <div>
                    <label for="entryComment">備考</label>
                    <textarea class="entryComment" rows="1" placeholder="選択馬場種目名：2A、OP、等"></textarea>
                </div>
            </div>
        `;
        // if (!entryContainer) {
        //     const newEntryContainer = document.createElement('div');
        //     newEntryContainer.className = 'entry'; //-container
        //     eventForm.appendChild(newEntryContainer);
        //     newEntryContainer.appendChild(entryDiv);
        // } else {
        //     entryContainer.appendChild(entryDiv);
        // }

        entryContainer.appendChild(entryDiv);
        updateSelectOptions(updatedData);
    });
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
    });
    /////////////////////////////////////////////////////////////////////
    const scheduleNumbers = document.querySelectorAll('.scheduleNumber');
    scheduleNumbers.forEach(input => {
        input.addEventListener('input', function() {
            const parentElement = this.closest('.entriesTableContainer > table > tr'); // Find the closest parent container
            
            //const parentElement = this.closest('.entryNumberLine'); // Find the closest parent container
            //const parentElement = this.closest('.entry-fields'); // Find the closest parent container
            const scheduleNumber = this.value.trim();
            
            if (events[scheduleNumber]) {
                const eventData = events[scheduleNumber];
                //parentElement.querySelector('.eventInfoDisplay').textContent = `${eventData.scheduleDate} : ${eventData.eventCode} : ${eventData.eventName}`; //(${eventData.priceCode})
                parentElement.querySelector('.eventName').textContent = eventData.eventName;
                parentElement.querySelector('.scheduleDate').textContent = eventData.scheduleDate;
                parentElement.querySelector('.category').value = eventData.category;
                parentElement.querySelector('.eventCode').textContent = eventData.eventCode;
                parentElement.querySelector('.priceCode').textContent = eventData.priceCode;
                parentElement.querySelector('.price').textContent = eventData.price.toString();
            } else {
                //parentElement.querySelector('.eventInfoDisplay').textContent = 'Event not found';
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
        select.innerHTML = ''; // Clear previous options
        updatedData.riders.forEach(rider => {
            const option = document.createElement('option');
            option.value = rider.riderName;
            option.textContent = rider.riderName;
            option.setAttribute('data-reg-number', rider.riderRegNumber);
            select.appendChild(option);
        });
        select.value = selectedValue; // Restore the selected value
        // Set up the change event listener
        select.addEventListener('change', function() {
            // Get the currently selected option
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption) {
                // Get registration number from the selected option
                const regNumber = selectedOption.getAttribute('data-reg-number');
                // Navigate to the next table cell from the current cell (parent of select)
                const nextTableCell = select.parentElement.nextElementSibling;
                if (nextTableCell) {
                    // Find the span within the next table cell
                    const regNumberSpan = nextTableCell.querySelector('.riderSelectRegNumber');
                    if (regNumberSpan) {
                        regNumberSpan.textContent = regNumber;
                    } else {
                        console.error('Reg number span not found in the next table cell');
                    }
                } else {
                    console.error('Next table cell not found');
                }
            } else {
                console.error('Selected option is undefined');
            }
        });
        // Manually trigger the change event to initialize the display
        const event = new Event('change');
        select.dispatchEvent(event);
    });
    //////////////////////////////////////////////////////////////
    const horseSelects = document.querySelectorAll('.horseSelect');
    horseSelects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = ''; // Clear previous options
        updatedData.horses.forEach(horse => {
            const option = document.createElement('option');
            option.value = horse.horseName;
            option.textContent = horse.horseName;
            option.setAttribute('data-reg-number', horse.horseRegNumber);
            select.appendChild(option);
        });
        select.value = selectedValue; // Restore the selected value
        // Set up the change event listener
        select.addEventListener('change', function() {
            // Get the currently selected option
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption) {
                // Get registration number from the selected option
                const regNumber = selectedOption.getAttribute('data-reg-number');
                // Navigate to the next table cell from the current cell (parent of select)
                const nextTableCell = select.parentElement.nextElementSibling;
                if (nextTableCell) {
                    // Find the span within the next table cell
                    const regNumberSpan = nextTableCell.querySelector('.horseSelectRegNumber');
                    if (regNumberSpan) {
                        regNumberSpan.textContent = regNumber;
                    } else {
                        console.error('Reg number span not found in the next table cell');
                    }
                } else {
                    console.error('Next table cell not found');
                }
            } else {
                console.error('Selected option is undefined');
            }
        });
        // Manually trigger the change event to initialize the display
        const event = new Event('change');
        select.dispatchEvent(event);
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
// function validateLastInputs(inputs, errorMessage) {
//     let isValid = true;
//     inputs.forEach(input => {
//         if (!input.value) {
//             isValid = false;
//             errorMessage.textContent = "Please fill out all required fields.";
//         }
//     });
//     return isValid;
// }



