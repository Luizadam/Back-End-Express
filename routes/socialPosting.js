const express = require('express');
const router = express.Router();
const Posting = require('../models/Posting')
const Regitser = require("../models/Regist");
const multer = require('multer');

// requiredLogin
const authLogin = require('../middleware/authLogin')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
    //   cb(null, new Date().toISOString() + file.originalname);
      cb(null, new Date().toISOString().replace(/:/g, '-')+ file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

router.get('/posting',authLogin,(req,res) => {
    
    Posting.find((err,docs) =>{
        if(!err){
            res.json(docs)
        }else{
            res.send("eror")
        }
    });
})

//posting socialmedia

router.post('/posting',upload.single('postImage'),(req,res) => {
    console.log(req)
    const posting = new Posting ({
        title:req.body.title,
        desc:req.body.desc,
        postImage:req.file.filename
    });
    posting.save()
    .then(data =>{
        console.log(data)
        res.json(data);
    })
    .catch(err => {
        res.json({message:err})
    });
})


//Get by id 

router.get ('/posting/:id',(req,res) =>{
    Posting.findById(req.params.id,(err,docs)=>{
        if(!err) {
            res.json(docs)
        }else{
            res.json(err)
        }
    })
})

router.put ('/posting/:id',(req,res) => {
    Posting.findByIdAndUpdate({_id : req.params.id}, { $set:
        {
        title : req.body.title,
        desc : req.body.desc
        }})
        .then(data => {
            Posting.findById(req.params.id,(err,docs)=>{
                if(!err) {
                    res.json(docs)
                }else{
                    res.json(err)
                }
            })
        .then(data => res.send(data))
        })
    })

//Delete by id 

router.delete('/posting/:id',(req,res)=>{
    Posting.remove({_id:req.params.id},(err,docs) =>{
        if(!err){
            res.json(docs)
        }else{
            res.json(err)
        }
    })
})

router.put('/like',authLogin,(req,res)=>{
    console.log(req)
    Posting.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user.id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',authLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    };
    Posting.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

module.exports = router;