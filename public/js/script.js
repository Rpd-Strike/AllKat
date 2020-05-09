let appState = "home"

function greetConsole()
{
    console.log("secret greet");
    renderNav();
    renderHome();
    renderFooter();
}

function showHome()
{
    appState = "home";
    renderHome();
}

function showAdopt()
{
    appState = "adopt";
    
    document.getElementsByTagName("main")[0].remove();
    mainEl = document.createElement("main");
    mainEl.classList.add("cat-view");

    document.getElementById("allkat-app").appendChild(mainEl);
    console.log("new Main cat-view")

    Prom_GetAllCats().then(resp => {
        console.log("Show Adopt: Received cats from Server: ");
        console.log(resp);
        renderAllCats(resp);
    });
}

function showRescue()
{
    appState = "rescue";
    
}

greetConsole();

function myTestFunc()
{
    myCat = {
        "id" : "someCat id huehue",
        "content" : "some Content"
    };

    fetch("http://localhost:3000/cats", {
        method : "post",
        headers: {
            "Content-type": "application/json"
        },
        body : JSON.stringify(myCat)
    }).then(response => {
        response.json().then(res => {
            console.log(typeof(res));
            console.log(res);
        })
    }).catch(error => {
        console.log("Error using fetch: ");
        console.log(error);
    });
}