const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Regitser = require("../models/Regist");
const {registerValidate,loginValidate} = require('../validation');
const { find } = require("../models/Regist");
const jwt = require('jsonwebtoken');
const { kirimEmail } = require('../helpers/index')
const saltRounds = 10;



router.post("/register", async (req, res) => {

    const { error } = registerValidate(req.body);
    if(error) return res.status(400).send(error.details )
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const register = new Regitser({
    fullname: req.body.fullname,
    email: req.body.email,
    password: hashPassword
  });
  try {
    const savedRegister = await register.save();
    res.send(savedRegister);
  } catch (err) {
    res.status(400).send(err);
  }
  console.log(register);
});

router.post("/login", async (req, res) => {
    const { error } = loginValidate(req.body);
    if(error) return res.status(400).send(error.details )

    //make sure email available in database
    const user = await  Regitser.findOne({email:req.body.email})

    //if password wrong then status bad request
    if(!user) return res.status(400).send({message:"email or password is wrong"})

    //compare password 
    const validPass = await  bcrypt.compare(req.body.password, user.password)
    //alert passoword if pasword not same with password in database
    if(!validPass) return res.status(400).send("Password is wrong")
    const token = jwt.sign({id:user.id,email:user.email,fullname:user.fullname,role:user.role}, process.env.TOKEN_SECRET);
    var decoded = jwt.verify(token, process.env.TOKEN_SECRET );

    
    res.header('auth-token',token).send({token:token,user:decoded});
});


router.get("/user",(req,res)=>{
  Regitser.find((err,data)=>{
    if(!err) {
      res.json(data)
    }else{
      res.send(err)
    }
  })
});

router.get("/user/detail/:id",(req,res)=>{
  Regitser.findById(req.params.id,(err,data)=>{
    if(!err) {
      res.json(data)
    }else{
      res.send(err)
    }
  })
})
// function checkToken(token) {
//     return new Promise((resolve, reject) => {
//       jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
//         if (err) return reject(err);
//         return resolve(decoded);
//         console.log(decoded)
//       });
//     });
//   }

router.put('/forgotPass', async (req,res) => {
  
  const user = await Regitser.findOne({email:req.body.email})
try{
  if (!user)return res.status(404).json ({
    message: "email not found"
  })

  const token = jwt.sign({id:user.id},process.env.TOKEN_SECRET);

  await user.updateOne({resetPasswordLink:token})
  const templateEmail={
    from:"luizDev ",
    to:req.body.email,
    subject:"Link for reset password",
    html:`<p>silakan klik link di bawah ini untuk forgot password</p><p>http://localhost:4200/resetpassword/${token}</p>`
  }
  kirimEmail(templateEmail)
  return res.status(200).json({
    status:true,
    message:"link reset password berhasil terkirim"
  })
}
catch(err){
  console.log(err)
}
  

})

router.put('/resetpassword', async (req,res) => {
  const {token,password} = req.body
  const user   = await Regitser.findOne({resetPasswordLink:token})
  console.log(user)
  if(user){
    const hashPassword = await bcrypt.hash(password,10)
    user.password = hashPassword
     await user.save()
    return res.status(201).json({
      status:true,
      message:"perubahan berhasil!"
    })
  }
})
module.exports = router;
