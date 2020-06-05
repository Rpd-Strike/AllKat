/// this function checks if the token in the localStorage is Valid
/// Also sets the name of the user accordingly: (Guest, User-Name, Admin)
function loadUser()
{
    function showLogin() {
        DeleteAllWithClass('nav-user');
        document.querySelector('nav.nav').innerHTML += `
    <button class="btn nav-user" onclick="Login()">Login</button>
    <button class="btn nav-user" onclick="Register()">Register</button></nav>
    `;
    }

    function showLoggedUser() {
        DeleteAllWithClass('nav-user');
        document.querySelector('nav.nav').innerHTML += `
    <button class="btn nav-user" onclick="Logout()">Logout</button>
    <span class="nav-user">${localStorage.getItem("username")}</span>
    `;
    }

    function setGuest() {
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
        Prom_TestToken(localStorage.getItem("token")).then(user_status => {
            localStorage.setItem("username", user_status.user_name);
            const adminString = (user_status.user_name.toLowerCase() == "admin" ? "true" : "false");
            localStorage.setItem("isAdmin", adminString);
            showLoggedUser();
        }).catch(bad => {
            setGuest();
        })
    }
}

function startScript()
{
    console.log("start script");
    CreateNav();
    CreateHome();
    CreateFooter();

    showHome();

    loadUser();
}

startScript();
