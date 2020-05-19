function CreateNav()
{
    console.log("Creating Navbar");
    DeleteAllWithClass("nav");
    let navbar = document.createElement("nav");
    navbar.classList.add("nav");
    navbar.innerHTML = `
        <img class="nav-logo" src="img/logo.png" alt="All Kat Updated" onclick="showHome()">
        <!-- From RENDER
        <div class="nav-divider"></div>
        <button class="btn" onclick="showRescue()">Rescue</button> -->
        <div id="size-identificator"></div>
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
        <p class=\"footer-p\">By Felix the cat !</p>";
    document.getElementById("allkat-app").appendChild(footer);
}

