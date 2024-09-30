async function fetchLoanDetail(loanId) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`/ApiMstLoan/GetLoanById?loanId=${loanId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.log(response);
            showAlert('Failed to fetch loans', 'danger');
            return;
        }

        const jsonData = await response.json();

        if (jsonData.success) {
            const loan = jsonData.data;
            document.getElementById('loan-id').innerText = loan.id;
            document.getElementById('amount').innerText = loan.amount.toLocaleString();
            document.getElementById('interest-rate').innerText = loan.interestRate;
            document.getElementById('total-repaid').innerText = loan.totalRepaid.toLocaleString();
            document.getElementById('duration').innerText = loan.duration;
            document.getElementById('status').innerText = loan.status.charAt(0).toUpperCase() + loan.status.slice(1);
            document.getElementById('created-at').innerText = new Date(loan.createdAt).toLocaleString();
            document.getElementById('updated-at').innerText = new Date(loan.updatedAt).toLocaleString();

            document.getElementById('borrower-name').innerText = loan.borrower.name;
            document.getElementById('borrower-role').innerText = loan.borrower.role;

            document.getElementById('lender-name').innerText = loan.lender ? loan.lender.name : '-';
            document.getElementById('lender-role').innerText = loan.lender ? loan.lender.role : '-';
        } else {
            showAlert('No loans found', 'warning');
        }
    } catch (error) {
        showAlert("An error occurred. Please try again: " + error.message, 'danger');
    }
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                                    ${message}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
}

document.addEventListener('DOMContentLoaded', function () {
    fetchLoanDetail(loanId);
});

async function fetchLoanRepayment(loanId, pageNumber = 1, pageSize = 12, status = "all") {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`/ApiMstLoan/GetLoanRepayment?loanId=${loanId}&pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.log(response);
            showAlert('Failed to fetch loan repayments', 'danger');
            return;
        }

        const jsonData = await response.json();

        if (jsonData.success) {
            const repayments = jsonData.data.records;
            populateRepaymentsTable(repayments);
            populatePagination(jsonData.data.totalRecords, pageNumber, pageSize, status);
        } else {
            showAlert('No repayments found', 'warning');
        }
    } catch (error) {
        showAlert("An error occurred. Please try again: " + error.message, 'danger');
    }
}

function populateRepaymentsTable(repayments) {
    const tableBody = document.getElementById('repayments-table-body');
    tableBody.innerHTML = '';
    repayments.forEach(repayment => {
        console.log(repayment.status == 'paid');
        const disabled = repayment.status == 'paid' ? 'disabled' : '';
        const row = document.createElement('tr');
        const d = new Date(repayment.createdAt);
        repayment.createdAt = d.toLocaleDateString("id-ID", {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        row.innerHTML = `
            <td>Rp ${repayment.amount}</td>
            <td>${new Date(repayment.deadlineDate).toLocaleDateString()}</td>
            <td>${repayment.repaidAt ? new Date(repayment.repaidAt).toLocaleDateString() : '-'}</td>
            <td>${repayment.status.charAt(0).toUpperCase() + repayment.status.slice(1)}</td>
            <td>${repayment.createdAt}</td>
        `;
        tableBody.appendChild(row);
    });
}

function populatePagination(totalRecords, pageNumber, pageSize, status) {
    const totalPages = Math.ceil(totalRecords / pageSize);
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    const prevPage = document.createElement('li');
    prevPage.classList.add('page-item');
    if (pageNumber === 1) prevPage.classList.add('disabled');
    prevPage.innerHTML = `
      <a class="page-link" href="#" aria-label="Previous" onclick="fetchLoanRepayment(${loanId},${pageNumber - 1}, ${pageSize}, ${status})">
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
        li.innerHTML = `<a class="page-link" href="#" onclick="fetchLoanRepayment(${loanId},${i}, ${pageSize}, ${status})">${i}</a>`;
        pagination.appendChild(li);
    }


    const nextPage = document.createElement('li');
    nextPage.classList.add('page-item');
    if (pageNumber === totalPages) nextPage.classList.add('disabled');
    nextPage.innerHTML = `
      <a class="page-link" href="#" aria-label="Next" onclick="fetchLoanRepayment(${loanId},${pageNumber + 1}, ${pageSize}, ${status})">
        <span aria-hidden="true">&raquo;</span>
      </a>`;
    pagination.appendChild(nextPage);
}