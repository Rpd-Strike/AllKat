/// VIEW for:   Create a cat

const RescueHTML = `
<div class="form-wrapper">
<div class="form-style">
    <form>
    <fieldset>
    <legend><i class="fas fa-info-circle"></i> Tell us about your cat</legend>
    <label>Name</label>
    <input class="input" type="text" name="name" placeholder="None - Cat's name">
    <label>Race</label>
    <input type="text" class="input" name="race" placeholder="None - Race of your cat">
    <label>Gender</label>
    <input type="text" class="input" name="gender" placeholder="None - Gender">
    <label>City</label>
    <input type="text" class="input" name="city" placeholder="None - City">
    <label>About your cat</label>
    <textarea name="favorite_toy" placeholder="None - Favorite toy..."></textarea>
    <label>Address</label>
    <input type="text" class="input" name="full_address" placeholder="None - Where is your cat?">
    <label>Email</label>
    <input type="email" class="input" name="email" placeholder="None - Email">
    <label>Image link</label>
    <input type="text" class="input" name="image" placeholder="None - URL of your cat's photo">
    </select>      
    </fieldset>
    <input class="input" type="button" value="Create Cat" onclick="formCatClick()" />

    <div class="extra-info">
      <h4><span><span></h4>
      <i class="fas fa-times" onclick="Utils_HideExtraInfo()"></i>
    </div>

    </form>
    </div>
</div>
`;

const RescueNoUserHTML = `
    <p class="info-message">You have to be logged in to use this feature</p>
`;


function showRescue()
{
    Utils_clearMainClasses();
    if (localStorage.getItem("username").toLowerCase() == "guest") {
        main = document.getElementById("main");
        main.innerHTML = RescueNoUserHTML;
    }
    else {
        renderCreateCat();   
    }
}

function renderCreateCat()
{
    main = document.getElementById("main");
    main.innerHTML = RescueHTML;
}

function generateCatData()
{
    let cat = {};
    cat.availability = "free";
    cat.name = document.getElementsByName('name')[0].value;
    cat.race = document.getElementsByName('race')[0].value;
    cat.gender = document.getElementsByName('gender')[0].value;
    cat.city = document.getElementsByName('city')[0].value;
    cat.favorite_toy = document.getElementsByName('favorite_toy')[0].value;
    cat.full_address = document.getElementsByName('full_address')[0].value;
    cat.email = document.getElementsByName('email')[0].value;
    cat.image = document.getElementsByName('image')[0].value;
    return cat;
}

function formValidation(cat)
{
    if (cat.name.length < 1)
        return 0;
    return 1;
}

function resetForm()
{
    document.getElementsByName('name')[0].value = "";
    Utils_HideExtraInfo();
}

function formCatClick()
{
    msg = "Loading";
    document.querySelector('.extra-info span').innerHTML = msg;

    const catData = generateCatData();

    if (!formValidation(catData)) {
        msg = "invalid form data";
        document.querySelector('.extra-info span').innerHTML = msg;
    }
    else {
        /// test
        let reqData = {cat: catData, token: localStorage.getItem("token")};
        console.log("Trying to create cat on behalf of: " + localStorage.getItem("username") + " with token: " + localStorage.getItem("token"));

        Prom_CreateSingleCat(reqData)
        .then(res => {
            console.log(res);
            msg = `Created cat with id: ` + res.data.id;
        })
        .catch(err => {
            console.log(err);
            msg = `Error, reason:  ` + err.reason;  
        })
        .finally(() => {
            console.log("finally: " + msg);
            document.querySelector('.extra-info span').innerHTML = msg;
        })
    }

    resetForm();
    Utils_ShowExtraInfo();
}