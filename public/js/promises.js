function generatePayload()
{

}

/// this function takes a fetch promise and wraps it to handle basic failures of it
function wrapperPromise(promise_request)
{
    return promise_request.then(response => {
        return response.json();
    })
}

async function Prom_GetSingleCat(catId)
{
    return fetch("cats/" + catId, {
        method : "GET",
        headers : {
            "Content-type": "application/json"
        },
    }).then(response => {
        return response.json();
    });
}

async function Prom_GetAllCats()
{
    return fetch("cats", { 
        method : "GET",
        headers : {
            "Content-type": "application/json"
        }
    }).then(response => {
        return response.json(); 
    })
}

async function Prom_DeleteSingleCat(catId, token)
{
    return fetch("cats/" + catId, {
        method : "DELETE",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify({ id : catId, token : token })
    }).then(response => {
        return response.json();
    });
}

async function Prom_UpdateSingleCat(cat)
{
    return fetch("cats/" + cat.id, {
        method : "PUT",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify(cat)
    }).then(response => {
        return response.json();
    });
}

async function Prom_CreateSingleCat(cat)
{
    console.log("Trying to create cat: ");
    console.log(cat);

    
    return fetch("cats", {
        method : "POST",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify(cat)
    }).then(response => {
        return response.json();
    });
}

async function Prom_TestToken(token)
{
    console.log("Testing token: " + token);

    let payload = generatePayload();
    payload.token = token;

    return fetch('user/test_token', {
        method : "GET",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify()
    })
}