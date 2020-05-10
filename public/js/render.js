function DeleteAllWithClass(classSelector)
{
    var elements = document.getElementsByClassName(classSelector);
    for (i = 0; i < elements.length; ++i) {
        elements[i].remove();
    }
}

function renderNav()
{
    console.log("Rendering Navbar");
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

function renderFooter()
{
    console.log("Rendering Footer");
    DeleteAllWithClass("footer");
    let footer = document.createElement("footer");
    footer.classList.add("footer");
    footer.innerHTML = "\
        <p class=\"footer-p\">Made with ❤️ for &#x1f431;</p>\
        <p class=\"footer-p\">By Felix the cat !</p>";
    document.getElementById("allkat-app").appendChild(footer);
}

function renderHome()
{
    console.log("Render Home");
    DeleteAllWithClass("view-home");
    let main = document.createElement("main")
    main.classList.add("view-home");
    main.innerHTML = `
<main class="view-home">
        
    <div class="greeting-grid">
        <div class="greeting-entry">
            <h3>Help cats find a shelter</h3>
            <p>We want to provide to every cat a comfortable and cozy shelter, 
               so if you want to have a cat, you can adopt one. 
               Otherwise you can also help by telling us you have a cat 
               that needs a shelter so that other people can adopt it and take 
               care of it. Happy catcaring!</p>
        </div>
        <div class="adopt-entry">
            <p>Adopt and take care</p>
            <button class="btn" onclick="showAdopt()">Adopt</button> 
        </div>
        <div class="rescue-entry">
            <p>Help a cat find a warm place
            </p>
            <button class="btn" onclick="showRescue()">Rescue</button> 
        </div>
    </div>
</main>
    `;

    document.getElementById("allkat-app").appendChild(main);  
}

function renderCat(fatherNode, cat)
{
    console.log("Render Cat: ", cat);

    html = `
        <div>${cat.id}</div>
    `;

    catEl = document.createElement("div");
    catEl.classList.add("cat-card");
    catEl.innerHTML = html;

    fatherNode.appendChild(catEl);
}

function renderAllCats(allCats)
{
    DeleteAllWithClass("cats-flexbox");
    catsEl = document.createElement("div");
    catsEl.classList.add("cats-flexbox");
    
    Object.keys(allCats).forEach(id => {
        renderCat(catsEl, allCats[id]);
    });
    document.getElementsByClassName("view-cat")[0].appendChild(catsEl);

}