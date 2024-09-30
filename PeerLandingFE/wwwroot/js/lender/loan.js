﻿async function fetchUserLoans(pageNumber = 1, pageSize = 10, status = "requested") {
    try {
        const loanTableBody = document.querySelector('#loanTable tbody');
        const token = localStorage.getItem('token');

        const response = await fetch(`/ApiMstLoan/GetAllLoans?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.log(response);
            alert('Failed to fetch loans');
            return;
        }

        const jsonData = await response.json();

        if (jsonData.success) {
            loanTableBody.innerHTML = ''; 
            populateLoanTable(jsonData.data.records);
            populatePagination(jsonData.data.totalRecords, pageNumber, pageSize);
        } else {
            alert('No loans found');
        }
    } catch (error) {
        alert("An error occurred. Please try again." + error.message);
    }
}


function populateLoanTable(loans) {
    const loanTableBody = document.querySelector('#loanTable tbody');
    loanTableBody.innerHTML = ''; // Clear any existing rows
    let i = 1;
    loans.forEach(loan => {
        console.log(loan)
        const tr = document.createElement('tr');
        const d = new Date(loan.createdAt);
        loan.createdAt = d.toLocaleDateString("id-ID", {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        tr.innerHTML = `
            <td>${i++}</td>
            <td>${loan.borrower.name}</td>
            <td>${loan.amount}</td>
            <td>${loan.status}</td>
            <td>${loan.interestRate}%</td>
            <td>${loan.createdAt}</td>
            <td>
                <button class="btn btn-primary btn-sm" onClick="showConfirmationDialog('${loan.id}')">Terima</button>
            </td>
        `;
        loanTableBody.appendChild(tr);
    });
}

window.addEventListener('load', () => {
    fetchUserLoans();
});

let currentLoanId = null;

async function showConfirmationDialog(id) {
    $('#confirmationModal').modal('show');
    currentLoanId = id;
}

async function fundLoan() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/ApiMstLoan/FundLoan?loanId=${currentLoanId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.ok) {
            window.location.reload();
        } else {
            const result = await response.json();
            alert('Error: ' + result.message)
        }
    }catch(error){
        alert("Error add new loan " + error.message);
    }
}

function populatePagination(totalRecords, pageNumber, pageSize) {
    const totalPages = Math.ceil(totalRecords / pageSize);
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    // Previous button
    const prevPage = document.createElement('li');
    prevPage.classList.add('page-item');
    if (pageNumber === 1) prevPage.classList.add('disabled'); // Disable on first page
    prevPage.innerHTML = `
      <a class="page-link" href="#" aria-label="Previous" onclick="fetchUserLoans(${pageNumber - 1}, ${pageSize})">
        <span aria-hidden="true">&laquo;</span>
      </a>`;
    pagination.appendChild(prevPage);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (pageNumber === i) {
            li.classList.add('active');
            li.style.backgroundColor = '#f0f0f0'; // Optional: grey background for active page
        }
        li.innerHTML = `<a class="page-link" href="#" onclick="fetchUserLoans(${i}, ${pageSize})">${i}</a>`;
        pagination.appendChild(li);
    }

    // Next button
    const nextPage = document.createElement('li');
    nextPage.classList.add('page-item');
    if (pageNumber === totalPages || totalPages === 0) nextPage.classList.add('disabled'); // Disable on last page
    nextPage.innerHTML = `
      <a class="page-link" href="#" aria-label="Next" onclick="fetchUserLoans(${pageNumber + 1}, ${pageSize})">
        <span aria-hidden="true">&raquo;</span>
      </a>`;
    pagination.appendChild(nextPage);
}
