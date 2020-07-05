const express         = require('express'),
    mongoose          = require('mongoose'),
    bodyParser        = require('body-parser'),
    database          = require('./config/db'),
    cors              = require('cors'),
    port              = process.env.PORT || 3000,
    serveStatic       = require('serve-static'),
    balanceRoutes     = require('./route/balance'),
    userRoutes        = require('./route/user'),
    distributorRoutes = require('./route/distributor'),
    simRoutes         = require('./route/sim'),
    noauthRoutes      = require('./route/noauth');
    simController     = require('./controller/sim')

const server = express();
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(database.url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.set('debug', true);

server.use(cors())
    .use(require('morgan')('dev'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

server.use('/api/v1/balance', balanceRoutes);

server.use('/api/v1/user', userRoutes);

server.use('/api/v1/distributor', distributorRoutes);

server.use('/api/v1/sim', simRoutes);

/**
 * Creates a new user
 * Comment in prod
 */
//server.use('/api/v1/user', noauthRoutes);

server.use(serveStatic(__dirname + "/dist"));

server.listen(port, () => {
    console.log('API is running on PORT: ' + port)
});
