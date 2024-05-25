exports.userSignupValidator = (req, res, next)=>{
    req.check('name', "Name is required").notEmpty()
    req.check('email', "Email is required").notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min :4,
            max:32
        })
    req.check("password is required").notEmpty
    req.check("password")
        .isLength({ min : 8})
        .withMessage("Password must contain atleast 8 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number")
    
    const errors = req.validationErrors()
    if(errors){
        const firstError = errors.map(error=> error.msg)[0]
        console.log(firstError);
        return res.status(400).json({ error: firstError})

    }
    next()

}