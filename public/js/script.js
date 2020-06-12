function startScript()
{
    console.log("start script");
    Rend_CreateNav();
    Rend_CreateHome();
    Rend_CreateFooter();

    Home_showHome();

    User_LoadUser();
}

startScript();
