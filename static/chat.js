document.addEventListener('DOMContentLoaded', (event) => {
    loadChatHistory();
    loadSelectedFunction();
});

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
document.getElementById('function-select').addEventListener('change', function() {
    saveSelectedFunction();
});

function sendMessage() {
    const inputBox = document.getElementById('chat-input');
    const functionSelect = document.getElementById('function-select');
    const selectedFunction = functionSelect.value;
    let message = inputBox.value;
    inputBox.value = '';

    if (message.trim() === '') {
        return;
    }

    message = escapeHTML(message);
    appendMessage('user', message);
    saveChatHistory();

    fetch('/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message, function: selectedFunction }),
    })
    .then(response => response.json())
    .then(data => {
        const botMessage = data.response;
        appendMessage('bot', botMessage);
        saveChatHistory();
    })
    .catch(error => console.error('Error:', error));
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);

    const img = document.createElement('img');
    img.src = sender === 'user' ? '/static/user_avatar.png' : '/static/bot_avatar.png';
    messageDiv.appendChild(img);

    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', sender);
    bubble.innerHTML = message;
    messageDiv.appendChild(bubble);

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function saveChatHistory() {
    const chatBox = document.getElementById('chat-box');
    localStorage.setItem('chatHistory', chatBox.innerHTML);
}

function loadChatHistory() {
    const chatBox = document.getElementById('chat-box');
    const chatHistory = localStorage.getItem('chatHistory');
    if (chatHistory) {
        chatBox.innerHTML = chatHistory;
    }
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function saveSelectedFunction() {
    const functionSelect = document.getElementById('function-select');
    const selectedFunction = functionSelect.value;
    localStorage.setItem('selectedFunction', selectedFunction);
}

function loadSelectedFunction() {
    const selectedFunction = localStorage.getItem('selectedFunction');
    if (selectedFunction) {
        const functionSelect = document.getElementById('function-select');
        functionSelect.value = selectedFunction;
    }
}
