function afterLogin(){
    const userName = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    let headerUserGroup = document.querySelector('#header-user-group');
    let accountManagementIcon = document.querySelector('#account-management-icon');

    if(userName){
        headerUserGroup.classList.remove('d-none');
        setUserName(userName);
    }else{
        headerUserGroup.classList.add('d-none');
    }

    if(role){
        accountManagementIcon.classList.remove('d-none');
    }else{
        accountManagementIcon.classList.add('d-none');
    }
}

function setUserName(userName){
    let el = document.querySelector('#headerUser');
    el.innerHTML = userName;
}

function logout(){
    localStorage.setItem('role','');
    localStorage.setItem('userName','');
    localStorage.setItem('token','');
    window.location.replace("/login");
}

afterLogin();