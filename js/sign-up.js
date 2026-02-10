const username = document.getElementById('username');
const password = document.getElementById('password');
const signInButton = document.getElementById('sign-in-button');
const errorLabel = document.querySelector('.errorLabel');

const handleSignUp = ()=>{
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();
    errorLabel.textContent = (usernameValue === '' ? 'Username cannot be empty' : "");
    errorLabel.textContent += (passwordValue === '' ? ' Password cannot be empty' : "");

    if(usernameValue !== '' && passwordValue !== ''){

    }
}