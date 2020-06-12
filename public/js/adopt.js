function Adopt_showAdopt()
{
    Utils_ClearMain();

    /// Maybe time this operation for Final Project

    Prom_GetAllCats().then(resp => {
        const allCats = resp.data;
        console.log("Show Adopt: Received cats from Server: ");
        console.log(allCats);
        Adopt_renderAllCats(allCats);

        if (Object.keys(allCats).length < 1) {
            Adopt_renderEmptyMsg();
        }
    });
}

function Adopt_renderEmptyMsg()
{
    Utils_DeleteAllWithClass("cats-flexbox");
    catsEl = document.createElement("div");
    catsEl.classList.add("cats-flexbox");

    element = document.createElement("div");
    paragraf = document.createElement("h4");
    paragraf.innerText = "Ooops! Looks like there are no cats!";

    element.appendChild(paragraf);
    catsEl.appendChild(element);

    document.getElementById("main").appendChild(catsEl);
}

function Adopt_renderCat(fatherNode, cat)
{
    // console.log("Render Cat: ", cat);

    /// interpretare a template engine in browser. IMPORTANT

    html = `
        <img src="${cat.image}">
        <button class="btn-cat-info" onclick="Adopt_OnClickCat('${cat.id}')">
          <i class="fas fa-info-circle"></i>
          More
        </button>
        <div class="card-availability card-status-${cat.availability}">
          <div></div>
          <span>Availability</span>
        </div>
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

function Adopt_renderAllCats(allCats)
{
    Utils_DeleteAllWithClass("cats-flexbox");
    catsEl = document.createElement("div");
    catsEl.classList.add("cats-flexbox");
    
    Object.keys(allCats).forEach(id => {
        console.log("before render id: " + id);
        Adopt_renderCat(catsEl, allCats[id]);
    });

    document.getElementById("main").appendChild(catsEl);
}

function Adopt_OnClickCat(catId)
{
    Cat_showCat(catId);
}