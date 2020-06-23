
/// this function takes a fetch promise and wraps it to handle basic failures of it
function wrapperPromise(fetch_getter)
{
    console.log("wrapper Promise");
    
    return fetch_getter()
        .catch(err => Promise.reject(badResponse("Network or server error")))
        .then(response => response.json())
        .catch(err => {
            /// aici am eroare doar de la resp.json()
            if (typeof err.reason != 'undefined')
                err = badResponse("JSON parse error");
            
            console.log("Promise error reason: " + err.reason);
            return Promise.reject(err);
        })
        .then(resp => {
            /// if i have bad request, then reject
            console.log("Promise fullfilled: ");
            console.log(resp);
            if (typeof resp.reason != 'undefined')
                return Promise.reject(resp);
            /// no errors, finally
            return Promise.resolve(resp);
        })
}

async function Prom_GetSingleCat(catId)
{
    const promise_getter = () => fetch("api/cat/single/" + catId, {
        method : "GET",
        headers : {
            "Content-type": "application/json"
        }
    });
    return wrapperPromise(promise_getter);
}

async function Prom_GetAllCats()
{
    const promise_getter = () => fetch("api/cat/all", { 
        method : "GET",
        headers : {
            "Content-type": "application/json"
        }
    });
    return wrapperPromise(promise_getter);
}

async function Prom_DeleteSingleCat(catId, token)
{
    const promise_getter = () => fetch("api/cat/single/delete", {
        method : "DELETE",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify({ id : catId, token : token })
    });
    return wrapperPromise(promise_getter);
}

async function Prom_UpdateSingleCat(catID, token, cat)
{
    const promise_getter = () => fetch("api/cat/" + catID, {
        method : "PUT",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify({token: token,
                               cat: cat})
    });
    return wrapperPromise(promise_getter);
}

async function Prom_CreateSingleCat(cat)
{
    console.log("Trying to create cat: ");
    console.log(cat);
    
    const promise_getter = () => fetch("api/cat/create", {
        method : "POST",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify(cat)
    }); 
    return wrapperPromise(promise_getter);
}

async function Prom_TestToken(token)
{
    console.log("Testing token: " + token);

    const promise_getter = () => fetch('api/user/test_token/' + token, {
        method : "GET",
        headers : {
            "Content-type": "application/json"
        }
    });
    return wrapperPromise(promise_getter);
}

async function Prom_AddViewCount(catId)
{
    console.log("Adding one view to cat: " + catId);

    const promise_getter = () => fetch('api/cat/view/' + catId, {
        method : "PUT",
        headers : {
            "Content-type": "application/json"
        }
    });
    return wrapperPromise(promise_getter);
}

/// ===== User =======

async function Prom_UserLogin(username, password)
{
    console.log("Login promise:");
    console.log(username);
    console.log(password);
    const promise_getter = () => fetch('api/user/login', {
        method: "PUT",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify({username: username,
                               password: password})
    });
    return wrapperPromise(promise_getter);
}

async function Prom_UserLogout(username, token)
{
    console.log("Logout promise:");
    const promise_getter = () => fetch('api/user/logout', {
        method: "DELETE",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify({username: username,
                               token: token})
    });
    return wrapperPromise(promise_getter);
}

async function Prom_UserCreate(username, password)
{
    console.log("Create user promise:");
    const promise_getter = () => fetch('api/user/create', {
        method : "POST",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify({username: username,
                               password: password})
    });
    return wrapperPromise(promise_getter);
}

async function Prom_UtilGetHTML(filepath)
{
    console.log("Promise for html: " + filepath);
    return new Promise(function(resolve, reject) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "templates/" + filepath, true);
        xmlhttp.onload = function () {
            var status = xmlhttp.status;
            if (status == 200) {
                resolve(xmlhttp.responseText);
            } else {
                reject("Bad Get HTML Request");
            }
        };
        xmlhttp.send();
    });
}

async function Prom_GetAllUsers(token)
{
    console.log("Promise getting all users information");
    const promise_getter = () => fetch('api/admin/all/' + token, {
        method : "GET",
        headers : {
            "Content-type": "application/json"
        }
    });
    return wrapperPromise(promise_getter);
}

async function Prom_SetUserBlock(token, username, status)
{
    console.log("Promise set user status");
    const promise_getter = () => fetch('api/admin/block', {
        method : "PUT",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify({
            token: token,
            user: username,
            status: status
        })
    });
    return wrapperPromise(promise_getter);
}

async function Prom_SetPassword(token, username, password)
{
    console.log("Promise set user status");
    const promise_getter = () => fetch('api/admin/reset', {
        method : "PUT",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify({
            token: token,
            user: username,
            password: password
        })
    });
    return wrapperPromise(promise_getter);
}

async function Prom_DeleteUser(token, username)
{
    console.log("Promise set user status");
    const promise_getter = () => fetch('api/admin', {
        method : "DELETE",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify({
            token: token,
            user: username
        })
    });
    return wrapperPromise(promise_getter);
}