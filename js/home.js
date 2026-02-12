if(!sessionStorage.getItem('isLoggedIn')){
    window.location.href = 'sign-in.html';
}

addEventListener('DOMContentLoaded', async ()=>{
    document.getElementById('banner-title').textContent = sessionStorage.getItem('currentUsername');
    await createContactCards();

    const onlineUsers = JSON.parse(localStorage.getItem('online') || '[]');

    const currentUser = sessionStorage.getItem('currentUsername');

    if (currentUser && !onlineUsers.includes(currentUser)) {
        onlineUsers.push(currentUser);
    }

    localStorage.setItem('online', JSON.stringify(onlineUsers));
    updateOnlineUsers();
});

addEventListener('storage', (event)=>{
    populateChatArea(document.querySelector('.chat-header h3'));
    updateOnlineUsers();
})

const updateOnlineUsers = () => {
    const onlineUsers = JSON.parse(localStorage.getItem('online') || '[]');

for (const c of onlineUsers) {
    const contact = document.getElementById(c);
    contact.classList.add('online');
}


}



const createContactCards = async () => {
    try {
        const data = await fetch('../db/users.json');
        const users = await data.json();
        const contactList = document.querySelector('.contact-list');
        
        for(const user of users.users) {
            const newContact = document.createElement('div'); 
            newContact.classList.add('contact');
            newContact.id = user.username;
            
            newContact.onclick = function() { populateChatArea(this) }; 

            const imgFrame = document.createElement('div');
            imgFrame.classList.add('imgFrame');
            const img = document.createElement('img');
            img.src = '../assets/images/default-profile.jpg';
            imgFrame.appendChild(img);
            
            newContact.appendChild(imgFrame);
            
            const h3 = document.createElement('h3');
            h3.textContent = user.username;
            newContact.appendChild(h3);

            const chatPreview = document.createElement('p');
            contactList.appendChild(newContact);
        }
    } catch(error) {
        console.error('Error loading contacts:', error);
    }
}

const addSenderMessage = (message)=>{
    console.log(message);
    const messageLog = document.querySelector('.message-log');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'sender');
    
    const messageLabel = document.createElement('label');
    messageLabel.textContent = message.label;

    const strongElement = document.createElement('strong');
    strongElement.appendChild(messageLabel);
    messageElement.appendChild(strongElement);

    const messageContent = document.createElement('p');
    messageContent.textContent = message.content;
    messageElement.appendChild(messageContent);


    const messageTimestamp = document.createElement('label');
    messageTimestamp.id = "timestamp";
    messageTimestamp.textContent = message.timestamp;
    messageElement.appendChild(messageTimestamp);

    messageLog.appendChild(messageElement);
}

const addReceiverMessage = (message)=>{
    console.log(message);
    const messageLog = document.querySelector('.message-log');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'receiver');
    
    const messageLabel = document.createElement('label');
    messageLabel.textContent = message.label;

    const strongElement = document.createElement('strong');
    strongElement.appendChild(messageLabel);
    messageElement.appendChild(strongElement);

    const messageContent = document.createElement('p');
    messageContent.textContent = message.content;
    messageElement.appendChild(messageContent);


    const messageTimestamp = document.createElement('label');
    messageTimestamp.id = "timestamp";
    messageTimestamp.textContent = message.timestamp;
    messageElement.appendChild(messageTimestamp);

    messageLog.appendChild(messageElement);
}

const populateChatArea = (contact) => {

    // Handle reponsiveness
    if(screen.width <= 768){
        document.querySelector('.contact-list').style.display = 'none';
        document.querySelector('.chat-area').style.width = '100%';
        document.querySelector('.message-box').style.width = '85%';
        document.querySelector('.message-box').style.marginLeft = '0%'
        document.querySelector('.chat-header .imgFrame').style.width = '10%';
        document.querySelector('.chat-header .imgFrame').style.height = '40%';   
    }

    if(screen.width <= 480){
        document.querySelector('.contact-list').style.display = 'none';
        document.querySelector('.chat-area').style.width = '100%';
        document.querySelector('.message-box').style.width = '85%';
        document.querySelector('.message-box').style.marginLeft = '0%'
        document.querySelector('.chat-header .imgFrame').style.width = '20%';   
        document.querySelector('.chat-header .imgFrame').style.height = '50%';   
    }

    document.querySelector('.message-log').replaceChildren();

    sessionStorage.setItem('currentChat', contact.id ? contact.id : sessionStorage.getItem('currentChat'));

    const chatTitle = document.querySelector('.chat-header h3');
    chatTitle.textContent = sessionStorage.getItem('currentChat');

    const chatID = getChatID(sessionStorage.getItem('currentUsername') + document.querySelector('.chat-header h3').textContent);

    if(localStorage.getItem(chatID)){
        const messages = JSON.parse(localStorage.getItem(chatID));
        console.log(messages);

        for(let m in messages.messages){
            
            if(messages.messages[m].content !== ""){
                messages.messages[m].label !== sessionStorage.getItem('currentUsername') ? addSenderMessage(messages.messages[m]) : addReceiverMessage(messages.messages[m]);
            }
        }

    }else{
        const message = {
            label:chatTitle.textContent,
            content:"",
            timestamp:new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        localStorage.setItem(chatID, JSON.stringify({
            messages:[message]
        }));
    }

}

const getChatID = (str) => {
    console.log(str);
        
    const chatId = str.split('').sort().join('');
    
    console.log("Created chatid: " + chatId);
    return chatId;
}

const createChat = (chatID)=>{
            localStorage.setItem(chatID, JSON.stringify({
            messages:[
            message={
                label:"",
                content:"",
                timestamp:new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]}));
}

const addMessageToChat = (messageObj, chatID)=>{
    const chat = JSON.parse(localStorage.getItem(chatID));
    chat.messages.push(messageObj);
    localStorage.setItem(chatID, JSON.stringify(chat));
}

const sendMessage = ()=>{
        const chatID = getChatID(sessionStorage.getItem('currentUsername') + sessionStorage.getItem('currentChat'));

        if(!localStorage.getItem(chatID)){
            createChat(chatID);
        }
            
        const messages = JSON.parse(localStorage.getItem(chatID));

        const messageInput = document.querySelector('.message-box input');
        const message = messageInput.value.trim();
        if(message !== ''){
            console.log(message);
            console.log(messages);
            const messageObj = {
                label:sessionStorage.getItem('currentUsername'),
                content:message,
                timestamp:new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }

            addMessageToChat(messageObj, chatID);
            populateChatArea(sessionStorage.getItem('currentChat'));
            messageInput.value = '';
        }
}


const closeModal = ()=>{
    document.querySelector('.modal').style.display = 'none';
}

const openModal = ()=>{
    document.querySelector('.modal').style.display = 'flex';
}

const handleSignOut = () => {
    let newOnlineUsers = JSON.parse(localStorage.getItem('online') || '[]');
    
    const userToRemove = sessionStorage.getItem('currentUsername');
    
    if (userToRemove) {
        newOnlineUsers = newOnlineUsers.filter(user => user !== userToRemove);        
        localStorage.setItem('online', JSON.stringify(newOnlineUsers));
    }

    sessionStorage.clear();
    window.location.href = 'sign-in.html';
}
