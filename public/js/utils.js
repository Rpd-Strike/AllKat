const C_ID_LEN    = 20;
const C_TOKEN_LEN = 10;

function DeleteAllWithClass(classSelector)
{
    var elements = document.getElementsByClassName(classSelector);
    for (i = 0; i < elements.length; ++i) {
        elements[i].remove();
    }
}

function clearMainClasses()
{
    document.getElementById('main').className = '';
}

function generate_token(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log("Token called with " + length + " - " + result);
    return result;
}