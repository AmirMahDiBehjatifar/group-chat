// Import js-cookie
const Cookies = window.Cookies;

// دریافت توکن از کوکی
const token = Cookies.get('token');
console.log('JWT Token:', token);

if (token) {
    const socket = io('ws://localhost:3000', {
        query: { token }  // send token to server-side
    });


    const activity = document.querySelector('.activity');
    const msgInput = document.querySelector('input');
    const nameInput = document.querySelector('#name');
    const chatRoom = document.querySelector('#room');
    const usersList = document.querySelector('.user-list');
    const roomList = document.querySelector('.room-list');
    const chatDisplay = document.querySelector('.chat-display');



    function sendMessage(e) {
        e.preventDefault();
        if (nameInput.value && msgInput.value && chatRoom.value) {
            const message = msgInput.value;
            socket.emit('message', {
                name: nameInput.value,
                text: message
            });
            const li = document.createElement('li');
            li.textContent = `You: ${message}`;
            document.querySelector('ul').appendChild(li);

            msgInput.value = "";
        }
        msgInput.focus();
    }


    document.querySelector('form').addEventListener('submit', sendMessage);

    socket.on('message', (data) => {
        const li = document.createElement('li');
        li.textContent = data;
        document.querySelector('ul').appendChild(li);
        console.log('Received message:', data);
    });


    msgInput.addEventListener('keypress', () => {
        socket.emit('activity', socket.id.substring(0, 5));
    });

    let activityTimer;
    socket.on('activity', (name) => {
        activity.textContent = `${name} is typing...`;
        clearTimeout(activityTimer);
        activityTimer = setTimeout(() => {
            activity.textContent = "";
        }, 3000);
    });
} else {
    console.log('No JWT token found, cannot establish WebSocket connection.');
}
