/// VIEW for:   Home

const HomeHTML = `
    <div class="greeting-grid">
        <div class="greeting-entry">
            <h3>Help cats find a shelter</h3>
            <p>We want to provide to every cat a comfortable and cozy shelter, 
               so if you want to have a cat, you can adopt one. 
               Otherwise you can also help by telling us you have a cat 
               that needs a shelter so that other people can adopt it and take 
               care of it. Happy catcaring!</p>
        </div>
        <div class="adopt-entry">
            <p>Adopt and take care</p>
            <button class="btn" onclick="showAdopt()">Adopt</button> 
        </div>
        <div class="rescue-entry">
            <p>Help a cat find a warm place
            </p>
            <button class="btn" onclick="showRescue()">Rescue</button> 
        </div>
    </div>
`;

function showHome()
{
    clearMainClasses();
    mainEl = document.getElementById("main");

    mainEl.innerHTML = HomeHTML;
}