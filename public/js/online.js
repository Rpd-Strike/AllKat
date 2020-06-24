let onlineHTML = 'Loading';

Prom_UtilGetHTML("online.html").then(res => {onlineHTML = res});

function Online_show()
{
    Utils_clearMainClasses();
    mainEl = document.getElementById("main");

    mainEl.innerHTML = onlineHTML;
    Online_renderList();
}

function Online_renderList()
{
    const secondsSince = (user) =>
    {
        return Math.round(user.since_login);
    }

    function generateUserCard(father, userData)
    {
        const userCardHTML = `
            <p class="online-name">${userData.username}</p>
            <p class="online-time">(<span>${secondsSince(userData)}</span> s)</p>
        `;

        let card = document.createElement('div');
        card.classList.add('online-card');
        card.innerHTML = userCardHTML;

        father.appendChild(card);       
    }

    function GetUserNodes(userGrid)
    {
        let nodeList = {};
        const nodes = userGrid.getElementsByClassName('online-name');
        for (let i = 0; i < nodes.length; i++) {
            nodeList[nodes[i].innerText] = nodes[i].parentNode;
        }
        return nodeList;
    }

    function CompareAndUpdate(nodes, users, father)
    {
        /// deleting
        Object.keys(nodes).forEach(username => {
            if (!users.hasOwnProperty(username))
                nodes[username].remove();
        });
        /// updating and creating
        Object.keys(users).forEach(username => {
            /// update
            if (nodes.hasOwnProperty(username)) {
                nodes[username].querySelector('.online-time span').innerText = secondsSince(users[username]);
            }
            else {
                generateUserCard(father, users[username]);
            }
        });
    }

    let userGrid = document.querySelector('.online-grid');

    Prom_AllUsersOnline()
    .then(res => {
        // console.log("Received online users data: ");
        const users = res.data.user_list;
        CompareAndUpdate(GetUserNodes(userGrid), users, userGrid);
        return ;
    })
    .catch(err => {
        console.log(err);   
        console.log("Error getting online users from server: " + err.reason);
        // Online_setErrorContent(err.reason);
    })
}

function Online_setErrorContent(reason)
{
    console.log('Error eyyyy: ' + reason);
}

function Online_watcher()
{
    let userGrid = document.querySelector('.online-grid');
    if (userGrid) {
        if (userGrid.parentNode)
            Online_renderList();
    }
}