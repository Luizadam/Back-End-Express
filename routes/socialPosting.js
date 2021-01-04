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
    }
  });

router.get('/posting',(req,res) => {
    
    Posting.find((err,docs) =>{
        if(!err){
            res.json(docs)
        }else{
            res.send("eror")
        }
    });
})

//posting socialmedia

router.post('/posting',authLogin,upload.single('postImage'),(req,res) => {
    console.log(req.file)
    if(req.file !== undefined || null){
        const posting = new Posting ({
            title:req.body.title,
            desc:req.body.desc,
            createdBy:req.body.createdBy,
            postImage:req.file.filename,
            createdByName:req.user.fullname
        });
        posting.save()
        .then(data =>{  
            console.log(data)
            res.status(200).send({data:data,message:"Berhasil Membuat Data"})
        })
        .catch(err => {
            res.status(400).send({Error:err,message:"Kesalahan Membuat Data"})
        });
    }else if(req.file === undefined){
        const posting = new Posting ({
            title:req.body.title,
            desc:req.body.desc,
            createdBy:req.body.createdBy,
            createdByName:req.user.fullname
        });
        posting.save()
        .then(data =>{  
            console.log(data)
            res.status(200).send({data:data,message:"Berhasil Membuat Data"})
        })
        .catch(err => {
            res.status(400).send({Error:err,message:"Kesalahan Membuat Data"})
        });
    }
    
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

// get data by createdBy 
router.get ('/posting/profile/:id',(req,res) =>{
    Posting.find({createdBy:req.params.id},(err,docs)=>{
        if(!err){
            
            res.status(200).send({message:"Get Data Berhasil",data:docs})
            
        }else{
            res.status(500).send({message:"Periksa Kembali Data anda",Error:err})
            // res.json(err)
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
            res.status(200).json({ message: 'Berhasil Menghapus Data' });
        }else{
            res.status(500).json({ message: 'Terjadi Kesalahan Teknis' });
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
        postedBy:req.user._id,
        postedByName:req.user.fullname
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