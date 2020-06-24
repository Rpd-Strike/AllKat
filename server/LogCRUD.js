const HEADER = "===== LogCRUD: =====  ";
const LOG_FILE_NAME = "logs.txt";
const fs = require('fs');

function makeHeader(ip)
{
    const logDate = new Date();
    const day = ("0" + logDate.getDate()).slice(-2);
    const month = ("0" + logDate.getMonth()).slice(-2);
    const year = logDate.getFullYear();
    const hour = ("0" + logDate.getHours()).slice(-2);
    const minutes = ("0" + logDate.getMinutes()).slice(-2);
    const seconds = ("0" + logDate.getSeconds()).slice(-2);
    return HEADER + `IP: ${ip} [${year}-${month}-${day} ${hour}:${minutes}:${seconds}]: `;
}

function appendToLog(message)
{
    fs.appendFileSync('./server/' + LOG_FILE_NAME, message + '\n');
}

module.exports = {
    /// touch log.txt file
    touchLogFile: function()
    {
        const filenames = [LOG_FILE_NAME];
        const time = new Date();

        filenames.forEach(filename => {
            filename = './server/' + filename;
            try {
                fs.utimesSync(filename, time, time);
            } catch (err) {
                fs.closeSync(fs.openSync(filename, 'w'));
            }
        });
    },

    /// User API
    newUser: function(data)
    {
        let message = makeHeader(data.ip) + `UserAPI | New User Created, username: ${data.username}`;
        appendToLog(message);
    },

    successfullLogin: function(data, ip)
    {
        let message = makeHeader(ip) + `UserAPI | User login: ${data.username}`;
        appendToLog(message);
    },

    successfulLogout: function(data)
    {
        let message = makeHeader(data.ip) + `UserAPI | Logout User: ${data.username} with token: ${data.token}`;
        appendToLog(message);
    },

    getOnlineUsers: function(data, size_t)
    {
        let message = makeHeader(data.ip) + `UserAPI | Requested online users, Online users: ${size_t}`;
        // appendToLog(message);
        // console.log(message);
    },

    testToken: function(data)
    {
        let message = makeHeader(data.ip) + `UserAPI | Testing token: ${data.token}`;
        appendToLog(message);
    },

    /// Cat API
    generateCat: function(data, username)
    {
        let message = makeHeader(data.ip) + `CatAPI | Gennerated cat User: ${username} catName: ${data.cat.name}, catId: ${data.cat.id}`;
        appendToLog(message);
    },

    getSingleCat: function(data, cat)
    {
        let message = makeHeader(data.ip) + `CatAPI | Requested single cat, catID: ${cat.id}`;
        console.log(cat);
    },

    getAllCats: function(data)
    {
        let message = makeHeader(data.ip) + `CatAPI | Requested all cats`;
        appendToLog(message);
    },

    updatedCat: function(data, username)
    {
        let message = makeHeader(data.ip) + `CatAPI | Updated cat, User: ${username} CatId: ${data.id}`;
        appendToLog(message);
    },

    deleteCat: function(data, username)
    {
        let message = makeHeader(data.ip) + `CatAPI | Deleted cat by User: ${username} catId: ${data.id}`;
        appendToLog(message);
    },

    getUserCats: function(username, data, lungime)
    {
        let message = makeHeader(data.ip) + `CatAPI | Requested all cats for user: ${username}, number of cats: ${lungime}`;
        appendToLog(message);
    },

    /// Admin API
    deleteUser: function(data)
    {
        let message = makeHeader(data.ip) + `AdminAPI | Deletes user: ${data.user}`;
        appendToLog(message);
    },

    blockUser: function(data)
    {
        let message = makeHeader(data.ip) + `AdminAPI | Change status of user: ${data.user}, is user blocked? ${data.status}`;
        appendToLog(message);
    },

    resetUser: function(data)
    {
        let message = makeHeader(data.ip) + `AdminAPI | Reset password for user: ${data.user}`;
        appendToLog(message);
    },

    getAllUsers: function(data)
    {
        let message = makeHeader(data.ip) + `AdminAPI | Get all USERS`;
        appendToLog(message);
    },

    addView: function(cat, ip)
    {
        let message = makeHeader(ip) + `CatAPI | AddView to cat: ${cat.id}`;
        appendToLog(message);
    }
}