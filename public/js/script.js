let appState = "home"

function greetConsole()
{
    console.log("secret greet");
}

function showHome()
{
    appState = "home"
}

function showAdopt()
{
    appState = "adopt";
}

function showRescue()
{
    appState = "rescue";
    
}

greetConsole();