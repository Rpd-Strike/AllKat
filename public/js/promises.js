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

async function Prom_DeleteSingleCat(catId)
{
    return fetch("cats/" + catId, {
        method : "DELETE",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify({ id : catId })
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