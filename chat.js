// Chat initialization and management
class ChatManager {
    constructor() {
        this.chatHistory = [];
        this.currentUser = null;
        this.isTyping = false;
        this.typingTimeout = null;
        this.init();
    }

    async init() {
        this.loadUserFromURL();
        this.setupEventListeners();
        await this.loadChatHistory();
        this.hideLoadingSpinner();
        this.startAutoUpdates();
    }

    loadUserFromURL() {
        const params = new URLSearchParams(window.location.search);
        this.currentUser = {
            name: params.get('user') || 'Unknown User',
            image: params.get('image') || 'default-avatar.png'
        };
        this.updateUIWithUserInfo();
    }

    setupEventListeners() {
        // Message input
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-message-btn');

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
            this.handleTyping();
        });

        sendButton.addEventListener('click', () => this.sendMessage());

        // Attachment button
        document.getElementById('attachment-btn').addEventListener('click', 
            () => this.showModal('attachment-modal'));

        // Setup modal close buttons
        document.querySelectorAll('.modal .close').forEach(button => {
            button.addEventListener('click', 
                () => this.closeModal(button.closest('.modal').id));
        });
    }

    async loadChatHistory() {
        // Simulate loading chat history from server
        await new Promise(resolve => setTimeout(resolve, 1000));
        const history = localStorage.getItem(`chat_${this.currentUser.name}`);
        this.chatHistory = history ? JSON.parse(history) : [];
        this.displayMessages();
    }

    displayMessages() {
        const container = document.getElementById('messages-container');
        container.innerHTML = '';
        
        this.chatHistory.forEach(message => {
            const messageElement = this.createMessageElement(message);
            container.appendChild(messageElement);
        });
        
        this.scrollToBottom();
    }

    createMessageElement(message) {
        const div = document.createElement('div');
        div.className = `message ${message.type}`;
        div.innerHTML = `
            <p>${message.text}</p>
            <span class="time">${message.time}</span>
        `;
        return div;
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        
        if (message) {
            const newMessage = {
                type: 'sent',
                text: message,
                time: this.getCurrentTime()
            };
            
            this.chatHistory.push(newMessage);
            this.saveToLocalStorage();
            this.displayMessages();
            input.value = '';
            
            // Simulate received message
            setTimeout(() => this.simulateResponse(), 1000);
        }
    }

    simulateResponse() {
        const responses = [
            "That's interesting!",
            "I see what you mean.",
            "Could you tell me more?",
            "Thanks for sharing!"
        ];
        
        const response = {
            type: 'received',
            text: responses[Math.floor(Math.random() * responses.length)],
            time: this.getCurrentTime()
        };
        
        this.chatHistory.push(response);
        this.saveToLocalStorage();
        this.displayMessages();
    }

    // Utility methods
    getCurrentTime() {
        const now = new Date();
        return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    saveToLocalStorage() {
        localStorage.setItem(
            `chat_${this.currentUser.name}`, 
            JSON.stringify(this.chatHistory)
        );
    }

    scrollToBottom() {
        const container = document.getElementById('messages-container');
        container.scrollTop = container.scrollHeight;
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    hideLoadingSpinner() {
        document.getElementById('message-loading').style.display = 'none';
    }

    startAutoUpdates() {
        setInterval(() => this.updateOnlineStatus(), 30000);
    }

    updateOnlineStatus() {
        const isOnline = Math.random() > 0.3;
        const statusText = document.getElementById('status-text');
        const statusIndicator = document.getElementById('user-online-status');
        
        statusText.textContent = isOnline ? 'Online' : 'Offline';
        statusIndicator.style.backgroundColor = isOnline ? '#2ecc71' : '#95a5a6';
    }
}

// Initialize chat when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
});

// Global functions for HTML onclick handlers
function viewProfile() {
    window.chatManager.showModal('profile-modal');
}

function closeModal(modalId) {
    window.chatManager.closeModal(modalId);
}

function startCall(type) {
    alert(`Starting ${type} call... (Feature coming soon)`);
}

function showMoreOptions() {
    alert('More options coming soon!');
}

function blockUser() {
    if (confirm('Are you sure you want to block this user?')) {
        alert('User blocked successfully');
        window.location.href = 'index.html';
    }
}

function reportUser() {
    if (confirm('Are you sure you want to report this user?')) {
        alert('User reported successfully');
    }
} 