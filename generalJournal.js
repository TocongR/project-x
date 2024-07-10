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
        supplierGj: form[0].value,
        amountGj: form[1].value,
        sourceDocGj: form[2].value,
        particularsGj: form[3].value,
        termDaysGj: form[4].value,
        dateGj: form[5].value,
        accountGj: form[6].value,
        tinGj: form[7].value
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
    .then(dataGj => {
        let gjData = dataGj.gjData;
        let trtd = gjData.reverse().map(each => {
            let formattedDate = new Date(each[6]).toLocaleDateString('en-CA');
            return `
                <tr>
                    <td class="supplierData">${each[1]}</td>
                    <td class="amountData">${each[2]}</td>
                    <td class="sourceDocData">${each[3]}</td>
                    <td class="particularsData">${each[4]}</td>
                    <td class="termDaysData">${each[5]}</td>
                    <td class="dateData">${formattedDate}</td>
                    <td class="accountData">${each[7]}</td>
                    <td class="tinData">${each[8]}</td>
                    
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

function delData(generalId) {
    const deleteBtn = document.querySelector(".delete");
    deleteBtn.textContent = "Deleting...";

    const url = api + `?del=true&generalId=${generalId}`;

    fetch(url)
        .then(res => res.text())
        .then(() => {
            readData();
            form.reset();
            deleteBtn.textContent = "Delete";
        });
}

/*
function updateCall(elm, id) {
   
    let custom = elm.parentElement.querySelector().textContent;
    form[0].value = tin;

    let customer = elm.parentElement.querySelector(".customerData").textContent;
    form[1].value = customer;

    let address = elm.parentElement.querySelector(".addressData").textContent;
    form[2].value = address;

    let registration = elm.parentElement.querySelector(".registrationData").textContent;
    form[3].value = registration;

    let date = elm.parentElement.querySelector(".dateData").textContent;
    form[4].value = date;


    update.setAttribute("onclick", `updateData(${id})`);
}
    */  


function updateData(generalId) {
    if (!validateForm()) return;

    const updateBtn = document.querySelector(".update");
    updateBtn.textContent = "Updating..";

    fetch(api + `?update=true&generalId=${generalId}&supplier=${form[0].value}&amount=${form[1].value}&sourceDoc=${form[2].value}&particulars=${form[3].value}&termDays=${form[4].value}&date=${form[5].value}&account=${form[6].value}&tin=${form[7].value}`)
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
/*
function searchData() {
    const searchQuery = document.getElementById('searchQuery').value;
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {

        const tin = row.querySelector('.tinData');
        const name = row.querySelector('.nameData');
        const address = row.querySelector('.addressData');
        const registration = row.querySelector('.registrationData');
        const contactNo = row.querySelector('.contactData');

        if (tin.includes(searchQuery) || (name.includes(searchQuery) || address.includes(searchQuery) || registration.includes(searchQuery) || contactNo.includes(searchQuery))) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
    */

function searchExactData() {
    const searchBtn = document.querySelector(".searchbtnID");
    searchBtn.innerHTML = "Searching...";
    
    const searchQuery = document.getElementById('searchQuery').value;
    let found = false;

    fetch(api)
    .then(res => res.json())
    .then(dataGj => {
        let gjData = dataGj.gjData;
        gjData.forEach(each => {
            let tin = each[8];
            if (tin === searchQuery) { 

                let formattedDate = new Date(each[6]).toLocaleDateString('en-CA');
                
                form.querySelector(".supplier").value = each [1];
                form.querySelector(".amount").value = each[2];
                form.querySelector(".sourceDoc").value = each[3];
                form.querySelector(".particulars").value = each[4];
                form.querySelector(".termDays").value = each[5];
                form.querySelector(".date").value = formattedDate;
                form.querySelector(".account").value = each[7];
                form.querySelector(".tin").value = each[8];
               
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
        const supplier = row.querySelector('.supplierData').textContent.toLowerCase();
        const amount = row.querySelector('.amountData').textContent.toLowerCase();
        const sourceDoc = row.querySelector('.sourceDocData').textContent.toLowerCase();
        const particulars = row.querySelector('.particularsData').textContent.toLowerCase();
        const termDays = row.querySelector('.termDaysData').textContent.toLowerCase();
        const date = row.querySelector('.dateData').textContent.toLowerCase();
        const account = row.querySelector('.accountData').textContent.toLowerCase();
        const tin = row.querySelector('.tinData').textContent.toLowerCase();
        

        if (supplier.includes(searchQuery) || amount.includes(searchQuery) || sourceDoc.includes(searchQuery) || particulars.includes(searchQuery) || termDays.includes(searchQuery) || date.includes(searchQuery) || account.includes(searchQuery) ||  tin.includes(searchQuery)) {
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
    })
}