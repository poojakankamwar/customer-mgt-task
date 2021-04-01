const express = require('express');
const router = express.Router();
const Customers = require("../models/customer");
const verifyToken = require("./verifyToken");

/* GET all customers. */
router.get('/', verifyToken, function(req, res, next) {
  Customers.find().lean()
    .exec()
    .then(customers => {
      if (!customers)
        return res.json({
          success: false,
          message: "Customers could not be found."
        });
        // array mapping to send full link of profile image
        customers.map(function (obj) { 
          obj.profileImageLink  = 'http//'+ req.hostname+':'+process.env.PORT +'/'+ obj.profileImage ;
        });
      return res.json({ success: true, customers });
    })
    .catch(err => {
      console.log(err);
      return res.json({ success: false, message: "Customers could not be found." });
    });
});


module.exports = router;
