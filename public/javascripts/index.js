const token = localStorage.getItem('token');

socket = io.connect('ws://localhost:3001', {
    query: {token}
});
socket.on('message', (obj) => {
    console.log(obj);
    appendData([obj]);
});
socket.on('history', (obj) => {
    if (obj.length > 0) {
        appendData(obj);
    }
});
socket.on('error', (error) => {
    console.log(error);
});
socket.on('expired', (msg) => {
    alert(msg);
    location.replace('../login');
});

document.querySelector('#submit').addEventListener('click', () => Send());
document.querySelector('#disconnect').addEventListener('click', () => disconnect());

function Send() {
    let message = document.querySelector('#message').value;
    if (!message) {
        return;
    }
    const userName = localStorage.getItem('userName');
    if(userName){
        let data = {
            userName,
            message
        };
        socket.emit('message', data);
        document.querySelector('#message').value = '';
    } else {
        alert('尚未登入');
        window.location.replace("../login");
    }
}

// socket.on('message', (obj) => {
//     console.log('hi');
//     appendData([obj]);
// });

// socket.on('history', (obj) => {
//     if (obj.length > 0) {
//         appendData(obj);
//     }
// });

function appendData(obj) {
    let el = document.querySelector('.chats');
    let html = el.innerHTML;

    obj.forEach(element => {
        html +=
            `
            <div class="chat">
                <div>
                    <div>${element.user_name}：</div>
                    <div>${element.message}</div>
                </div>
                <div>${element.createdAt}</div>
            </div>
            `;
    });
    el.innerHTML = html.trim();
}