function showAdopt()
{
    mainEl = document.getElementById("main")
    mainEl.innerHTML = ``;
    // mainEl.classList.add("view-cat");

    /// Maybe time this operation for Final Project

    Prom_GetAllCats().then(resp => {
        console.log("Show Adopt: Received cats from Server: ");
        console.log(resp);
        renderAllCats(resp);
    });
}

function renderCat(fatherNode, cat)
{
    console.log("Render Cat: ", cat);

    html = `
        <img src="${cat.image}">
        <button class="btn-cat-info" onclick="OnClickCat('${cat.id}')">
          <i class="fas fa-info-circle"></i>
          More
        </button>
        <div class="card-availability" class="card-status-${cat.availability}">Availability</div>
        <p class="card-name"><span>Name:</span> ${cat.name}</p>
        <p class="card-race"><span>Race:</span> ${cat.race}</p>
        <p class="card-gender"><span>Gender:</span> ${cat.gender}</p>
        <p class="card-fav"><span>Fav. toy:</span> ${cat.favorite_toy}</p>
    `;

    catEl = document.createElement("div");
    catEl.classList.add("cat-card");
    catEl.innerHTML = html;

    fatherNode.appendChild(catEl);
}

function renderAllCats(allCats)
{
    DeleteAllWithClass("cats-flexbox");
    catsEl = document.createElement("div");
    catsEl.classList.add("cats-flexbox");
    
    Object.keys(allCats).forEach(id => {
        console.log("before render id: " + id);
        renderCat(catsEl, allCats[id]);
    });

    document.getElementById("main").appendChild(catsEl);
}