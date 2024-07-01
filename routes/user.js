const express = require("express")
const router = express.Router()

const { requireSignin, isAdmin, isAuth } = require("../controller/auth")
const { userById, readProfile, updateProfile  } = require("../controller/user")

router.get("/secret/:userId", requireSignin, isAuth, isAdmin,(req, res) => {
    console.log(req.profile);
    res.json({
        user: req.profile
    });
});


// User profile Read and Update
router.get("/user/:userId", requireSignin, isAuth,readProfile )
router.put("/user/:userId", requireSignin, isAuth,updateProfile )


router.param("userId", userById)






module.exports = router