const CatchAsync = require("../utils/CatchAsync");


const CheckAdminRights = CatchAsync(async(req,res,next)=>{

  next();
})

module.exports = CheckAdminRights;
