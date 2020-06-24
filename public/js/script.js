function startScript()
{
    
    console.log("start script");
    Rend_CreateNav();
    Rend_CreateHome();
    Rend_CreateFooter();
    
    User_Flag_showLastLogin = true;
    
    Home_showHome();

    User_LoadUser();

    /// watcher for online list
    let onlineInterval = new Interval(Online_watcher, 1000);
    onlineInterval.start();
}

startScript();