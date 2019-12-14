const token = localStorage.getItem('token');
if(token){
    const config = {
        headers: {'Authorization': 'Bearer '+token}
    };
    axios.get('../api/account-manager/accounts', config).then(res=>{
        if(res.data.success){
            console.log('res.data:  ', res.data);
        }else{
            alert('無權限瀏覽');
            // window.location.replace("../");
        }
    }).catch(function (error) {
        console.log('error!!!', error);
    });
} else {
    alert('尚未登入');
    window.location.replace("../login");
}


