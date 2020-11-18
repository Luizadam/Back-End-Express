const express = require('express');
const router = express.Router();
const Posting = require('../models/Posting')

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

router.post('/posting',(req,res) => {
    const posting = new Posting ({
        title:req.body.title,
        desc:req.body.desc
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

module.exports = router;