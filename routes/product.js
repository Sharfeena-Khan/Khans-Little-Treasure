const express = require("express")
const router = express.Router()

const { create, productById, read, remove, updatePdt } = require("../controller/product")
const { requireSignin, isAdmin, isAuth } = require("../controller/auth")
const { userById } = require("../controller/user")
const { update } = require("lodash")



router.post("/product/create/:userId" ,requireSignin, isAuth, isAdmin, create)
router.get("/product/:productId", read)
router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, remove)
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, updatePdt)




router.param("userId", userById)
router.param("productId", productById)






module.exports = router