let dashboardHTML = 'Loading';

Prom_UtilGetHTML("dashboard.html").then(res => {dashboardHTML = res});

function Dashboard_show(message = '')
{
    Utils_clearMainClasses();
    mainEl = document.getElementById("main");

    mainEl.innerHTML = dashboardHTML;

    Dashboard_setShowList();
    Dashboard_loadRenderUsers();
    Dashboard_showToastMessage(message);
}

function Dashboard_addUser()
{
	Dashboard_setCreateForm();
}

function Dashboard_AddAttempt()
{
	Utils_ShowExtraInfo();
    document.querySelector('.extra-info span').innerHTML = "Loading";

    const username = document.getElementsByName('create-username')[0].value;
    const password = document.getElementsByName('create-password')[0].value;
    const repeatpassword = document.getElementsByName('create-repeatpassword')[0].value;

	console.log("data: ");
	console.log(username + " | " + password + " | " + repeatpassword + " | ");

    if (password != repeatpassword) {
        document.querySelector('.extra-info span').innerHTML = "Error: Passwords are not the same";
        return ;
    }
    Prom_UserCreate(username, password)
    .then(res => {
        document.querySelector('.extra-info span').innerHTML = "Account created!";
    })
    .catch(err => {
        document.querySelector('.extra-info span').innerHTML = "Error: " + err.reason;
    })
}

function Dashboard_showToastMessage(message)
{
	if (!message || message == '')
		return;
	console.log("pls work TOAST MESAGE");
	let x = document.getElementById("toast")
    x.className = "toast-show";
    document.getElementById("toast-desc").innerText = message;
    setTimeout(function(){ 
		x.className = x.className.replace("toast-show", ""); 
	}, 5000);
}

function Dashboard_setShowList()
{
    let userGrid = document.querySelector('.users-grid');
    let createForm = document.querySelector('.create-form');
    userGrid.classList.remove("hidden");
	createForm.classList.add("hidden");

	document.querySelector(".dash-list").classList.add("dash-active");
	document.querySelector(".dash-create").classList.remove("dash-active");
}

function Dashboard_setCreateForm()
{
    let userGrid = document.querySelector('.users-grid');
    let createForm = document.querySelector('.create-form');
    userGrid.classList.add("hidden");
    createForm.classList.remove("hidden");

	document.querySelector(".dash-create").classList.add("dash-active");
	document.querySelector(".dash-list").classList.remove("dash-active");
}

function Dashboard_setErrorContent(reason)
{
    let userGrid = document.querySelector('.users-grid');
    userGrid.innerHTML = `<p>${reason}</p>`;
}

function Dashboard_loadRenderUsers()
{
    function generateRenderUserCard(father, userData)
    {
        const userCardHTML = `
            <p class="uc-name">${userData.username}</p>
            <div class="uc-status-info">
              <span>Status:</span>
              ${userData.blocked ? '<i class="fas fa-ban"></i>' : '<i class="fas fa-check"></i>'}
            </div>
            <div class="uc-status" onclick="Dashboard_toggleBlock('${userData.username}')">
              <i class="fas fa-exchange-alt"></i>
            </div>
            <div class="uc-text">
              <input type="password" name="password" placeholder="New password">
            </div>
            <div class="uc-reset-btn" onclick="Dashboard_resetPass('${userData.username}')">
              <i class="far fa-save"></i>
            </div>
            <div class="uc-delete-btn">
              <button class="btn-delete-user" onclick="Dashboard_DeleteUser('${userData.username}')">
                <i class="fas fa-trash-alt"></i>
                Delete  
              </button>    
            </div>
        `;

        let card = document.createElement('div');
        card.classList.add('user-card');
        card.innerHTML = userCardHTML;

        father.appendChild(card);       
    }

    let userGrid = document.querySelector('.users-grid');
    userGrid.innerHTML = ``;

    Prom_GetAllUsers(localStorage.getItem("token"))
    .then(res => {
        console.log("Receined users from server: ");
        const users = res.data.user_list;
        Object.keys(users).forEach(uid => {
            generateRenderUserCard(userGrid, users[uid]);
        });
    })
    .catch(err => {
        console.log("Error getting list of users from server: " + err.reason);
        Dashboard_setErrorContent(err.reason);
    })
}

function Dashboard_cardHTMLNode(username)
{
	let tags = document.getElementsByTagName('p');
	for (let i = 0; i < tags.length; i++) {
		if (tags[i].innerText == username)
			return tags[i].parentNode;
	}
}

function Dashboard_toggleBlock(username)
{
	let fatherNode = Dashboard_cardHTMLNode(username);
	let banNode = fatherNode.querySelector("i.fa-ban");
	let toggled = true;
	if (banNode) {
		if (banNode.parentNode)
			toggled = false;
	}

	Prom_SetUserBlock(localStorage.getItem("token"), username, toggled)
	.then(res => {
		Dashboard_show("Operation successful");
	})
	.catch(err => {
		Dashboard_show("Operation failed, reason: " + err.reason);
	})
}

function Dashboard_resetPass(username)
{
	  let fatherNode = Dashboard_cardHTMLNode(username);
	  console.log(fatherNode);
	  let password = fatherNode.querySelector('input[name="password"]').value;

	  Prom_SetPassword(localStorage.getItem("token"), username, password)
	  .then(res => {
		  Dashboard_show("Operation successful");
	  })
	  .catch(err => {
		  Dashboard_show("Operation failed, reason: " + err.reason);
	  })
}

function Dashboard_DeleteUser(username)
{
	Prom_DeleteUser(localStorage.getItem("token"), username)
	.then(res => {
		Dashboard_show("Operation successful");
	})
	.catch(err => {
		Dashboard_show("Operation failed (delete), reason: " + err.reason);
	})
}