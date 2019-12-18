function fetchData() {
    const pathArray = window.location.pathname.split('/');
    const id = pathArray[pathArray.length-2];

    const token = localStorage.getItem('token');
    if(token){
        const config = {
            headers: {'Authorization': 'Bearer '+token}
        };
        axios.get('../../api/user/'+id, config).then(res=>{
            if(res.data.success){
                setDefaultValue(res.data.user);
            }else{
                alert('請重新登入');
                window.location.replace("/login");
            }
        }).catch(function (error) {
            alert('請重新登入');
            window.location.replace("/login");
        });
    } else {
        alert('尚未登入');
        window.location.replace("../login");
    }
}

function setDefaultValue(user) {
    document.getElementById('name').defaultValue = user.name;
    document.getElementById('name').value = user.name;
}

function check() {
    const isChecked = document.querySelector('#resetPassword').checked;
    let el = document.querySelector('#newPasswordForm');

    if(isChecked){
        el.classList.remove('d-none');
    }else{
        el.classList.add('d-none');
    }
}

function submit() {
    const pathArray = window.location.pathname.split('/');
    const id = pathArray[pathArray.length-2];
    const token = localStorage.getItem('token');
    const config = {
        headers: {'Authorization': 'Bearer '+token}
    };
    const isChecked = document.querySelector('#resetPassword').checked;
    const name = document.getElementById('name').value;
    let data = {name};

    if(isChecked){
        const password = document.getElementById('password').value;
        const verify = document.getElementById('verify').value;
        if(password !== verify){
            alert('密碼與確認密碼不符');
            return ;
        }
        data = {name, password};
    }

    axios.put('/api/user/'+id, data, config).then(res=>{
        if(res.data.success){
            console.log('hihihihihihi');
            location.href = "/account-management";
        }else{
            alert('請重新登入');
            window.location.replace("../login");
        }
    }).catch(function (error) {
        console.log('error!!!', error);
    });
}

function cancel() {
    location.reload();
}

fetchData();