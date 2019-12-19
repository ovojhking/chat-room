function afterLogin(){
    const userName = localStorage.getItem('userName');
    let headerUserGroup = document.querySelector('#header-user-group');

    if(userName){
        headerUserGroup.classList.remove('d-none');
        setUserName(userName);
    }else{
        headerUserGroup.classList.add('d-none');
    }
}

function setUserName(userName){
    let el = document.querySelector('#headerUser');
    el.innerHTML = userName;
}

afterLogin();