const { check,body } = require('express-validator');
const { default: slugify } = require('slugify');
const validatorMiddleware = require("../../middlewares/validatorMiddleware")

exports.ruleCreateBrandValidator=
[
    check('name')
    .notEmpty()
    .withMessage('Should Not Empty')
    .isString()
    .withMessage('Should be String')
    .isLength({ min: 3 , max: 32})
    .withMessage('Invalid Length Name between 3 , 32 charactar')
    ,body('name')
    .custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true;
    })
    ,validatorMiddleware
]

exports.ruleGetBrandValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid Brand Id'),
    validatorMiddleware
]

exports.ruleUpdateBrandValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid Brand Id')
    .notEmpty()
    .withMessage('Should Not Empty')
    .isString()
    .withMessage('Should be String')
    .isLength({ min: 3 , max: 32})
    .withMessage('Invalid Length Name between 3 , 32 charactar')
    ,body('name')
    .optional()
    .custom((val,{req})=>{
        req.body.slug = slugify(val)
        return true;
    })
    ,validatorMiddleware
]

exports.ruleDeleteBrandValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid Brand Id'),
    validatorMiddleware
]