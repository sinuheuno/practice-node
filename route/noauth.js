const express = require('express'),
    router = express.Router(),
    bcrypt = require('bcrypt'),
    User   = require('../model/user');

router.post('/noauth', /**
* Creates a new user without authentication. 
* name, type:'admin', email and password most be provided
*/
  (req, res) => {
    bcrypt.hash(req.body.password, Number(process.env.SALT_ROUNDS), (err, hash) => {
       if (err) {
           res.json(err);
       } else {
           let user = new User();

           user.active = true;
           user.name = req.body.name;
           user.type = req.body.type;
           user.email = req.body.email;
           user.phone_number = req.body.phone_number;
           user.password = hash;

           // save the user and check for errors
           user.save((err) => {
               if (err) {
                   res.json(err);
               } else {
                   res.json({
                       message: 'User created',
                       data: user
                   });
               }
           });
       }
   });
});

module.exports = router;
