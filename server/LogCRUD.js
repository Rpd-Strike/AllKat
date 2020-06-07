const HEADER = "LogCRUD:  ";

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
    generateCat: function(data, catID, username)
    {
        let message = HEADER + `CatAPI | User: ${username} from IP: ${data.ip} at time: --- and has data: `;
        console.log(message);
        console.log(data);
    }
}