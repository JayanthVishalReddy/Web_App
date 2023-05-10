const express=require('express');
const { createActor, updateActor, removeActor, searchActors, getLatestUploads, getSingleActor, getActors } = require('../controllers/actor');
const { isAuth, isAdmin } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/multer');
const { actorInfoValidator, validate } = require('../middlewares/validator');
const router=express.Router();

router.post('/create',isAuth,isAdmin,uploadImage.single('avatar'),actorInfoValidator,validate, createActor);
router.post('/update/:actorId',isAuth,isAdmin,uploadImage.single('avatar'),actorInfoValidator,validate, updateActor);
router.delete('/:actorId',isAuth,isAdmin,removeActor)
router.get('/search',isAuth,isAdmin,searchActors);
router.get('/latest-uploads',isAuth,isAdmin,getLatestUploads);
router.get('/actors',isAuth,isAdmin,getActors);
router.get('/single/:id',getSingleActor);
module.exports=router;