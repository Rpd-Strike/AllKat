CatHTML = ``;

function showCat(catId)
{
    mainEl = document.getElementById("main")
    mainEl.innerHTML = ``;

    Prom_GetSingleCat(catId).then(res => {
        console.log("I got this cat to view: ");
        console.log(res);
    });
}