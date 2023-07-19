// Connect to Mongo database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// your local database url
// 27017 is the default mongoDB port
// const uri = process.env.MONGODB_URI || 'mongodb://admin:TzuMExlmksWQgdg7@ac-ru4r8pb-shard-00-00.pxi75yz.mongodb.net:27017,ac-ru4r8pb-shard-00-01.pxi75yz.mongodb.net:27017,ac-ru4r8pb-shard-00-02.pxi75yz.mongodb.net:27017/?ssl=true&replicaSet=atlas-f8wkws-shard-0&authSource=admin&retryWrites=true&w=majority';
const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:TzuMExlmksWQgdg7@cluster0.pxi75yz.mongodb.net/Pandochat?retryWrites=true&w=majority';
// const uri = process.env.MONGODB_URI || 'mongodb+srv://apiUser:SXzAbUa2gZ1BgOYw@cluster0.pxi75yz.mongodb.net/?retryWrites=true&w=majority';
// const uri = "mongodb://localhost:27017/pandochatLocal"

mongoose.connect(uri).then(
    () => {
      /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
      console.log('Connected to Mongo');
    },
    (err) => {
      /** handle initial connection error */
      console.log('error connecting to Mongo: ');
      console.log(err);
    }
);


module.exports = mongoose.connection;
