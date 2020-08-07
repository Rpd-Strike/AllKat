function Adopt_showAdopt()
{
    Utils_ClearMain();

    /// Maybe time this operation for Final Project

    Prom_GetAllCats().then(resp => {
        const allCats = resp.data.cat_list;
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
    paragraf.innerText = "Ooops! Looks like there are no cats! Go and rescue them, then add them in the 'Rescue' section";

    element.appendChild(paragraf);
    catsEl.appendChild(element);

    document.getElementById("main").appendChild(catsEl);
}

function Adopt_renderCat(fatherNode, cat)
{
    /// interpretare a template engine in browser. IMPORTANT
    const viewsComp = `
    <span class="cat-nr-views">
        <i class="far fa-eye"></i>
        <span>${cat.nr_viz}</span>
    </span>
    `;

    const buttonHTML = `
    <button class="btn-cat-info" onclick="Adopt_OnClickCat('${cat.id}')">
        <i class="fas fa-edit"></i>
        Edit
    </button>
    `;

    /// truc pentru src actualizat in caz de eroare
    const html = `
        <a class="darken">
            <img class="actual" src="${cat.image}" 
                 onerror="console.log('Error loading cat image');this.onerror=null;this.src='/img/missing-cat-2.jpg';"
                 onclick="Adopt_showCat('${cat.id}', this.src)">
        </a>
        <div class="card-availability card-status-${cat.availability}">
          ${viewsComp}
          <div></div>
        </div>
        ${cat.user.toLowerCase() == localStorage.getItem("username").toLowerCase() ? 
          buttonHTML : (localStorage.getItem("username").toLowerCase() == "admin" ? buttonHTML : "")
        }
        <p class="card-name"><span>Name:</span> ${cat.name}</p>
        <p class="card-race"><span>Race:</span> ${cat.race}</p>
        <p class="card-gender"><span>Gender:</span> ${cat.gender}</p>
        <p class="card-fav"><span>About:</span> ${cat.favorite_toy}</p>
    `;

    catEl = document.createElement("div");
    catEl.classList.add("cat-card");
    catEl.innerHTML = html;

    fatherNode.appendChild(catEl);
}

/// TASK 1 vizualizari
function Adopt_showCat(catId, newsrc)
{
    // console.log(newsrc);
    Cat_showViewCat(catId, newsrc);
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
    Cat_showEditCat(catId);
}