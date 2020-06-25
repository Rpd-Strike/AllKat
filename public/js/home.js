/// VIEW for:   Home

const ravas_texte = [
    `Time spent with cats is never wasted`,
    `Cats choose us, we don't own them`,
    `In a cat's eye, all things belong to cats.`,
    `A cat will be your friend, but never your slave.`,
    `As every cat owner knows, nobody owns a cat.`,
    `If cats could talk, they wouldn’t.`,
    `Cats are connoisseurs of comfort.`,
];

const ravas_element = `
    <p>${ravas_texte[Utils_Random(0, ravas_texte.length)]}</p> 
    <i class="fa fa-refresh" aria-hidden="true" onclick=Home_showRavasText()></i>
`;

const HomeHTML = `
    <div class="greeting-grid">
        <div class="greet-title">
            <h3>Help cats find a shelter</h3>
        </div>
        <div class="greet-ravas">
            ${ravas_element}
        </div>
        <div class="greet-text">
            <p>We want to provide to every cat a comfortable and cozy shelter, 
               so if you want to have a cat, you can adopt one. 
               Otherwise you can also help by telling us you have a cat 
               that needs a shelter so that other people can adopt it and take 
               care of it. Happy catcaring!</p>
        </div>
        <div class="adopt-entry">
            <p>Adopt and take care</p>
            <button class="btn" onclick="Adopt_showAdopt()">Adopt</button> 
        </div>
        <div class="rescue-entry">
            <p>Help a cat find a warm place
            </p>
            <button class="btn" onclick="showRescue()">Rescue</button> 
        </div>
    </div>
    <div id="snackbar">21  132 sge..</div>
`;

/// TASK 2 ravas
function Home_showRavasText()
{
    const randomPos = Utils_Random(0, 6);
    document.querySelector('.greet-ravas p').textContent = ravas_texte[randomPos];
}

function Home_showHome()
{
    Utils_clearMainClasses();
    mainEl = document.getElementById("main");

    mainEl.innerHTML = HomeHTML;
}

/// TASK 3 Last login
function Home_showLastLogin(message) {
    var x = document.getElementById("snackbar");

    x.className = "show";
    x.textContent = message;

    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
}