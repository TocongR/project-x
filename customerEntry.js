let api = "https://script.google.com/macros/s/AKfycbxmtcd_i-95KnjfIMlTxGISUdpgodKik9OW5xZYJRHQD3AKspUjqJ4hjIRPXVYTVByk/exec";
let form = document.querySelector("form");
let add = document.querySelector(".add");
let update = document.querySelector(".update");
let tbody = document.querySelector("tbody");

const PASSWORD = "123"; 
let deleteId = null;

function addData() {
    if (!validateForm()) return;

    add.textContent = "Submitting..";
    let obj = {
        tinCde: form[0].value,
        nameCde: form[1].value,
        addressCde: form[2].value,
        registrationCde: form[3].value,
        contactNoCde: form[4].value,
        dateCde: (form[5].value)
    };

    fetch(api, {
        method: "POST",
        body: JSON.stringify(obj)
    })
    .then(res => res.text())
    .then(() => {
        readData();
        add.textContent = "Submit";
        form.reset();
        document.getElementById("error-message").style.display = "none";
    });
}

function readData() {
    fetch(api)
    .then(res => res.json())
    .then(dataCde => {
        let cdeData = dataCde.cdeData;
        let trtd = cdeData.reverse().map(each => {
            let formattedDate = new Date(each[6]).toLocaleDateString('en-CA'); // YYYY-MM-DD
            return `
                <tr>
                    <td class="tinData">${each[1]}</td>
                    <td class="nameData">${each[2]}</td>
                    <td class="addressData">${each[3]}</td>
                    <td class="registrationData">${each[4]}</td>
                    <td class="contactData">${each[5]}</td>
                    <td class="dateData">${formattedDate}</td>
                </tr>
            `;
        });
        tbody.innerHTML = trtd.join("");
    });
}

readData();

function showModal(id) {
    deleteId = id;
    document.getElementById('myModal').style.display = "block";
}

function hideModal() {
    document.getElementById('myModal').style.display = "none";
    document.getElementById('modalPassword').value = '';
    document.getElementById('errorMessage').style.display = 'none';
    deleteId = null;
}

document.querySelector('.close').onclick = hideModal;
document.querySelector('#modalSubmit').onclick = function() {
    let password = document.getElementById('modalPassword').value;
    if (password === PASSWORD) {
        delData(deleteId);
        hideModal();
    } else {
        document.getElementById('errorMessage').style.display = 'block';
    }
};

function delData(customerId) {
    const deleteBtn = document.querySelector(".delete");
    deleteBtn.textContent = "Deleting...";

    const url = api + `?del=true&customerId=${customerId}`;

    fetch(url)
        .then(res => res.text())
        .then(() => {
            readData();
            form.reset();
            deleteBtn.textContent = "Delete";
        });
}

function updateData(customerId) {
    if (!validateForm()) return;

    const updateBtn = document.querySelector(".update");
    updateBtn.textContent = "Updating..";

    fetch(api + `?update=true&customerId=${customerId}&tin=${form[0].value}&name=${form[1].value}&address=${form[2].value}&registration=${form[3].value}&contact=${form[4].value}&date=${new Date(form[5].value).toISOString().split('T')[0]}`)
    .then(res => res.text())
    .then(() => {
        readData();
        form.reset();
        updateBtn.textContent = "Update";
    });
}

function validateForm() {
    if (form[0].value.trim() === '' || form[1].value.trim() === '' || form[2].value.trim() === '' || form[3].value.trim() === '' || form[4].value.trim() === '') {
        alert("All fields are Required!!");
        return false;
    }
    errorMessage.style.display = "none";
    return true;
}

function searchExactData() {
    const searchBtn = document.querySelector(".searchbtnID");
    searchBtn.innerHTML = "Searching...";
    
    const searchQuery = document.getElementById('searchQuery').value;
    let found = false;

    fetch(api)
    .then(res => res.json())
    .then(dataCde => {
        let cdeData = dataCde.cdeData;
        cdeData.forEach(each => {
            let tin = each[1];
            if (tin === searchQuery) { 

                let formattedDate = new Date(each[6]).toLocaleDateString('en-CA');
                
                form.querySelector(".tin").value = each[1];
                form.querySelector(".name").value = each[2];
                form.querySelector(".address").value = each[3];
                form.querySelector(".registration").value = each[4];
                form.querySelector(".contact").value = each[5];
                form.querySelector(".date").value = formattedDate;
               
                form.querySelector(".update").style.display = "inline";
                form.querySelector(".delete").style.display = "inline";

                form.querySelector(".update").setAttribute("onclick", `updateData(${each[0]})`);
                form.querySelector(".delete").setAttribute("onclick", `showModal(${each[0]})`);

                found = true;
                return;
            }
        });

        if (!found) {
            alert("No matching record found.");
        }
    })
    .finally(() => {
        searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    });
}

document.querySelector('.searchbtnID').onclick = searchExactData;

function searchGenData() {
    const searchQuery = document.getElementById('searchGenQuery').value.toLowerCase().trim();
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        const name = row.querySelector('.nameData').textContent.toLowerCase();
        const address = row.querySelector('.addressData').textContent.toLowerCase();
        const registration = row.querySelector('.registrationData').textContent.toLowerCase();
        const contact = row.querySelector('.contactData').textContent.toLowerCase();
        const date = row.querySelector('.dateData').textContent.toLowerCase();

        if (name.includes(searchQuery) || address.includes(searchQuery) || registration.includes(searchQuery) || contact.includes(searchQuery) || date.includes(searchQuery)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updateTimestamp() {
    const timestampElement = document.getElementById('timestamp');
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const formattedTime = now.toLocaleDateString('en-US', options);
    timestampElement.textContent = formattedTime;
}
setInterval(updateTimestamp, 1000);

updateTimestamp();

function searchDateRange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const endDay = nextDay.toISOString().split('T')[0];

    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        const dateData = row.querySelector('.dateData').textContent.trim();
        const rowDate = new Date(dateData);

        if (rowDate >= new Date(startDate) && rowDate < new Date(endDay)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function resetTable() {
    document.getElementById('searchQuery').value = '';

    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.style.display = '';
    });

   
}
