function fetchData() {
    const token = localStorage.getItem('token');
    if(token){
        const config = {
            headers: {'Authorization': 'Bearer '+token}
        };
        axios.get('../api/account-manager/accounts', config).then(res=>{
            if(res.data.success){
                appendData(res.data.accounts);
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
    let el = document.querySelector('table');
    let html = el.innerHTML;

    obj.forEach(element => {
        html +=
            `
            <tr>
                <td>
                    ${element.id}
                </td>
                <td>
                    ${element.email}
                </td>
                <td>
                    ${element.password}
                </td>
            </tr>
            `;
    });
    el.innerHTML = html.trim();
}

fetchData();