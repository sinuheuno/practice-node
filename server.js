const express    = require('express'),
    mongoose     = require('mongoose'),
    bodyParser   = require('body-parser'),
    database     = require('./config/db'),
    cors         = require('cors'),
    port         = process.env.PORT || 8080;

const server = express();

mongoose.Promise = global.Promise;
mongoose.connect(database.url, { useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.set('debug', true);

server.use(cors())
    .use(require('morgan')('dev'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

server.get('/', (req, res) => {
    res.send("API is working :D")
});

server.listen(port, () => {
    console.log('API is running on PORT: ' + port)
});
