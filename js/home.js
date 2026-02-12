if(!sessionStorage.getItem('isLoggedIn')){
    window.location.href = 'sign-in.html';
}

var groupsToggle = false;

//is typing functionality
window.addEventListener('keydown', (event) => {
    const currentUsername = sessionStorage.getItem('currentUsername');
    localStorage.setItem(`${currentUsername}Status`, `${currentUsername} is typing...`);
    updateIsTyping()
});

window.addEventListener('keyup', (event)=>{
    const currentUsername = sessionStorage.getItem('currentUsername');
    localStorage.setItem(`${currentUsername}Status`, "");
    updateIsTyping()
})


const updateIsTyping = ()=>{

    const contacts = document.querySelectorAll('.contact-list .contact');

    contacts.forEach((contact) => {
        // Access the ID (e.g., "1")
        //console.log("Contact ID:", contact.id);
        let userStatus = contact.querySelector('h6');
        userStatus.innerText = localStorage.getItem(`${contact.id}Status`);
        
    });
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
    updateIsTyping();
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
        const response = await fetch('../db/users.json');
        const { users } = await response.json();
        const contactList = document.querySelector('.contact-list');
        
        contactList.innerHTML = users.map(user => {
            const userImg = localStorage.getItem(`userImage${user.username}`) || '../assets/images/default-profile.jpg';
            
            return `
                <div class="contact" id="${user.username}" onclick="populateChatArea(this)">
                    <div class="imgFrame">
                        <img src="${userImg}" alt="${user.username}">
                    </div>
                    <div class="contact-info">
                        <h3>${user.username}</h3>
                        <h6 id="status-${user.username}"></h6>
                    </div>
                </div>
            `;
        }).join('');
        groupsToggle = false;
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

const addBackButton = () => {
    const header = document.querySelector('.chat-header');
    
    if (document.querySelector('.back-btn')) return;

    const backBtn = document.createElement('button');
    backBtn.innerText = "<-";
    backBtn.className = "back-btn";
    backBtn.onclick = () => {
        document.querySelector('.sidebar').style.display = 'flex';
        document.querySelector('.chat-area').style.display = 'none';
    };

    header.prepend(backBtn);
};


/* const populateChatArea = (contact) => {

    const width = window.innerWidth;
    const sidebar = document.querySelector('.sidebar');
    const chatArea = document.querySelector('.chat-area');

    if (width <= 768) {
        sidebar.style.display = 'none';
        chatArea.style.display = 'flex';
        chatArea.style.width = '100%';
        
        addBackButton(); 
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

} */

const populateChatArea = (contact) => {
    // 1. Handle Responsiveness (Mobile View)
    const width = window.innerWidth;
    const sidebar = document.querySelector('.sidebar');
    const chatArea = document.querySelector('.chat-area');

    if (width <= 768) {
        sidebar.style.display = 'none';
        chatArea.style.display = 'flex';
        chatArea.style.width = '100%';
        
        if (typeof addBackButton === "function") addBackButton(); 
    }

    const messageLog = document.querySelector('.message-log');
    messageLog.replaceChildren();

    const targetID = contact.id || sessionStorage.getItem('currentChat');
    sessionStorage.setItem('currentChat', targetID);

    const chatTitle = document.querySelector('.chat-header h3');
    chatTitle.textContent = targetID;
    
    const currentUser = sessionStorage.getItem('currentUsername');

    if (groupsToggle) {
        // --- GROUP CHAT LOGIC ---
        const allGroups = JSON.parse(localStorage.getItem('userGroups') || '[]');
        const currentGroup = allGroups.find(g => g.name === targetID);

        if (currentGroup && currentGroup.messages) {
            currentGroup.messages.forEach(msg => {
                if (msg.content.trim() !== "") {
                    msg.label !== currentUser ? addSenderMessage(msg) : addReceiverMessage(msg);
                }
            });
        }
    } else {
        // --- INDIVIDUAL CHAT LOGIC ---
        const chatID = getChatID(currentUser + targetID);
        const chatData = JSON.parse(localStorage.getItem(chatID));

        if (chatData && chatData.messages) {
            chatData.messages.forEach(msg => {
                if (msg.content.trim() !== "") {
                    msg.label !== currentUser ? addSenderMessage(msg) : addReceiverMessage(msg);
                }
            });
        } else {
            const initialData = {
                messages: [{
                    label: targetID,
                    content: "",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]
            };
            localStorage.setItem(chatID, JSON.stringify(initialData));
        }
    }
    
    messageLog.scrollTop = messageLog.scrollHeight;
};


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
    if(groupsToggle){
        console.log("" + messageObj);
        console.log("chatID ===" + chatID);

        let allGroups = JSON.parse(localStorage.getItem('userGroups') || '[]');

        const groupIndex = allGroups.findIndex(group => group.name === chatID);

        if (groupIndex !== -1) {
            allGroups[groupIndex].messages.push(messageObj);

            localStorage.setItem('userGroups', JSON.stringify(allGroups));
            
            
        } else {
            console.error(`Group "${chatID}" not found!`);
        }
        
    }else{
        const chat = JSON.parse(localStorage.getItem(chatID));
        chat.messages.push(messageObj);
    }
    
}

const sendMessage = ()=>{
        let chatID = getChatID(sessionStorage.getItem('currentUsername') + sessionStorage.getItem('currentChat'));

        if(groupsToggle){
            chatID = document.querySelector('.chat-header h3').innerText;
        }else if(!localStorage.getItem(chatID)){
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
            //populateChatArea(sessionStorage.getItem('currentChat'));
            populateChatArea(chatID);
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


const individualFilter = ()=>{
    document.querySelector("#filterBtn").classList.add('active');
    document.querySelector("#groupsBtn").classList.remove('active');
    createContactCards();
}


const groupsFilter = ()=>{
    document.querySelector("#filterBtn").classList.remove('active');
    document.querySelector("#groupsBtn").classList.add('active');
}

const createGroupCards = () => {
    try {
        const contactList = document.querySelector('.contact-list');
        const currentUser = sessionStorage.getItem('currentUsername');
        
        const allGroups = JSON.parse(localStorage.getItem('userGroups') || '[]');

        const myGroups = allGroups.filter(group => group.members.includes(currentUser));

        if (myGroups.length === 0) {
            contactList.innerHTML = '<p style="color:white; margin-top:20px;">No groups found.</p>';
            return;
        }

        contactList.innerHTML = myGroups.map(group => {
            const groupImg = '../assets/images/default-group.png'; 
            
            return `
                <div class="contact group-card" id="${group.name}" onclick="populateChatArea(this)">
                    <div class="imgFrame">
                        <img src="${groupImg}" alt="${group.name}">
                    </div>
                    <div class="contact-info">
                        <h3>${group.name}</h3>
                        <h6 id="status-${group.name}">${group.members.length} members</h6>
                    </div>
                </div>
            `;
        }).join('');
        groupsToggle = true;
    } catch (error) {
        console.error('Error loading group cards:', error);
    }
};


const saveNewGroup = () => {
    const groupName = document.querySelector('#groupName').value.trim();
    
    const checkedBoxes = document.querySelectorAll('.group-member-check:checked');
    const selectedMembers = Array.from(checkedBoxes).map(cb => cb.value);

    if (!groupName) {
        alert("Please enter a group name!");
        return;
    }
    if (selectedMembers.length === 0) {
        alert("Please select at least one member to add!");
        return;
    }

    const newGroup = {
        name: groupName,
        members: [...selectedMembers, sessionStorage.getItem('currentUsername')],
        messages:[
            message={
                label:"",
                content:"",
                timestamp:new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ],
        createdAt: new Date().toISOString()
    };

    let existingGroups = JSON.parse(localStorage.getItem('userGroups') || '[]');
    existingGroups.push(newGroup);
    localStorage.setItem('userGroups', JSON.stringify(existingGroups));

    closeGroupModal(); 
};


const createGroup = () => {
    document.querySelector('#createGroup').style.display = 'flex';

    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const currentUser = sessionStorage.getItem('currentUsername');

    const selectionContainer = document.querySelector('.user-selection');

    selectionContainer.innerHTML = allUsers
        .filter(user => user !== currentUser) 
        .map(user => `
            <div class="user-checkbox-item">
                <input type="checkbox" id="check-${user}" value="${user}" class="group-member-check">
                <label for="check-${user}">${user}</label>
            </div>
        `).join('');

    
};


const closeGroupModal = ()=>{
     document.querySelector('#createGroup').style.display = 'none';
}