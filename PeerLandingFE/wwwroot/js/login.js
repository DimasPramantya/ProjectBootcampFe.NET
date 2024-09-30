async function submitLogin(){
    try{
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/ApiLogin/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        console.log(response);

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            localStorage.setItem('token', result.data.token);
            const response = await fetch('/ApiMstUser/GetUserData', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${result.data.token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('userRole', result.data.role);
                localStorage.setItem('userName', result.data.name);
                console.log(result.data.name)
                if (result.data.role == "admin") {
                    window.location.href = 'Admin';
                } else if (result.data.role == "lender") {
                    window.location.href = 'Lender';
                } else if (result.data.role == "borrower") {
                    window.location.href = 'Borrower';
                } else {
                    alert("Invalid role. Please try again.")
                }
            }else {
                alert(result.message || 'Login failed. Please try again.')
            }
        } else {
            alert(result.message || 'Login failed. Please try again.')
        }
    }catch(error){
        alert("An error occurred. Please try again." + error.message);
    }
}