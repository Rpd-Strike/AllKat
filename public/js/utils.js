const C_ID_LEN    = 20;
const C_TOKEN_LEN = 10;

function Utils_DeleteAllWithClass(classSelector)
{
    var elements = document.getElementsByClassName(classSelector);
    while (elements.length > 0) {
        elements[0].remove();
    } 
}

function Utils_clearMainClasses()
{
    document.getElementById('main').className = '';
}

// function Utils_generate_token(length) {
//     var result           = '';
//     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for ( var i = 0; i < length; i++ ) {
//        result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     console.log("Token called with " + length + " - " + result);
//     return result;
// } 

function Utils_ClearMain()
{
    mainEl = document.getElementById("main")
    mainEl.innerHTML = ``;
}

function badResponse(message) {
    console.log("hmm returning bad response");
    return {
        status: "BAD",
        reason: message
    }
}

function Utils_ShowExtraInfo()
{
    element = document.getElementsByClassName('extra-info')[0];
    element.style.display = 'flex';
}

function Utils_HideExtraInfo()
{
    element = document.getElementsByClassName('extra-info')[0];
    element.style.display = 'none';
}