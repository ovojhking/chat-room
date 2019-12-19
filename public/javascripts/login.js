function submit(){
    let name = document.querySelector('#name').value;
    let password = document.querySelector('#password').value;
    let data = {
        name,
        password
    };

    axios.post('../api/login',data).then(res=>{
        if(res.data.success){
            const {role, token, userName} = res.data;
            localStorage.setItem('role', role);
            localStorage.setItem('userName', userName);
            localStorage.setItem('token', token);
            window.location.href = "/";
        }else{
            alert('帳號或密碼錯誤');
        }
    });
}