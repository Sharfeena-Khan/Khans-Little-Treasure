const express = require("express")
const router = express.Router()

const {signup, signIn, signOut, requireSignin } = require("../controller/auth")
const { userSignupValidator } = require("../validators/index")


router.post('/signup',userSignupValidator, signup)
router.post('/signIn', signIn)
router.get('/signOut', signOut)

router.get("/test",requireSignin,(req,res)=>{
    res.json({message:"test page"})
} )




module.exports = router