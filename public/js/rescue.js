/// VIEW for:   Create a cat

const RescueHTML = `
<div class="form-wrapper">
<div class="form-style">
    <form>
    <fieldset>
    <legend><i class="fas fa-info-circle"></i> Tell us about your cat</legend>
    <label>Name</label>
    <input type="text" name="name" placeholder="None - Cat's name">
    <label>Race</label>
    <input type="text" name="race" placeholder="None - Race of your cat">
    <label>Gender</label>
    <input type="text" name="gender" placeholder="None - Gender">
    <label>City</label>
    <input type="text" name="city" placeholder="None - City">
    <label>About your cat</label>
    <textarea name="favorite_toy" placeholder="None - Favorite toy..."></textarea>
    <label>Address</label>
    <input type="text" name="full_address" placeholder="None - Where is your cat?">
    <label>Email</label>
    <input type="email" name="email" placeholder="None - Email">
    <label>Image link</label>
    <input type="text" name="image" placeholder="None - URL of your cat's photo">
    </select>      
    </fieldset>
    <input type="button" value="Create Cat" onclick="formCatClick()" />

    <div class="extra-info">
      <h4><span><span></h4>
      <i class="fas fa-times" onclick="RESCUE_HideExtraInfo()"></i>
    </div>

    </form>
    </div>
</div>
`;
 
function RESCUE_ShowExtraInfo()
{
    element = document.getElementsByClassName('extra-info')[0];
    element.style.display = 'flex';
}

function RESCUE_HideExtraInfo()
{
    element = document.getElementsByClassName('extra-info')[0];
    element.style.display = 'none';
}

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
    cat.id = generate_token(C_ID_LEN);
    cat.availability = "free";
    cat.name = document.getElementsByName('name')[0].value;
    cat.race = document.getElementsByName('race')[0].value;
    cat.gender = document.getElementsByName('gender')[0].value;
    cat.city = document.getElementsByName('city')[0].value;
    cat.favorite_toy = document.getElementsByName('favorite_toy')[0].value;
    cat.full_address = document.getElementsByName('full_address')[0].value;
    cat.email = document.getElementsByName('email')[0].value;
    cat.image = document.getElementsByName('image')[0].value;
    cat.availability = 'free';
    cat.token = generate_token(C_TOKEN_LEN);
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
    RESCUE_HideExtraInfo();
}

function formCatClick()
{
    let msg = "";
    const catData = generateCatData();

    if (!formValidation(catData)) {
        msg = "invalid form data";
    }
    else {
        msg = "Generated token: " + catData.token;

        console.log("Cat Data Received: ");
        console.log(catData);

        Prom_CreateSingleCat(catData).then(res => {
            console.log("Successfully created cat");
        });
    }

    document.querySelector('.extra-info span').innerHTML = msg;

    resetForm();
    RESCUE_ShowExtraInfo();
}