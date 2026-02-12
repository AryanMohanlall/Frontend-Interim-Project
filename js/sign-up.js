const username = document.getElementById('username');
const password = document.getElementById('password');
const signInButton = document.getElementById('sign-in-button');
const errorLabel = document.querySelector('.errorLabel');


const gotoSignIn = () => {
    window.location.href = 'sign-in.html';
}

const handleSignUp = async()=>{
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
            errorLabel.textContent = 'Unable to sign up right now. Please try again later.';
            return;
        }

        const user = users.users.some(u => u.username === usernameValue);
        console.log(user);

        if(user){
            errorLabel.textContent = 'Username already exists';
        }else{
            localStorage.setItem(usernameValue, passwordValue);
                const allUsernames = users.users.map(user => user.username);

                if(!allUsernames.includes(usernameValue)){
                        allUsernames.push(usernameValue);
                }

                localStorage.setItem('allUsers', JSON.stringify(allUsernames));

            window.location.href = 'sign-in.html';
        }
    }
}