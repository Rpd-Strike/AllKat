function CreateNav()
{
    console.log("Creating Navbar");
    DeleteAllWithClass("nav");
    let navbar = document.createElement("nav");
    navbar.classList.add("nav");
    
    let img = document.createElement('img');
    img.setAttribute('class', 'nav-logo');
    img.setAttribute('src', 'img/logo.png');
    img.setAttribute('alt', 'All Kat Updated');
    img.setAttribute('onclick', 'showHome()');

    navbar.appendChild(img);

    let adopt = document.createElement('button');
    adopt.setAttribute('class', 'btn');
    adopt.setAttribute('onclick', 'showAdopt()');
    adopt.textContent = 'Adopt';

    navbar.appendChild(adopt); 

    let rescue = document.createElement('button');
    rescue.setAttribute('class', 'btn');
    rescue.setAttribute('onclick', 'showRescue()');
    rescue.textContent = 'Rescue';

    navbar.appendChild(rescue);

    document.getElementById("allkat-app").appendChild(navbar);

    // // navbar.innerHTML = `
    // //     <img class="nav-logo" src="img/logo.png" alt="All Kat Updated" onclick="showHome()">
    // //     <button class="btn" onclick="showAdopt()">Adopt</button>
    // //     <button class="btn" onclick="showRescue()">Rescue</button>
    // // `
    
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

