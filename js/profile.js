document.querySelector('title').textContent = sessionStorage.getItem('currentUsername');
document.getElementById('username').textContent = sessionStorage.getItem('currentUsername');

const closeModal =()=>{
    document.querySelector('.modal').style.display = 'none';
}

const openModal =()=>{
    document.querySelector('.modal').style.display = 'flex';
}