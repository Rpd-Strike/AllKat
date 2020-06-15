let CatHTML = `Loading`;
let ViewHTML = `Loading`;

Prom_UtilGetHTML("edit_cat.html").then(res => {CatHTML = res});
Prom_UtilGetHTML("view_cat.html").then(res => {ViewHTML = res});

function CAT_ShowExtraInfo()
{
    element = document.getElementsByClassName('extra-info')[0];
    element.style.display = 'flex';
}

function CAT_HideExtraInfo()
{
    element = document.getElementsByClassName('extra-info')[0];
    element.style.display = 'none';
}

function Cat_UpdateCatClick()
{
    let cat = {};
    const token = localStorage.getItem("token");
    ["id", "name", "availability", "race", "gender", "city", "favorite_toy", "full_address", "email", "image"].forEach(prop => {
        cat[prop] = document.getElementsByName(prop)[0].value;
    });
    console.log("trying to update: ");
    console.log(cat);
    Prom_UpdateSingleCat(cat.id, token, cat)
    .then(res => {
        document.querySelector('h4>span').innerHTML = "Updated your cat!";
    })
    .catch(err => {
        document.querySelector('h4>span').innerHTML = "Error: " + err.reason;
    })
    .finally(() => {
        CAT_ShowExtraInfo();
    });
}

function Cat_DeleteCatClick()
{
    const catid = document.getElementsByName('id')[0].value;
    Prom_DeleteSingleCat(catid, localStorage.getItem("token"))
    .then(res => {
        Adopt_showAdopt();
    })
    .catch(err => {
        document.querySelector('h4>span').innerHTML = "Wrong access token or bad request";
        CAT_ShowExtraInfo();
    })
}

function Cat_PopulateForm(cat)
{
    document.querySelector('legend span').innerHTML = cat.name;
    document.getElementsByName('name')[0].value = cat.name;
    document.getElementsByName('race')[0].value = cat.race;
    document.getElementsByName('gender')[0].value = cat.gender;
    document.getElementsByName('city')[0].value = cat.city;
    document.getElementsByName('favorite_toy')[0].value = cat.favorite_toy;
    document.getElementsByName('full_address')[0].value = cat.full_address;
    document.getElementsByName('email')[0].value = cat.email;
    document.getElementsByName('image')[0].value = cat.image;
    document.getElementsByName('availability')[0].value = cat.availability;
}

function Cat_PopulateViewPage(cat, newsrc)
{
    const buttonHTML = `
    <button class="btn-view-page" onclick="Adopt_OnClickCat('${cat.id}')">
        <i class="fas fa-edit"></i>
        Edit
    </button>
    `;

    console.log(cat);
    document.querySelector('.vcg-img img').setAttribute('src', newsrc);
    document.querySelector('.vcg-name').textContent = cat.name;
    document.querySelector('.vcg-race').textContent = cat.race;
    document.querySelector('.vcg-gender').textContent = cat.gender;
    document.querySelector('.vcg-city').textContent = cat.city;
    document.querySelector('.vcg-availability .cat-ava-').className += cat.availability;
    document.querySelector('.vcg-fav-toy').textContent = cat.favorite_toy;
    document.querySelector('.vcg-address').textContent = cat.full_address;
    document.querySelector('.vcg-email').textContent = cat.email;
    document.querySelector('.vcg-user').textContent = cat.user;
    document.querySelector('.vcg-views span').textContent += cat.nr_viz;

    const loggedUser = localStorage.getItem("username").toLowerCase();
    if (loggedUser == cat.user || loggedUser == "admin")
        document.querySelector(".vcg-btn").innerHTML = buttonHTML;
}

function Cat_showEditCat(catId)
{
    mainEl = document.getElementById("main")
    mainEl.innerHTML = CatHTML;

    document.getElementsByName('id')[0].value = catId;

    Prom_GetSingleCat(catId).then(res => {
        cat = res.data;
        console.log("I got this cat to view: ");
        console.log(cat.cat);
        Cat_PopulateForm(cat.cat);
    });
}

function Cat_showViewCat(catId, newsrc)
{
    mainEl = document.getElementById("main")
    mainEl.innerHTML = ViewHTML;

    Prom_AddViewCount(catId);

    Prom_GetSingleCat(catId)
    .then(res => {
        const cat = res.data.cat;
        console.log(`I am showing this cat (id: ${cat.id})`);
        Cat_PopulateViewPage(cat, newsrc);
    })
}