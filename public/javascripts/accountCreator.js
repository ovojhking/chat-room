function submit() {
    const token = localStorage.getItem('token');
    const config = {
        headers: {'Authorization': 'Bearer '+token}
    };
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const verify = document.getElementById('verify').value;
    if(name==='' || password==='' || verify===''){
        alert('資料填寫不完全');
        return ;
    }else if(password !== verify){
        alert('密碼與確認密碼不符');
        return ;
    }

    const data = {name, password};
    axios.post('/api/user/', data, config).then(res=>{
        if(res.data.success){
            location.href = "/account-management";
        }else{
            alert('發生錯誤請重新登入');
            window.location.replace("../login");
        }
    }).catch(function (error) {
        // console.log('error!!!', error);
        alert('發生錯誤請重新登入');
        window.location.replace("../login");
    });
}

function cancel() {
    location.reload();
}

