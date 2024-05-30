



// const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
// console.log(currentTimestampInSeconds); // Example output: 1653498845


//*///////////////////////////////////////////////////////////////////////////////////////////////////////
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
            entriesFromNewClub();
            
        } else if (selectedClub !== "") {
            codeInput.style.display = 'block';
            //codeInput.style.padding = '1.5%'
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
            entriesFromExistingClub(selectedClub);

            
        } else {
            resultDiv.innerHTML = "もう一度";
            resultDiv.style.color = 'red';
        }
    });
}


function entriesFromExistingClub(selectedClub) {
    const tempmessage = document.createElement('div');
    tempmessage.innerHTML = `${selectedClub} was selected`
}

function entriesFromNewClub() {
    const tempmessage = document.createElement('div');
    tempmessage.innerHTML = `Make new club`
}