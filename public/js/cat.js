CatHTML = `
<div class="form-wrapper">
<div class="form-style">
    <form>
    <fieldset>
    <legend><i class="fas fa-info-circle"></i> More information about <span></span></legend>
    <input type="hidden" name="id" value="">
    <label>Name</label>
    <input type="text" class="input" name="name" placeholder="None - Cat's name">
    <label>Race</label>
    <input type="text" class="input" name="race" placeholder="None - Race of your cat">
    <label>Gender</label>
    <input type="text" class="input" name="gender" placeholder="None - Gender">
    <label>City</label>
    <input type="text" class="input" name="city" placeholder="None - City">
    <label for="availability">Availability:</label>
<select name="availability">
  <option value="free">Available</option>
  <option value="talk">Negotiating</option>
  <option value="taken">Taken</option>
</select>
    <label>About your cat</label>
    <textarea name="favorite_toy" placeholder="None - Favorite toy..."></textarea>
    <label>Address</label>
    <input type="text" class="input" name="full_address" placeholder="None - Where is your cat?">
    <label>Email</label>
    <input type="email" class="input" name="email" placeholder="None - Email">
    <label>Image link</label>
    <input type="text" class="input" name="image" placeholder="None - URL of your cat's photo">
    <label>Access token</label>
    <input type="text" class="input" name="token" placeholder="None - Access token here">      
    </fieldset>
    <input class="input" type="button" value="Update information" onclick="UpdateCatClick()" />
    <input class="input" type="button" value="Delete" onclick="DeleteCatClick()" />

    <div class="extra-info">
      <h4><span><span></h4>
      <i class="fas fa-times" onclick="CAT_HideExtraInfo()"></i>
    </div>

    </form>
    </div>
</div>`;

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

function UpdateCatClick()
{
    cat = {};
    catid = document.getElementsByName('id')[0].value;
    token = document.getElementsByName('token')[0].value;
    ["id", "availability", "name", "race", "gender", "city", "favorite_toy", "full_address", "email", "image", "token"].forEach(prop => {
        cat[prop] = document.getElementsByName(prop)[0].value;
    });
    console.log("trying to update: ");
    console.log(cat);
    Prom_UpdateSingleCat(cat).then(res => {
        if (res.status == "valid") {
            document.querySelector('h4>span').innerHTML = "Updated your cat!";
        }
        else {
            document.querySelector('h4>span').innerHTML = "Wrong access token or bad request";
        }
        CAT_ShowExtraInfo();
    });
}

function DeleteCatClick()
{
    catid = document.getElementsByName('id')[0].value;
    token = document.getElementsByName('token')[0].value;
    Prom_DeleteSingleCat(catid, token).then(res => {
        console.log("response from server: ");
        console.log(res);
        if (res.status == "valid") {
            showAdopt();
        }

        if (res.status != "valid") {
            document.querySelector('h4>span').innerHTML = "Wrong access token or bad request";
        }
        CAT_ShowExtraInfo();
    });
}

function PopulateForm(cat)
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

function showCat(catId)
{
    mainEl = document.getElementById("main")
    mainEl.innerHTML = CatHTML;

    document.getElementsByName('id')[0].value = catId;

    Prom_GetSingleCat(catId).then(res => {
        console.log("I got this cat to view: ");
        console.log(res);
        PopulateForm(res);
    });
}