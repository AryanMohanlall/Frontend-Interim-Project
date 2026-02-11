const username = document.getElementById('username');
const password = document.getElementById('password');
const signInButton = document.getElementById('sign-in-button');
const errorLabel = document.querySelector('.errorLabel');


const handleSignIn = async ()=>{
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();
    errorLabel.textContent = (usernameValue === '' ? 'Username cannot be empty' : "");
    errorLabel.textContent += (passwordValue === '' ? ' Password cannot be empty' : "");

    if(usernameValue !== '' && passwordValue !== ''){
        const data = await fetch("../db/users.json");
        const users = await data.json();
        const user = users.users.find(u => u.username === usernameValue);
        if(user || localStorage.getItem(usernameValue)){
            const storedPassword = user ? user.password : localStorage.getItem(usernameValue);
            if(storedPassword === passwordValue){
                localStorage.setItem('currentUsername', usernameValue);
                localStorage.setItem('currentPassword', passwordValue);
                localStorage.setItem('isLoggedIn', true);

                window.location.href = 'home.html';
            }else{
                errorLabel.textContent = 'Incorrect password';
            }
        }else{
            errorLabel.textContent = 'Username does not exist';
        }
    }
}