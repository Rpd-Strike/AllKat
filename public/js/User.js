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
    <button class="btn nav-user" onclick="Logout()">Logout</button>
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
    <legend><i class="fas fa-sign-in-alt"></i> Login </legend>
    <label>Username</label>
    <input class="input" type="text" name="username" placeholder="Your username">
    <label>Password</label>
    <input type="text" class="input" name="password" placeholder="Password">
          
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

function User_RegisterAction()
{
    Utils_ClearMain();
    Rend_Register();
}