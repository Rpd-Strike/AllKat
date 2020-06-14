/// this function checks if the token in the localStorage is Valid
/// Also sets the name of the user accordingly: (Guest, User-Name, Admin)
function User_LoadUser()
{
    function showLogin() {
        Utils_DeleteAllWithClass('nav-user');
        document.querySelector('nav.nav').innerHTML += `
    <button class="btn nav-user" onclick="User_LoginAction()">Login</button>
    <button class="btn nav-user" onclick="User_RegisterAction()">Register</button></nav>
    `;
    }

    function showLoggedUser() {
        Utils_DeleteAllWithClass('nav-user');
        document.querySelector('nav.nav').innerHTML += `
    <button class="btn nav-user" onclick="User_LogoutAction()">Logout</button>
    <span class="nav-user">${localStorage.getItem("username")}</span>
    `;
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