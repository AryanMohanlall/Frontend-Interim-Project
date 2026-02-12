const username = document.getElementById('username');
const password = document.getElementById('password');
const errorLabel = document.querySelector('.errorLabel');


const handleSignIn = async ()=>{
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();
    errorLabel.textContent = (usernameValue === '' ? 'Username cannot be empty' : "");
    errorLabel.textContent += (passwordValue === '' ? ' Password cannot be empty' : "");

    if(usernameValue !== '' && passwordValue !== ''){
        let users = null;
        try {
            const res = await fetch("../db/users.json");
            if(!res.ok){
                throw new Error(`Failed to fetch users.json: ${res.status} ${res.statusText}`);
            }
            users = await res.json();
            if(!users || !Array.isArray(users.users)){
                throw new Error('Invalid users data format');
            }
        } catch (err) {
            console.error('Error loading users data:', err);
            errorLabel.textContent = 'Unable to sign in right now. Please try again later.';
            return;
        }

        const user = users.users.find(u => u.username === usernameValue);
        if(user || sessionStorage.getItem(usernameValue)){
            const storedPassword = user ? user.password : sessionStorage.getItem(usernameValue);
            if(storedPassword === passwordValue){
                sessionStorage.setItem('currentUsername', usernameValue);
                sessionStorage.setItem('currentPassword', passwordValue);
                sessionStorage.setItem('isLoggedIn', true);
                const allUsernames = users.users.map(user => user.username);

                if(!allUsernames.includes(usernameValue)){
                        allUsernames.push(usernameValue);
                }

                localStorage.setItem('allUsers', JSON.stringify(allUsernames));

                window.location.href = 'home.html';
            }else{
                errorLabel.textContent = 'Incorrect password';
            }
        }else{
            errorLabel.textContent = 'Username does not exist';
        }
    }
}