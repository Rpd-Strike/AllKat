/// VIEW for:   Create a cat

const RescueHTML = `
<div class="form-wrapper">
<div class="form-style-5">
    <form>
    <fieldset>
    <legend><span class="number"></span> Tell us about your cat</legend>
    <label>Name</label>
    <input type="text" name="name" placeholder="Cat's name">
    <label>Race</label>
    <input type="text" name="race" placeholder="Race of your cat">
    <label>Gender</label>
    <input type="text" name="gender" placeholder="Gender">
    <label>City</label>
    <input type="text" name="city" placeholder="City">
    <label>About your cat</label>
    <textarea name="favorite_toy" placeholder="Favorite toy..."></textarea>
    <label>Address</label>
    <input type="text" name="full_address" placeholder="Where is your cat?">
    <label>Email</label>
    <input type="email" name="email" placeholder="Email">
    <label>Image link</label>
    <input type="text" name="image" placeholder="URL of your cat's photo">
    </select>      
    </fieldset>
    <input type="button" value="Create Cat" onclick="formCatClick()" />

    <h4>Last cat token:  <span>- - -<span></h4>

    </form>
    </div>
</div>
`;

function showRescue()
{
    clearMainClasses();
    renderCreateCat();   
}

function renderCreateCat()
{
    main = document.getElementById("main");
    main.innerHTML = RescueHTML;
}

function generateCatData()
{
    let cat = {};
    cat.id = token(C_ID_LEN);
    cat.availability = "free";
    cat.name = document.getElementsByName('name')[0].value;
    cat.race = document.getElementsByName('race')[0].value;
    cat.gender = document.getElementsByName('gender')[0].value;
    cat.city = document.getElementsByName('city')[0].value;
    cat.favorite_toy = document.getElementsByName('favorite_toy')[0].value;
    cat.full_address = document.getElementsByName('full_address')[0].value;
    cat.email = document.getElementsByName('email')[0].value;
    cat.image = document.getElementsByName('image')[0].value;
    cat.token = token(C_TOKEN_LEN);
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
}

function formCatClick()
{
    let msg = "";
    const catData = generateCatData();

    if (!formValidation(catData)) {
        msg = "invalid form data";
    }
    else {
        msg = catData.token;

        console.log("Cat Data Received: ");
        console.log(catData);

        // document.getElementsByTagName("form")[0].
    }

    Prom_CreateSingleCat(catData).then(res => {
        console.log("Successfully created cat");
    });

    document.querySelector('h4>span').innerHTML = msg;

    resetForm();
}