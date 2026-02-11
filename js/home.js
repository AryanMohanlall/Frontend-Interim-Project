if(!localStorage.getItem('isLoggedIn')){
    window.location.href = 'sign-in.html';
}

addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('banner-title').textContent = localStorage.getItem('currentUsername');
    createContactCards();
});


const contactCard = (data) => {
    alert(data.id);
}

const createContactCards = async () => {
    const data = await fetch('../db/users.json');
    const users = await data.json();
    
    for(let u in users.users) {
        const contactList = document.querySelector('.contact-list');
        
        const newContact = document.createElement('div'); 
        newContact.classList.add('contact');
        newContact.id = users.users[u].username;
        
        newContact.onclick = function() { contactCard(this) }; 

        const imgFrame = document.createElement('div');
        imgFrame.classList.add('imgFrame');
        const img = document.createElement('img');
        img.src = '../assets/images/default-profile.jpg';
        imgFrame.appendChild(img);
        
        newContact.appendChild(imgFrame);
        
        const h3 = document.createElement('h3');
        h3.textContent = users.users[u].username;
        newContact.appendChild(h3);
        
        contactList.appendChild(newContact);
    }
}

