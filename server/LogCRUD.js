module.exports = {
    newUser: function(data)
    {
        console.log(`UserAPI | New User Created at time --- username: --- fom IP: ---`);
    },

    successfullLogin: function(data, ip)
    {
        console.log(`UserAPI | User: --- logged in from IP: --- at Time: ---`);
    },

    successfulLogout: function(data)
    {
        console.log(`UserAPI | User: --- Logged out from IP: --- with token: --- at Time: ---`);
    },

    getOnlineUsers: function(data, size_t)
    {
        console.log(`UserAPI | Requested online users from IP: --- at Time: --- Online users: ---`);
    },

    testToken: function(data)
    {
        console.log(`UserAPI | Testing token: --- from IP: --- at Time: ---`);
    }
}