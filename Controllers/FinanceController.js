const CatchAsync = require("../utils/CatchAsync");
const Transactions = require("../Models/TransactionsModel");
const Rate = require("../Models/financialModel");
const Items = require("../Models/ItemModel");

exports.GetTransactions=CatchAsync(async(req,res,next)=>{
    const transactions = await Transactions.find();
    if(transactions){
      return res.status(200).json({message:'successfully fetched Transactions',transactions});
    }
    res.status(404).json({message:'no transaction in Database'});
})

exports.AddTransaction=CatchAsync(async(req,res,next)=>{
  const newTransaction = req.body.transaction;
  if(!newTransaction){
    return res.status(400).json({message:'no transaction received in body'})
  }
  await Transactions.create({
    customer:newTransaction.customer,
    amount:newTransaction.amount,
    currency:newTransaction.currency,
    refcode:newTransaction.refcode,
    contacts:newTransaction.contacts,
    paymentPlatform:newTransaction.paymentPlatform,
    status:newTransaction.status,
    purpose:newTransaction.purpose
  });
  res.status(200).json({message:'success. created transaction record'});
})

exports.RemoveTransaction=CatchAsync(async(req,res,next)=>{
 const id = req.params.id;
 console.log(req.params)
  if(!id){
   return res.status(400).json({message:'id not available,which is required'})
  }
  const trans = await Transactions.findOne({_id:id});
  if(!trans){
    return res.status(404).json({message:'Transaction not found,cannot delete'});
  }
  if(trans.status==='pending'){
    await Transactions.findByIdAndRemove(id);
    res.status(200).json({message:'success, removed Transaction'});
  }else{
    trans.status ='removed';
    await trans.save();
    res.status(200).json({message:'success, removed Transaction'});
  }

})

exports.ApproveTransaction = CatchAsync(async(req,res,next)=>{
  const TransID= req.params.id;
  if(!TransID){
    return res.status(400).json({message:'no Id for Approval'});
  }
  const trans = await Transactions.findById(TransID);
  if(!trans){
    return res.status(404).json({message:'Transaction not found'});
  }
  trans.status ='complete';
  await trans.save();
  res.status(200).json({message:'success, Approved Transaction'})
})

exports.GetRate=CatchAsync(async(req,res,next)=>{
   const currentRate = await Rate.find();
   if(!currentRate){
     return res.status(404).json({message:'no rate info in DataBase'});
   }
   res.status(200).json({message:'success, found Rate',rate:currentRate});
})

exports.UpdateRate=CatchAsync(async(req,res,next)=>{
   const currency = req.body;
   console.log(currency);
   if(!currency){
     return res.status(400).json({message:'no currency defined!'});
   }
   const currentRate = await Rate.findOne({currency:currency.currency});
   if(!currentRate){
     return res.status(404).json({message:'currency to update not found'});
   }
   currentRate.conversionRate = currency.rate;
   await currentRate.save();
   res.status(200).json({message:'success, Updated Rate'});
})

exports.GetItems=CatchAsync(async(req,res,next)=>{
   const items = await Items.find();
   if(!items){
     return res.status(404).json({message:'no items in DataBase'});
   }
   res.status(200).json({message:'success,Fetched Items',items})
})

exports.PostItem=CatchAsync(async(req,res,next)=>{
   const newItem = req.body.Item;
   if(!newItem){
     return res.status(400).json({message:'item not valid'});
   }
   await Items.create(newItem);
   res.status(200).json({message:'success, Saved Item'});
})

exports.RemoveItem=CatchAsync(async(req,res,next)=>{
  const id =req.params.id;
  if(!id){
    return res.status(400).json({message:'id not valid'});
  }
  await Items.findByIdAndRemove(id);
  res.status(200).json({message:'success, deleted item'});
})

exports.UpdateItem=CatchAsync(async(req,res,next)=>{
  const id =req.params.id;
  if(!id){
    return res.status(400).json({message:'id not valid'});
  }
  const item = await Items.findOne({_id:id});
  if(!item){
    return res.status(404).json({message:'item not found'});
  }
  item = req.body.item;
  await item.save();
  res.status(200).json({message:'success, updated item'});
})
