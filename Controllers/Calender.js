const calender = require('calendar-js');

exports.GetCalender = async(req,res,next)=>{
  res.status(200).json({Calender:calender().of(new Date().getFullYear(), new Date().getMonth())});
}


