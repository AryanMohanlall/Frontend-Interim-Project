if(!sessionStorage.getItem('isLoggedIn')){
    window.location.href = 'sign-in.html';
}



document.getElementById('username').textContent = sessionStorage.getItem('currentUsername');
document.getElementById('banner-title').textContent = sessionStorage.getItem('currentUsername');

const closeModal =()=>{
    document.querySelector('.modal').style.display = 'none';
}

const openModal =()=>{
    document.querySelector('.modal').style.display = 'flex';
}



addEventListener('DOMContentLoaded', ()=> {
    const userImg = document.querySelector('.imgFrame img');
    userImg.src =
        localStorage.getItem(`userImage${sessionStorage.getItem('currentUsername')}`)
        || "../assets/images/default-profile.jpg";
});


const changeProfileImage = () => {
    const input = document.querySelector('input');
    const label = document.querySelector('label');
    const userImg = document.querySelector('.imgFrame img');
    const url = input.value.trim();

    try {
        const validUrl = new URL(url);
        
        localStorage.setItem(`userImage${sessionStorage.getItem('currentUsername')}`, validUrl.href);
        userImg.src = validUrl.href;

        label.style.color = "#444";
        label.innerText = "Enter image url to change profile picture";
        
        input.value = "";

    } catch (error) {
        label.style.color = "red";
        label.innerText = "Please enter a valid URL (include http://)";
        input.style.borderColor = "red";
        userImg.src = "../assets/images/default.jpg";
    }
}

document.querySelector('.imgFrame img').onerror = function() {
    const label = document.querySelector('label');
    label.style.color = "red";
    label.innerText = "Error: That link is not a direct image file.";
    
    this.src = "../assets/images/default.jpg";
};
