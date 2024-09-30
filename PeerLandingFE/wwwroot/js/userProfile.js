async function fetchUserProfile() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`/ApiMstUser/GetUserData`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            alert('Failed to fetch user profile');
            return;
        }

        const jsonData = await response.json();

        if (jsonData.success) {
            const user = jsonData.data;
            document.getElementById('userId').innerText = user.id;
            document.getElementById('userName').innerText = user.name;
            document.getElementById('userRole').innerText = user.role;
            document.getElementById('userBalance').innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(user.balance);
        } else {
            alert('No user data found');
        }
    } catch (error) {
        alert("An error occurred. Please try again. " + error.message);
    }
}

async function fetchUserCashFlow(pageNumber = 1, pageSize = 10) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`/ApiMstUser/GetUserCashFlow?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            alert('Failed to fetch cash flow');
            return;
        }

        const jsonData = await response.json();

        if (jsonData.success) {
            const cashFlowRecords = jsonData.data.records;
            const cashFlowTable = document.getElementById('cashFlowTable');
            cashFlowTable.innerHTML = '';
            let i = 1;
            cashFlowRecords.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${i++}</td>
                    <td>${record.description}</td>
                    <td>${record.type}</td>
                    <td>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(record.amount)}</td>
                    <td>${new Date(record.createdAt).toLocaleString()}</td>
                `;
                cashFlowTable.appendChild(row);
            });

            populatePagination(jsonData.data.totalRecords, pageNumber, pageSize);
        } else {
            alert('No cash flow records found');
        }
    } catch (error) {
        alert("An error occurred. Please try again. " + error.message);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    await fetchUserProfile();
    await fetchUserCashFlow(1, 10); 
});

function populatePagination(totalRecords, pageNumber, pageSize) {
    const totalPages = Math.ceil(totalRecords / pageSize);
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    const prevPage = document.createElement('li');
    prevPage.classList.add('page-item');
    if (pageNumber === 1) prevPage.classList.add('disabled');
    prevPage.innerHTML = `
      <a class="page-link" href="#" aria-label="Previous" onclick="fetchUserCashFlow(${pageNumber - 1}, ${pageSize})">
        <span aria-hidden="true">&laquo;</span>
      </a>`;
    pagination.appendChild(prevPage);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (pageNumber === i) {
            li.classList.add('active');
            li.style.backgroundColor = '#f0f0f0';
        }
        li.innerHTML = `<a class="page-link" href="#" onclick="fetchUserCashFlow(${i}, ${pageSize})">${i}</a>`;
        pagination.appendChild(li);
    }

    const nextPage = document.createElement('li');
    nextPage.classList.add('page-item');
    if (pageNumber === totalPages) nextPage.classList.add('disabled');
    nextPage.innerHTML = `
      <a class="page-link" href="#" aria-label="Next" onclick="fetchUserCashFlow(${pageNumber + 1}, ${pageSize})">
        <span aria-hidden="true">&raquo;</span>
      </a>`;
    pagination.appendChild(nextPage);
}

async function submitTopUp() {
    const amount = document.getElementById('topUpAmount').value;
    const token = localStorage.getItem('token');

    const body = {
        amount: parseFloat(amount),
        description: "TopUp"
    };

    try {
        const response = await fetch('/ApiMstUser/TopUp', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        console.log(response);

        if (response.ok) {
            alert('TopUp successful!');
            location.reload();
        } else {
            alert('TopUp failed.');
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
}

async function submitWithdrawal() {
    const amount = document.getElementById('withdrawalAmount').value;
    const token = localStorage.getItem('token');

    const body = {
        amount: parseFloat(amount) * -1,
        description: "Withdrawal"
    };

    try {
        const response = await fetch('/ApiMstUser/Withdrawal', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            alert('Withdrawal successful!');
            location.reload();
        } else {
            alert('Withdrawal failed.');
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
}