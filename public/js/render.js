function CreateNav()
{
    console.log("Creating Navbar");
    DeleteAllWithClass("nav");
    let navbar = document.createElement("nav");
    navbar.classList.add("nav");
    
    navbar.innerHTML = `
        <img class="nav-logo" src="img/logo.png" alt="All Kat Updated" onclick="showHome()">
        <button class="btn" onclick="showAdopt()">Adopt</button>
        <button class="btn" onclick="showRescue()">Rescue</button>
    `
    document.getElementById("allkat-app").appendChild(navbar);
}

function CreateHome()
{
    let main = document.createElement("main");
    main.id = "main";
    document.getElementById("allkat-app").appendChild(main);
}

function CreateFooter()
{
    console.log("Creating Footer");
    DeleteAllWithClass("footer");
    let footer = document.createElement("footer");
    footer.classList.add("footer");
    footer.innerHTML = "\
        <p class=\"footer-p\">Made with ❤️ for &#x1f431;</p>\
        <p class=\"footer-p\">By Felix the cat !</p>\
        <p class=\"footer-p\">Last time visited: <span></span></p>";
    document.getElementById("allkat-app").appendChild(footer);
    let date = "";
    if (window.localStorage.getItem("date") === null) {
        date = "This is your first visit!";
    }
    else {
        date = window.localStorage.getItem("date");
    }
    document.querySelector(".footer span").innerHTML = date;

    const now = new Date().toLocaleString();
    window.localStorage.setItem("date", now);
}

