
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

async function Prom_UpdateSingleCat(cat)
{
    const promise_getter = () => fetch("cats/" + cat.id, {
        method : "PUT",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify(cat)
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

/// ===== User =======

function Prom_UserLogin(username, password)
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