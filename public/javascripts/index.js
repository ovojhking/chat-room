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

document.querySelector('#submit').addEventListener('click', () => send());

function send() {
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

function appendData(obj) {
    let el = document.querySelector('.chats');
    let html = el.innerHTML;

    obj.forEach(element => {
        html +=
            `
            <div class="p-3">
                <div class="px-3 d-flex justify-content-between align-items-end">
                    <div class="chat-name">${element.user_name}:</div>
                    <div class="chat-date text-secondary" >${moment(element.createdAt).format('LLL')}</div>
                </div>
                <div class="border border-light rounded bg-white">
                    <div class="m-3"> ${element.message} </div>
                </div>
            </div>
            `;
    });
    el.innerHTML = html.trim();
    el.scrollTo(0,el.scrollHeight);
}
