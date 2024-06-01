



// const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
// console.log(currentTimestampInSeconds); // Example output: 1653498845

let clubSelected = false;
let wasNewClubOptionSelected = false;
let newRowNumbers = { club: 0, teams: 0, horses: 0, riders: 0 };
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
        } else {
            codeInput.style.display = 'none';
            submitButton.style.display = 'none';
        }
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
    let newRowNumber = 0;
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
    const updatedData = {};
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

        // // Extract necessary information
        //const club = updatedData.club;// TableContainer;
        // const teams = data.teams;
        // const horses = data.horses;
        // const riders = data.riders;

        // // Call functions to display data in tables
        //displayClub(club, false);
        // displayTeams(teams);
        // displayHorses(horses);
        // displayRiders(riders);


    }
});



