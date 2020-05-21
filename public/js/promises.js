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