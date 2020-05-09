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
        body : { id : catId }
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
        body : cat
    }).then(response => {
        return response.json();
    });
}

async function Prom_CreateSingleCat(cat)
{
    return fetch("cats/" + catId, {
        method : "POST",
        headers : {
            "Content-type": "application/json"
        },
        body : cat
    }).then(response => {
        return response.json();
    });
}