const feed = document.getElementById('feed');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

const communityItems = document.querySelectorAll('.community-item');

const contextMenu = document.getElementById('contextMenu');
const editOption = document.getElementById('editOption');
const deleteOption = document.getElementById('deleteOption');

const currentUser = { name: "You", color: "#6C5DD3" };
const botUser = { name: "Stranger", color: "#FF9F43" };

const botPhrases = [
    "That's interesting! Tell me more.",
    "I completely agree with you.",
    "Wait, are you sure about that?",
    "Can you explain that in code?",
    "I'm just a bot, but that sounds cool.",
    "Have you tried using React for this?",
    "Wow, this chat app is smooth!",
    "Hello world!"
];

let targetMessage = null; 
let currentChatId = 'general'; 

function getStorageKey() {
    return `chat_history_${currentChatId}`;
}


document.addEventListener('DOMContentLoaded', () => {
    loadMessagesForCommunity(currentChatId);
});


function loadMessagesForCommunity(chatId) {
  
    feed.innerHTML = ''; 
    
    const key = `chat_history_${chatId}`;
    const savedMessages = JSON.parse(localStorage.getItem(key)) || [];
    
    savedMessages.forEach(msg => {
        createPost(msg.text, msg.user, false, msg.id); 
    });

    feed.scrollTop = feed.scrollHeight;
}

function saveToLocalStorage(text, user, id) {
    const key = getStorageKey(); // Use dynamic key
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    existing.push({ text, user, id });
    localStorage.setItem(key, JSON.stringify(existing));
}

function updateLocalStorage(id, newText) {
    const key = getStorageKey();
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    
    const index = existing.findIndex(msg => msg.id && msg.id.toString() === id);
    
    if (index !== -1) {
        existing[index].text = newText;
        localStorage.setItem(key, JSON.stringify(existing));
    }
}

function deleteFromLocalStorage(idToRemove) {
    const key = getStorageKey();
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    
    const updated = existing.filter(msg => msg.id && msg.id.toString() !== idToRemove);
    
    localStorage.setItem(key, JSON.stringify(updated));
}

function createPost(text, user = currentUser, save = true, existingId = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const messageId = existingId || Date.now();
    messageDiv.dataset.id = messageId; 

    if (user.name !== "You") {
        messageDiv.style.borderLeftColor = user.color;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    headerDiv.innerHTML = `<span class="author-name" style="color: ${user.color}">${user.name}</span><span class="time-stamp">${timeString}</span>`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;

    const footerDiv = document.createElement('div');
    footerDiv.className = 'message-actions';
    footerDiv.innerHTML = `
        <button class="action-btn like-btn">
            <span>♥</span> <span class="like-count">0</span>
        </button>
    `;

    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(footerDiv);

    feed.appendChild(messageDiv);
    feed.scrollTop = feed.scrollHeight;

    if (save) {
        saveToLocalStorage(text, user, messageId);
    }
}

function triggerBotReply() {
    const thinkingTime = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
        typingIndicator.classList.add('active');
        feed.scrollTop = feed.scrollHeight;

        const typingTime = Math.random() * 2000 + 2000;

        setTimeout(() => {
            typingIndicator.classList.remove('active');
            const randomText = botPhrases[Math.floor(Math.random() * botPhrases.length)];
            
            createPost(randomText, botUser, true); 
        }, typingTime);

    }, thinkingTime);
}

sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text !== "") {
        createPost(text, currentUser, true); 
        messageInput.value = "";
        messageInput.focus();
        triggerBotReply();
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

feed.addEventListener('click', (event) => {
    const target = event.target;
    const likeBtn = target.closest('.like-btn');

    if (likeBtn) {
        likeBtn.classList.toggle('liked');
        const countSpan = likeBtn.querySelector('.like-count');
        let count = parseInt(countSpan.textContent);
        if (likeBtn.classList.contains('liked')) count++;
        else count--;
        countSpan.textContent = count;
    }
});

feed.addEventListener('contextmenu', (e) => {
    const messageCard = e.target.closest('.message');
    if (messageCard) {
        const authorName = messageCard.querySelector('.author-name').textContent;
        if (authorName !== "You") return;

        e.preventDefault();
        targetMessage = messageCard; 
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.classList.add('active');
    }
});

document.addEventListener('click', () => {
    contextMenu.classList.remove('active');
});

deleteOption.addEventListener('click', () => {
    if (targetMessage) {
        const messageId = targetMessage.dataset.id; 
        targetMessage.style.opacity = '0';
        setTimeout(() => targetMessage.remove(), 300);
        deleteFromLocalStorage(messageId);
        targetMessage = null;
    }
});

editOption.addEventListener('click', () => {
    if (targetMessage) {
        const contentDiv = targetMessage.querySelector('.message-content');
        const messageId = targetMessage.dataset.id; 
        contentDiv.contentEditable = "true";
        contentDiv.focus();
        const originalText = contentDiv.textContent;

        const handleEditKeys = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                contentDiv.contentEditable = "false";
                
                if (!targetMessage.querySelector('.edited-tag')) {
                    const tag = document.createElement('span');
                    tag.className = 'time-stamp edited-tag';
                    tag.style.marginLeft = '10px';
                    tag.textContent = '(edited)';
                    targetMessage.querySelector('.message-header').appendChild(tag);
                }
                updateLocalStorage(messageId, contentDiv.textContent);
                contentDiv.removeEventListener('keydown', handleEditKeys);
            } 
            else if (e.key === 'Escape') {
                contentDiv.textContent = originalText;
                contentDiv.contentEditable = "false";
                contentDiv.removeEventListener('keydown', handleEditKeys);
            }
        };
        contentDiv.addEventListener('keydown', handleEditKeys);
    }
});

communityItems.forEach(item => {
    item.addEventListener('click', () => {
       
        document.querySelector('.community-item.active')?.classList.remove('active');
        
        item.classList.add('active');

        const newChatId = item.getAttribute('data-chat');
        currentChatId = newChatId;
        
        loadMessagesForCommunity(newChatId);
    });
});