const express =require('express')
const router=express.Router()
const pool=require('../dbConfig')
const jwt=require('jsonwebtoken')
// const {authenticateToken}=require('../Middlewares/middlewares')


module.exports=router