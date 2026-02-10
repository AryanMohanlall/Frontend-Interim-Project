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
        const user = localStorage.getItem(usernameValue);
        if(user){
            errorLabel.textContent = 'Username already exists';
        } else {
            localStorage.setItem(usernameValue, passwordValue);
            document.querySelector('.alert-modal').style.display = 'block';
            window.location.href = 'sign-in.html';
        }
    }
}