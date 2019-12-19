function fetchData() {
    const token = localStorage.getItem('token');
    if(token){
        const config = {
            headers: {'Authorization': 'Bearer '+token}
        };
        axios.get('../api/users', config).then(res=>{
            if(res.data.success){
                appendData(res.data.users);
            }else{
                alert('請重新登入');
                window.location.replace("../login");
            }
        }).catch(function (error) {
            console.log('error!!!', error);
        });
    } else {
        alert('尚未登入');
        window.location.replace("../login");
    }
}

function appendData(obj) {
    const userName = localStorage.getItem('userName');
    let el = document.querySelector('tbody');
    let html = el.innerHTML;

    obj.forEach(element => {
        let button = `<button class="ml-3 btn btn-danger" onclick="deleteAccount(${element.id})">delete</button>`
        if(element.name===userName){
            button = `<button class="ml-3 btn btn-danger disabled">delete</button>`
        }

        html +=
            `
            <tr>
                <td>
                    ${element.id}
                </td>
                <td>
                    ${element.name}
                </td>
                <td>
                    <div class="d-flex justify-content-start">
                        <a class="btn btn-warning text-white" href="account-management/${element.id}/edit">edit</a>
                        ${button}
                    </div>
                </td>
            </tr>
            `;
    });
    el.innerHTML = html.trim();
}

function newAccount(){
    console.log('new');
}

function editAccount(id){
    console.log('edit id:  ', id);
}

function deleteAccount(id){
    let answer = window.confirm("Delete user?");
    const token = localStorage.getItem('token');

    if (answer && token) {
        const config = {
            headers: {'Authorization': 'Bearer '+token}
        };
        axios.delete('../api/user/'+id, config).then(res=>{
            if(res.data.success){
                location.reload();
            }else{
                alert('請重新登入');
                window.location.replace("../login");
            }
        }).catch(function (error) {
            console.log('error!!!', error);
        });
    } else if(!token) {
        alert('尚未登入');
        window.location.replace("../login");
    }
}

fetchData();