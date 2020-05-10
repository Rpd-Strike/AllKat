let appState = "home"

function greetConsole()
{
    console.log("secret greet");
    renderNav();
    renderHome();
    renderFooter();
    AddModalHTML();
}

function showHome()
{
    appState = "home";

    DeleteModal();

    document.getElementsByTagName("main")[0].remove();
    mainEl = document.createElement("main");
    mainEl.classList.add("view-home");
    
    renderHome();
}

function showAdopt()
{
    appState = "adopt";
    DeleteModal();
    
    document.getElementsByTagName("main")[0].remove();
    mainEl = document.createElement("main");
    mainEl.classList.add("view-cat");

    document.getElementById("allkat-app").appendChild(mainEl);
    console.log("new Main view-cat");

    Prom_GetAllCats().then(resp => {
        console.log("Show Adopt: Received cats from Server: ");
        console.log(resp);
        renderAllCats(resp);
    });
}

function showRescue()
{
    appState = "rescue";
    DeleteModal();   
}

greetConsole();

function OnClickCat(catId)
{
    console.log("Cat more button presesd: " + catId);

    modal = document.getElementsByClassName("cat-modal")[0];
    modal.classList.remove("closed");
    modal.classList.add("open");
}