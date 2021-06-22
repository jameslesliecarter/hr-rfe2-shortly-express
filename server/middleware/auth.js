const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // check if request cookie has session hash
  // Use promise.resolve to pass desired value into .then chain
  Promise.resolve(req.cookies.shortlyId)
    .then((hash) => {
      // if there is no hash (i.e. no val on the shortlyId key) then throw an error so that the chain jumps down to the .catch block
      if (!hash) {
        throw hash;
      }
      // if there *is* a hash, get the session associated with it from the db
      // if there is a hash and a session, the .tap and .catch blocks are skipped, and the final .then will run
      return models.Sessions.get({hash});
    })
    // if there is a hash *but not in the db* then the hash is effectively worthless, so throw an error and jump to the catch block to initialize a session
    .tap((session) => {
      if (!session) {
        throw session;
      }
    })
    // if no hash or session, start new session in catch block
    .catch(() => {
      // create session
      return models.Session.create()
        // get the session just created from db
        .then(results => {
          return model.Sessions.get({id: results.insertId});
        })
        // assign this hash to the shortlyId key on the cookie
        .tap(session => {
          // add cookie to response header
          res.cookie('shortlyId', session.hash);
        });
    })
    .then(session => {
      // attach session to current request session
      req.session = session;
      next();
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {

};