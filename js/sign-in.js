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
        if(user || localStorage.getItem(usernameValue)){
            const storedPassword = localStorage.getItem(usernameValue) ? localStorage.getItem(usernameValue) : user.password;

            if(passwordValue === await decryptPassword(storedPassword)){
                sessionStorage.setItem('currentUsername', usernameValue);
                sessionStorage.setItem('currentPassword', passwordValue);
                sessionStorage.setItem('isLoggedIn', true);

                let allUsernames = JSON.parse(localStorage.getItem('allUsers'));

                if (!allUsernames) {
                    allUsernames = users.users.map(user => user.username);
                }

                if (!allUsernames.includes(usernameValue)) {
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

async function getSecretKey(password) {
  const encoder = new TextEncoder();
  const rawKey = await crypto.subtle.digest('SHA-256', encoder.encode(password));
  return crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

const MASTER_PASS = "user-secret-key";

const encryptPassword = async (plain) => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getSecretKey(MASTER_PASS);
  
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plain)
  );

  const ivString = btoa(String.fromCharCode(...iv));
  const dataString = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  
  return `${ivString}:${dataString}`; 
};

const decryptPassword = async (cipher) => {
  const [ivString, dataString] = cipher.split(':');
  
  const iv = Uint8Array.from(atob(ivString), c => c.charCodeAt(0));
  const data = Uint8Array.from(atob(dataString), c => c.charCodeAt(0));
  const key = await getSecretKey(MASTER_PASS);

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    throw new Error("Decryption failed: Likely wrong password or corrupted data.");
  }
};
