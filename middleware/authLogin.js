const jwt = require('jsonwebtoken')
const Regitser = require("../models/Regist");

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,process.env.TOKEN_SECRET,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }
  
        const {id} = payload
        Regitser.findById(id).then(userdata=>{
            req.user = userdata
            next()
        })
        
        
    })
  }