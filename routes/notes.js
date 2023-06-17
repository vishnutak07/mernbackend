const express = require('express');
const { check,validationResult } = require('express-validator');
const fetchdata = require('../middleware/fetchdata');
const Router = express.Router()
const Notes = require('../models/Notes')

Router.get('/getAllnotes',fetchdata,async (req,res)=>{
    try{
        const notes = await Notes.find({user:req.user.id});
        res.json(notes);
    }
    catch(err){
        return res.status(500).json({err});
    }
})

Router.post('/',[check("title","title should be not empty").exists(),
check("description","description should be not empty").exists()
],fetchdata,async (req,res)=>{
    const err = validationResult(req);
    if(!err.isEmpty){
        return res.json(err);
    }
    try{
        const {title,description} = req.body;
        const user = await Notes.create({
            user:req.user.id,
            title:title,
            description:description,
            tag:(req.body.tag) || 'General'
        })
        res.send(user)
    }
    catch(err){
        return res.status(500).json({err});
    }
})


// Delete One Notes
Router.delete('/delete/:id',fetchdata,async (req,res)=>{
    try{
        // const id = req.body.id;
        const user = await Notes.findByIdAndRemove(req.params.id)
        if(user){
            res.json({message:"succesfully deleted"})
        }
        else{
            req.json({message:"something happen"});
        }
    }
    catch(err){
        return res.status(500).json({err});
    }
})


// Update The item
Router.put('/update/:id',fetchdata,async (req,res)=>{
    try{
        const {title,description}= req.body;
        var myquery = { _id: req.params.id};
        var newvalues = {
            title:title,
            description:description,
            tag:(req.body.tag) || 'General'
        }
        const user = await Notes.updateOne(myquery,newvalues)
        if(user){
            res.json({message:"Updated"})
        }
        else{
            req.json({message:"something happen"});
        }
    }
    catch(err){
        return res.status(500).json({err});
    }
})
module.exports = Router;