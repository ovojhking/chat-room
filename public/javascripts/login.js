document.querySelector('#submit').addEventListener('click', () => Submit());

function Submit(){
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    let data = {
        email,
        password
    };

    axios.post('../api/login',data).then(res=>{
        // console.log('recieve res:  ', res);
        if(res.data.success){
            const token = res.data.token;
            localStorage.setItem('token', token);
            window.location.href = "../";
        }else{
            alert('帳號或密碼錯誤');
        }
    });
}