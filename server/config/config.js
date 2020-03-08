/**
 * PORT
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * EVIRONMENT
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * BBDD
 */
let urlServerBBDD;
if(process.env.NODE_ENV === 'dev'){
    urlServerBBDD = 'mongodb://localhost:27017/workersconnect';
}else{
    urlServerBBDD = process.env.MONGO_URI;
}

process.env.SERVER_BBDD = urlServerBBDD;

/**
 * Datetime for token
 */

process.env.TOKEN_TIME = '48h';

/**
 * SEED auth
 */
process.env.SEED_AUTH = process.env.SEED_AUTH || 'este-es-el-seed-desarrollo'

/**
 * Google Client ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '24406117017-hs00df1raul9ot9s81covs4qnjjrmd3g.apps.googleusercontent.com'
