const fs = require('fs');
const db = require('./database')

module.exports = {
    touchDatabase: function()
    {
        /// create/touch the directory
        fs.mkdirSync('./db', { recursive: true }, (err) => {
            if (err) throw err;
        }); 

        /// create/touch the files
        const filenames = ['cats.json', 'tokens.json', 'users.json'];
        const time = new Date();

        filenames.forEach(filename => {
            filename = './db/' + filename;
            try {
                fs.utimesSync(filename, time, time);
            } catch (err) {
                fs.closeSync(fs.openSync(filename, 'w'));
            }
        });

        /// create/touch the actual json objects
        funcList = [{read: db.readCats, write: db.writeCats},
                    {read: db.readTokens, write: db.writeTokens}, 
                    {read: db.readUsers, write: db.writeUsers}];
        funcList.forEach(func => {
            try {
                let content = func.read();
                // console.log("read this as test: ");
                // console.log(content);
            }
            catch(err_useless) {
                // console.log(err_useless);
                console.log("SETUP ERROR: Corrupt db file, when running: " + func.read.name);
                /// make backup of db
                filenames.forEach(file => {
                    file = "./db/" + file;
                    fs.copyFileSync(file, file + ".bak");
                    console.log("Backup file: " + file);
                })
               
                let content = {};
                func.write(content);
            }
        })

        console.log("Database ready!");
    }
}