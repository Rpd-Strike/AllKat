let User_Flag_showLastLogin = false;

/// this function checks if the token in the localStorage is Valid
/// Also sets the name of the user accordingly: (Guest, User-Name, Admin)
function User_LoadUser()
{
    let UserData = {};

    function showLogin() {
        Utils_DeleteAllWithClass('nav-user');
        document.querySelector('nav.nav .nav-user-info').innerHTML += `
    <button class="btn nav-user" onclick="User_RegisterAction()">Register</button></nav>
    <button class="btn nav-user" onclick="User_LoginAction()">Login</button>
    `;
    }

    const adminButtonHTML = `
        <button class="btn nav-user btn-admin-page" onclick="User_AdminAction()">Dashboard</button>`;

    function showLoggedUser() {
        Utils_DeleteAllWithClass('nav-user');
        document.querySelector('nav.nav .nav-user-info').innerHTML += `
        ${localStorage.getItem("username").toLowerCase() == 'admin' ? adminButtonHTML : ''}
        <button class="btn nav-user" onclick="User_LogoutAction()">Logout</button>
        <span class="nav-user">${localStorage.getItem("username")}</span>
    `;
        if (User_Flag_showLastLogin) {
            let message = `Salut, te-ai logat azi pentru prima oara`;
            const loginDate = new Date(JSON.parse(UserData.second_last_login));
            const day = ("0" + loginDate.getDate()).slice(-2);
            console.log("DAY: " + day);
            const month = ("0" + loginDate.getMonth()).slice(-2);
            const year = loginDate.getFullYear();
            const hour = ("0" + loginDate.getHours()).slice(-2);
            const minutes = ("0" + loginDate.getMinutes()).slice(-2);
            const seconds = ("0" + loginDate.getSeconds()).slice(-2);
            if (UserData.nr_visits > 1)
                message = `Salut, ${UserData.username}, ultima oara ai intrat de pe ip-ul ${UserData.second_last_ip} \
                in ziua ${day}.${month}.${year} la ora ${hour}:${minutes}:${seconds}. 
                Ai vizitat site-ul de ${UserData.nr_visits} ori`;
            Home_showLastLogin(message);

            User_Flag_showLastLogin = false;
        }
    }

    function setGuest() {
        Utils_DeleteAllWithClass('nav-user');
        localStorage.removeItem("token");
        localStorage.setItem("username", "Guest");
        localStorage.setItem("isAdmin", "false");
        showLogin();
    }
    /// check validity of token and set username
    if (localStorage.getItem("token") === null) {
        setGuest();
    }
    else if (localStorage.getItem("token").length < 1) {
        setGuest();
    }
    else {
        Prom_TestToken(localStorage.getItem("token"))
        .then(resp => {
            localStorage.setItem("username", resp.data.user_data.username);
            const adminString = (resp.data.user_data.username.toLowerCase() == "admin" ? "true" : "false");
            localStorage.setItem("isAdmin", adminString);
            UserData = resp.data.user_data;
            showLoggedUser();
        }).catch(bad => {
            setGuest();
        })
    }
}

const LoginHTML = `
<div class="form-wrapper">
<div class="form-style">
    <form>
    <fieldset>
    <legend><i class="fas fa-sign-in-alt"></i> <span class="form-title">Login</span> </legend>
    <label>Username</label>
    <input class="input" type="text" name="username" placeholder="Your username">
    <label>Password</label>
    <input type="password" class="input" name="password" placeholder="Password">
          
    </fieldset>
    <input class="input" type="button" value="Login" onclick="User_LoginAttempt()">

    <div class="extra-info">
      <h4><span><span></h4>
      <i class="fas fa-times" onclick="Utils_HideExtraInfo()"></i>
    </div>

    </form>
    </div>
</div>
`;

const RegisterHTML = `
<div class="form-wrapper">
<div class="form-style">
    <form>
    <fieldset>
    <legend><i class="fas fa-user-plus"></i> <span class="form-title">Register</span> </legend>
    <label>Username</label>
    <input class="input" type="text" name="username" placeholder="Your username">
    <label>Password</label>
    <input type="password" class="input" name="password" placeholder="Password">
    <label>Retype Password</label>
    <input type="password" class="input" name="repeatpassword" placeholder="Retype Password">
          
    </fieldset>
    <input class="input" type="button" value="Register" onclick="User_RegisterAttempt()">

    <div class="extra-info">
      <h4><span><span></h4>
      <i class="fas fa-times" onclick="Utils_HideExtraInfo()"></i>
    </div>

    </form>
    </div>
</div>
`;

function User_LoginAttempt()
{
    Utils_ShowExtraInfo();
    
    const username = document.getElementsByName('username')[0].value;
    const password = document.getElementsByName('password')[0].value;
    
    Prom_UserLogin(username, password)
    .then(res => {
        User_Flag_showLastLogin = true;
        Home_showHome();
        localStorage.setItem("token", res.data.token);
        User_LoadUser();
    })
    .catch(err => {
        document.querySelector('.extra-info span').innerHTML = "Error: " + err.reason;
    });
}

function User_LoginAction()
{
    Utils_ClearMain();
    document.getElementById("main").innerHTML = LoginHTML;
}

function User_LogoutAction()
{
    Prom_UserLogout(localStorage.getItem("username"), localStorage.getItem("token"));
    localStorage.setItem("token", "");
    User_LoadUser();
    Home_showHome();
}

function User_RegisterAttempt()
{
    Utils_ShowExtraInfo();
    document.querySelector('.extra-info span').innerHTML = "Loading";

    const username = document.getElementsByName('username')[0].value;
    const password = document.getElementsByName('password')[0].value;
    const repeatpassword = document.getElementsByName('repeatpassword')[0].value;

    if (password != repeatpassword) {
        document.querySelector('.extra-info span').innerHTML = "Error: Passwords are not the same";
        return ;
    }
    Prom_UserCreate(username, password)
    .then(res => {
        document.querySelector('.extra-info span').innerHTML = "Account created! You can now login";
    })
    .catch(err => {
        document.querySelector('.extra-info span').innerHTML = "Error: " + err.reason;
    })
}

function User_RegisterAction()
{
    Utils_ClearMain();
    document.getElementById("main").innerHTML = RegisterHTML;
}

function User_AdminAction()
{
    Dashboard_show();
}