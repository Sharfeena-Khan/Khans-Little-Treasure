const express = require("express")
const router = express.Router()

const { create, create_Sub_cat } = require("../controller/category")
const { requireSignin, isAdmin, isAuth } = require("../controller/auth")
const { userById } = require("../controller/user")



router.post("/category/create/:userId" ,requireSignin, isAuth, isAdmin, create)
router.post("/category/create_Sub_cat/:userId" ,requireSignin, isAuth, isAdmin, create_Sub_cat)


router.param("userId", userById)






module.exports = router