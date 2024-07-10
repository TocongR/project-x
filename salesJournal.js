let api = "https://script.google.com/macros/s/AKfycbxmtcd_i-95KnjfIMlTxGISUdpgodKik9OW5xZYJRHQD3AKspUjqJ4hjIRPXVYTVByk/exec";
let form = document.querySelector("form");
let add = document.querySelector(".add");
let update = document.querySelector(".update");
let tbody = document.querySelector("tbody");
let tableSearch = document.querySelector(".gen-search");

const PASSWORD = "123"; 
let deleteId = null;

function addData() {
    if (!validateForm()) return;

    add.textContent = "Submitting..";
    let obj = {
        customer: form[0].value,
        sourceDoc: form[1].value,
        termDays: form[2].value,
        date: form[3].value,
        amount: form[4].value,
        type: form[5].value,
        particulars: form[6].value,
        discount: form[7].value,
        tin: form[8].value
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
    .then(dataSj => {
        let sjData = dataSj.sjData;
        let trtd = sjData.reverse().map(each => {
            // Formatting date to YYYY-MM-DD
            let formattedDate = new Date(each[4]).toLocaleDateString('en-CA'); // Assuming each[4] is the date field
            return `
                <tr>
                    <td class="customerData">${each[1]}</td>
                    <td class="sourceDocData">${each[2]}</td>
                    <td class="termDaysData">${each[3]}</td>
                    <td class="dateData">${formattedDate}</td>
                    <td class="amountData">${each[5]}</td>
                    <td class="typeData">${each[6]}</td>
                    <td class="particularsData">${each[7]}</td>
                    <td class="discountData">${each[8]}</td>
                    <td class="tinData">${each[9]}</td>
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

function delData(salesId) {
    const deleteBtn = document.querySelector(".delete");
    deleteBtn.textContent = "Deleting...";

    const url = api + `?del=true&salesId=${salesId}`;

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


function updateData(salesId) {
    if (!validateForm()) return;

    const updateBtn = document.querySelector(".update");
    updateBtn.textContent = "Updating..";

    fetch(api + `?update=true&salesId=${salesId}&customer=${form[0].value}&sourceDoc=${form[1].value}&termDays=${form[2].value}&date=${form[3].value}&amount=${form[4].value}&type=${form[5].value}&particulars=${form[6].value}&discount=${form[7].value}&tin=${form[8].value}`)
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
    .then(dataSj => {
        let sjData = dataSj.sjData;
        sjData.forEach(each => {
            let tin = each[9];
            if (tin === searchQuery) { 

                let formattedDate = new Date(each[4]).toLocaleDateString('en-CA');
                
                form.querySelector(".customer").value = each [1];
                form.querySelector(".sourceDoc").value = each[2];
                form.querySelector(".termDays").value = each[3];
                form.querySelector(".date").value = formattedDate;
                form.querySelector(".amount").value = each[5];
                form.querySelector(".type").value = each[6];
                form.querySelector(".particulars").value = each[7];
                form.querySelector(".discount").value = each[8];
                form.querySelector(".tin").value = each[9];
               
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
        const customer = row.querySelector('.customerData').textContent.toLowerCase();
        const sourceDoc = row.querySelector('.sourceDocData').textContent.toLowerCase();
        const termDays = row.querySelector('.termDaysData').textContent.toLowerCase();
        const date = row.querySelector('.dateData').textContent.toLowerCase();
        const amount = row.querySelector('.amountData').textContent.toLowerCase();
        const type = row.querySelector('.typeData').textContent.toLowerCase();
        const particulars = row.querySelector('.particularsData').textContent.toLowerCase();
        const discount = row.querySelector('.discountData').textContent.toLowerCase();
        const tin = row.querySelector('.tinData').textContent.toLowerCase();
        

        if (customer.includes(searchQuery) || sourceDoc.includes(searchQuery) || termDays.includes(searchQuery) || date.includes(searchQuery) || amount.includes(searchQuery) || type.includes(searchQuery) || particulars.includes(searchQuery) || discount.includes(searchQuery) || tin.includes(searchQuery)) {
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

    // Adjust endDate to include records on the same day by setting it to the next day
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1); // Move to the next day
    const endDay = nextDay.toISOString().split('T')[0]; // Format to YYYY-MM-DD

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


