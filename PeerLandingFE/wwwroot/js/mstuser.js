async function fetchUsers(pageNumber = 1, pageSize = 10) {
    try {
        const userTableBody = document.querySelector('#userTable tbody');
        const token = localStorage.getItem('token');

        const response = await fetch(`/ApiMstUser/GetAllUsers?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            alert('Failed to fetch users');
            return;
        }

        const jsonData = await response.json();

        if (jsonData.success) {
            // Clear the table and populate new data
            userTableBody.innerHTML = ''; // Ensure it's empty before appending new rows
            populateUserTable(jsonData.data.records);
            populatePagination(jsonData.data.totalRecords, pageNumber, pageSize);
        } else {
            alert('No users found');
        }
    } catch (error) {
        alert("An error occurred. Please try again." + error.message);
    }
}


function populateUserTable(users) {
    const userTableBody = document.querySelector('#userTable tbody');
    userTableBody.innerHTML = ''; // Clear any existing rows
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.balance}</td>
            <td>
                <button class="btn btn-primary btn-sm" onClick="editUser('${user.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onClick="deleteUser('${user.id}')">Delete</button>
            </td>
        `;
        userTableBody.appendChild(tr);
    });
}

window.addEventListener('load', () => {
    fetchUsers();
});

async function addUser() {
    try {
        const token = localStorage.getItem('token');
        const name = document.getElementById('addUserName').value;
        const balance = 0;
        const role = document.getElementById('addUserRole').value;
        const email = document.getElementById('addUserEmail').value;
        const password = document.getElementById('addUserPassword').value;
        if (role == "admin") {
            alert("You are not authorized to add new user as admin");
            return;
        }
        const response = await fetch('/ApiMstUser/AddUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name, balance, role, email, password })
        });
        console.log(response);
        if (response.ok) {
            window.location.reload();
        } else {
            const result = await response.json();
            alert('Error: ' + result.message)
        }
    }catch(error){re
        alert("Error add new user " + error.message);
    }
}

async function editUser(id) {
    try {
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await fetch(`/ApiMstUser/GetUserById?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        console.log(response);
        if (!response.ok) {
            alert('Failed to fetch user');
            return;
        }
        const jsonData = await response.json();
        console.log(jsonData);
        if (jsonData.success) {
            const user = jsonData.data;
            console.log(user)
            console.log(document.getElementById('userName'))
            document.getElementById('userName').value = user.name;
            document.getElementById('userBalance').value = user.balance;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userId').value = user.id;
            $('#editUserModal').modal('show');
        } else {
            alert('No users found');
        }
    }catch(error){
        alert("Error fetching user data" + error.message);
    }
}

async function updateUser() {
    try {
        const token = localStorage.getItem('token');
        const name = document.getElementById('userName').value;
        const balance = document.getElementById('userBalance').value;
        const role = document.getElementById('userRole').value;
        const id = document.getElementById('userId').value;
        const response = await fetch(`/ApiMstUser/UpdateUser?id=${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, balance, role })
        });
        console.log(response);

        const result = await response.json();

        if (response.ok) {
            window.location.reload();

        } else {
            alert(result.message || 'Update User Failed. Please try again.')
        }
    } catch (error) {
        alert("An error occurred. Please try again." + error.message);
    }
}

async function deleteUser(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/ApiMstUser/DeleteUser?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        console.log(response);

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            window.location.reload();
        } else {
            alert(result.message || 'Delete User Failed. Please try again.')
        }
    } catch (error) {
        alert("An error occurred. Please try again." + error.message);
    }
}

function populatePagination(totalRecords, pageNumber, pageSize) {
    const totalPages = Math.ceil(totalRecords / pageSize);
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    const prevPage = document.createElement('li');
    prevPage.classList.add('page-item');
    if (pageNumber === 1) prevPage.classList.add('disabled'); 
    prevPage.innerHTML = `
      <a class="page-link" href="#" aria-label="Previous" onclick="fetchUsers(${pageNumber - 1}, ${pageSize})">
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
        li.innerHTML = `<a class="page-link" href="#" onclick="fetchUsers(${i}, ${pageSize})">${i}</a>`;
        pagination.appendChild(li);
    }

    const nextPage = document.createElement('li');
    nextPage.classList.add('page-item');
    if (pageNumber === totalPages) nextPage.classList.add('disabled'); 
    nextPage.innerHTML = `
      <a class="page-link" href="#" aria-label="Next" onclick="fetchUsers(${pageNumber + 1}, ${pageSize})">
        <span aria-hidden="true">&raquo;</span>
      </a>`;
    pagination.appendChild(nextPage);
}