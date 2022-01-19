
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var crypto = require("crypto")

var jwt = require('jsonwebtoken');
var multer = require('multer')

var userModel = require('../models/user.model')
var diadiemchitietModel = require('../models/location.model')
var imglocationModel = require('../models/img.location.model');
const { json } = require('express');



// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//Function checklogin
var checkloginpartner = function(req,res,next){
    let token = req.cookies.tokenSatime
    console.log(token)
    userModel.findOne({
        lasttoken: token
    })
    .then(data=>{
        //console.log("token:"+ data)
        if(data){
            console.log("Token bị rò rỉ")
            res.redirect('/partner/dang-nhap')
        } else {
            jwt.verify(token, process.env.LOGINJWT, function(err, data){
                if(err){
                    //console.log(err)
                    res.redirect('/partner/dang-nhap')
                } else {
                    console.log("Token hợp lệ: ", data)
                    //tìm quyền
                    userModel.findById({_id:data.id})
                    .then(data=>{
                        req.permis = parseInt(data.phanquyen)
                        req.partnername = data.hoten
                        req.userID = data.id
                        console.log('Quyền user này: '+req.permis+" Nickname: "+ req.nickname+" userID:" + req.userID)
                        if (req.permis == 2){
                            return next()
                        }
                        else if (req.permis == 1){
                            res.redirect('/admin/home')
                            return next()
                        }
                    })
                    
                    
                }
            })
        }
        
    })
}

//DANG KY
router.get('/dang-ky',function(req , res, next){
    //res.json("partner đăng ký")
    res.render('partner/pages/0A.reg.partner.ejs',{hi:"Xin chào nhà cung cấp"});

})

router.post('/dang-ky',urlencodedParser,function(req , res, next){
    //res.json("partner đăng ký")
    console.log(req.body)
    let salt = crypto.randomBytes(32).toString('hex');
    let hass_pass = crypto.pbkdf2Sync(req.body.pass, salt, 2000, 64,'sha512')
    userModel.findOne({
        email: req.body.email
    })
    .then(data=>{
        if(data){
            res.json({mes:"Tài khoản đã tồn tại, xin vui lòng đăng nhập !"})
        }
        else {
            userModel.create({
                phanquyen: 2, //1: admin, 2: partner, 3: khach hang
                email: req.body.email,
                hoten: req.body.hoten,        
                hash: hass_pass.toString('hex'),
                salt: salt
            })
            .then(data=>{
                //Ký
                tokenSatime = jwt.sign({id:data._id,
                    nickname:data.nickname}, process.env.LOGINJWT, {expiresIn: '24h'});
                res.cookie("tokenSatime", tokenSatime)
                //Báo ok
                res.json({ok:"Đăng ký thành công !"});
            })
            .catch(err=>{
                console.log(err)
            })
        }

    })
    .catch(err=>{
        console.log(err)
    })
})

//DANG NHAP
router.get('/dang-nhap',function(req , res, next){
    res.render('partner/pages/0B.login.partner.ejs',{hi:"Vui lòng đăng nhập để sử dụng dịch vụ."});
})
router.post('/dang-nhap',urlencodedParser,function(req , res, next){
    console.log(req.body)
    userModel.findOne({
        email: req.body.email
    })
    .then(data=>{
        if(data == null) {
            res.json({mes:"Tài khoản không tồn tại, vui lòng đăng ký"})
        } else {
            console.log(data)
            let hash_check = crypto.pbkdf2Sync(req.body.pass, data.salt, 2000, 64,'sha512')
            hash_check = hash_check.toString('hex')
            if(hash_check!==data.hash){
                res.json({mes:"Mật khẩu không chính xác"})
            }
            else if(hash_check==data.hash){
                //Ký
                tokenSatime = jwt.sign({id:data._id,
                                        nickname:data.nickname}, process.env.LOGINJWT, {expiresIn: '24h'});
                res.cookie("tokenSatime", tokenSatime)
                res.json({ok:"Đăng nhập thành công"})
            }
        }
    })
    .catch(err=>{
        console.log(err)
    })

})

//DANG XUAT
router.get('/exit', function(req, res, next) {
    //Lưu token gần nhất khi thoát
    let token = req.cookies.tokenSatime
    jwt.verify(token, process.env.LOGINJWT, function(err, data){
        if(err){
            //console.log(err)
            res.redirect('/partner')
        } else {
            console.log("Token hợp lệ: ", data)
            //tìm quyền
            userModel.findByIdAndUpdate({_id:data.id},
                {
                    lasttoken: token
                })
            .then(data=>{
                res.clearCookie('tokenSatime')
                res.redirect("/partner/")
            })
            
            
        }
    })
    
})
//TONG QUAN
router.get('/',checkloginpartner,function(req , res, next){
    res.render('partner/pages/1.home.partner.ejs',{user:req.partnername});
    
})

//ROUTER MANAGER
router.get('/routers',checkloginpartner,function(req , res, next){
    res.render('partner/pages/2.router.partner.ejs',{user:req.partnername});
    
})

//ROUTER ADD
router.get('/routers/add',checkloginpartner,function(req , res, next){
    res.render('partner/pages/2A.addrouter.partner.ejs',{user:req.partnername});
    
})

router.post('/routers/add',checkloginpartner,urlencodedParser,function(req , res, next){
    console.log(JSON.parse(req.body.chieudi))
    
})


module.exports = router;

