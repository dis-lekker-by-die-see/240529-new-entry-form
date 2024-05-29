// document.addEventListener("DOMContentLoaded", function() {
//     fetch('json_files_list.json')
//         .then(response => response.json())
//         .then(clubData => {
//             const clubSelect = document.getElementById('clubSelect');
//             const codeLabel = document.getElementById('codeLabel');
//             const codeInput = document.getElementById('codeInput');
//             const submitButton = document.getElementById('submitButton');
//             const resultDiv = document.getElementById('result');

//             // Populate the select element with club names
//             clubData.forEach(club => {
//                 const option = document.createElement('option');
//                 option.value = club.clubName;
//                 option.textContent = club.clubName;
//                 clubSelect.appendChild(option);
//             });

//             // Add 'not in list' option
//             const notInListOption = document.createElement('option');
//             notInListOption.value = "not-in-list";
//             notInListOption.textContent = "Not in list";
//             clubSelect.appendChild(notInListOption);

//             // Event listener for club selection
//             clubSelect.addEventListener('change', function() {
//                 const selectedClub = clubSelect.value;
//                 if (selectedClub === "not-in-list") {
//                     resultDiv.innerHTML = "You selected 'Not in list'. Please contact support.";
//                     codeLabel.style.display = 'none';
//                     codeInput.style.display = 'none';
//                     submitButton.style.display = 'none';
//                 } else if (selectedClub !== "") {
//                     codeLabel.style.display = 'block';
//                     codeInput.style.display = 'block';
//                     submitButton.style.display = 'block';
//                 } else {
//                     codeLabel.style.display = 'none';
//                     codeInput.style.display = 'none';
//                     submitButton.style.display = 'none';
//                 }
//             });

//             // Event listener for submit button
//             submitButton.addEventListener('click', function() {
//                 const selectedClub = clubSelect.value;
//                 const inputCode = codeInput.value;
//                 const club = clubData.find(club => club.clubName === selectedClub);

//                 if (club && parseInt(inputCode) === club.code) {
//                     resultDiv.innerHTML = `Welcome to the next step for ${selectedClub}!`;
//                     resultDiv.style.color = 'green';
//                     codeLabel.style.display = 'none';
//                     codeInput.style.display = 'none';
//                     submitButton.style.display = 'none';
//                     clubSelect.style.display = 'none';
//                 } else {
//                     resultDiv.innerHTML = "Incorrect code. Please try again.";
//                     resultDiv.style.color = 'red';
//                 }
//             });
//         })
//         .catch(error => console.error('Error fetching the JSON file:', error));
// });

document.addEventListener("DOMContentLoaded", function() {
    const clubData = [
        {
            "fileName": "/Users/user1/Barrabas/AA-Git/240529-new-entry-form/蒜山ホースパーク_8769.json",
            "clubName": "蒜山ホースパーク",
            "code": 8769
        },
        {
            "fileName": "/Users/user1/Barrabas/AA-Git/240529-new-entry-form/大山乗馬センター_1234.json",
            "clubName": "大山乗馬センター",
            "code": 1234
        }
    ];

    const clubSelect = document.getElementById('clubSelect');
    const codeLabel = document.getElementById('codeLabel');
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
            resultDiv.innerHTML = "You selected 'Not in list'. Please contact support.";
            codeLabel.style.display = 'none';
            codeInput.style.display = 'none';
            submitButton.style.display = 'none';
        } else if (selectedClub !== "") {
            codeLabel.style.display = 'block';
            codeInput.style.display = 'block';
            submitButton.style.display = 'block';
        } else {
            codeLabel.style.display = 'none';
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
            resultDiv.innerHTML = `Welcome to the next step for ${selectedClub}!`;
            resultDiv.style.color = 'green';
            codeLabel.style.display = 'none';
            codeInput.style.display = 'none';
            submitButton.style.display = 'none';
            clubSelect.style.display = 'none';
        } else {
            resultDiv.innerHTML = "Incorrect code. Please try again.";
            resultDiv.style.color = 'red';
        }
    });
});
