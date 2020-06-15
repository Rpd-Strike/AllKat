const HEADER = " ===== LogCRUD: =====  ";

module.exports = {
    /// User API
    newUser: function(data)
    {
        let message = HEADER + `UserAPI | New User Created at time --- username: --- fom IP: ---`;
        console.log(message);
    },

    successfullLogin: function(data, ip)
    {
        let message = HEADER + `UserAPI | User: --- logged in from IP: --- at Time: ---`;
        console.log(message);
    },

    successfulLogout: function(data)
    {
        let message = HEADER + `UserAPI | User: --- Logged out from IP: --- with token: --- at Time: ---`;
        console.log(message);
    },

    getOnlineUsers: function(data, size_t)
    {
        let message = HEADER + `UserAPI | Requested online users from IP: --- at Time: --- Online users: ---`;
        console.log(message);
    },

    testToken: function(data)
    {
        let message = HEADER + `UserAPI | Testing token: --- from IP: --- at Time: ---`;
        console.log(message);
    },

    /// Cat API
    generateCat: function(data, username)
    {
        let message = HEADER + `CatAPI | User: ${username} from IP: ${data.ip} at time: --- and has data: `;
        console.log(message);
        console.log(data);
    },

    getSingleCat: function(data, cat)
    {
        let message = HEADER + `CatAPI | Requested single cat, from IP: ${data.ip} cat:`;
        console.log(cat);
    },

    getAllCats: function(data)
    {
        let message = HEADER + `CatAPI | Requested all cats, from IP: ${data.ip}`;
        console.log(message);
    },

    updatedCat: function(data)
    {
        let message = HEADER + `CatAPI | Updated cat, User: ${data.user} from IP: ${data.ip} CatId: ${data.id}, updated data:`;
        console.log(message);
        console.log(data.cat);
    },

    deleteCat: function(data, username)
    {
        let message = HEADER + `CatAPI | Deleted cat by User: ${username} from IP: ${data.ip} catId: ${data.id}`;
        console.log(message);
    },

    getUserCats: function(username, data, lungime)
    {
        let message = HEADER + `CatAPI | Requested all cats for user: ${username} from IP: ${data.ip}, number of cats: ${lungime}`;
        console.log(message);
    },

    /// Admin API
    deleteUser: function(data)
    {
        let message = HEADER + `AdminAPI | Deletes user: ${data.user} from IP: ${data.ip}`;
        console.log(message);
    },

    blockUser: function(data)
    {
        let message = HEADER + `AdminAPI | Change status of user: ${data.user} from IP: ${data.ip}, is user blocked? ${data.status}`;
        console.log(message);
    },

    resetUser: function(data)
    {
        let message = HEADER + `AdminAPI | Reset password for user: ${data.user} from IP: ${data.ip}`;
        console.log(message);
    },

    addView: function(cat, ip)
    {
        let message = HEADER + `CatAPI | AddView from IP: ${ip} to cat: ${cat.id}`;
        console.log(message);
    }
}