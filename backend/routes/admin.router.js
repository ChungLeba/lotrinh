
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var crypto = require("crypto")

var jwt = require('jsonwebtoken');
var userModel = require('../models/user.model')
var diadiemchitietModel = require('../models/location.model')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Function checklogin
var checklogin = function(req,res,next){
    let token = req.cookies.tokenSatime
    console.log(token)
    userModel.findOne({
        lasttoken: token
    })
    .then(data=>{
        //console.log("token:"+ data)
        if(data){
            console.log("Token bị rò rỉ")
            res.send("Vui lòng liên hệ admin ^.^")
        } else {
            jwt.verify(token, process.env.LOGINJWT, function(err, data){
                if(err){
                    //console.log(err)
                    res.redirect('/admin')
                } else {
                    console.log("Token hợp lệ: ", data)
                    //tìm quyền
                    userModel.findById({_id:data.id})
                    .then(data=>{
                        req.permis = parseInt(data.phanquyen)
                        console.log('Quyền user này: '+req.permis)
                        return next()
                    })
                    
                    
                }
            })
        }
        
    })
}

//LOGIN TO ADMIN
router.get('/', function(req, res, next) {
    res.render('admin/pages/0.login.admin.ejs',{hi:"Administrator"});
});

router.post('/',urlencodedParser, function(req, res, next) {
    //console.log(req.body)
    
    userModel.findOne({email: req.body.email})
    .then(data=>{
        if(data == null) {
            res.json("Tài khoản không tồn tại")
        } else {
            console.log(data)
            let hash_check = crypto.pbkdf2Sync(req.body.pass, data.salt, 2000, 64,'sha512')
            hash_check = hash_check.toString('hex')
            if(hash_check!=data.hash){
                res.json("Mật khẩu không chính xác")
            }
            else if(hash_check==data.hash){
                

                tokenSatime = jwt.sign({id:data._id}, process.env.LOGINJWT, {expiresIn: '24h'});
                res.cookie("tokenSatime", tokenSatime)
                res.json({fw:"/admin/home"})
            }
        }
        
    })
    .catch(err=>{
        console.log(err)
    })

    
    //res.render('admin/pages/0.login.admin.ejs');
});

//LOGOUT
router.get('/exit', function(req, res, next) {
    //Lưu token gần nhất khi thoát
    let token = req.cookies.tokenSatime
    jwt.verify(token, process.env.LOGINJWT, function(err, data){
        if(err){
            //console.log(err)
            res.redirect('/admin')
        } else {
            console.log("Token hợp lệ: ", data)
            //tìm quyền
            userModel.findByIdAndUpdate({_id:data.id},
                {
                    lasttoken: token
                })
            .then(data=>{
                res.clearCookie('tokenSatime')
                res.redirect("/admin/")
            })
            
            
        }
    })
    
})




//HOME
router.get('/home',checklogin, function(req, res, next) {
  res.render('admin/pages/1.home.admin.ejs');
});
//LOCATION MANAGER
router.get('/location',checklogin, function(req, res, next) {
async function locationView() {
    //Tổng địa điểm
    var totalLocation = await diadiemchitietModel.countDocuments();
    //Lấy 10 kết quả địa điểm xem nhiều nhất để có phương án xây dựng dữ liệu
    var bestView = await diadiemchitietModel.find()
                        .limit(10)
                        .sort({totalviews:'desc'});    
    //Thống kê 50 điểm mới nhất bởi Lộ Trình xây dựng
    var lotrinhLocation = await diadiemchitietModel.find({by:"administrator"})
                        .limit(50)
                        .sort({timecreate:'desc'})
    //Thống kê 50 điểm mới nhất bởi Partner xây dựng
    var partnerLocation = await diadiemchitietModel.find({by:"partner"})
                        .limit(50)
                        .sort({timeedit:'desc'})               
    //console.log(totalLocation)                          
    return {
        totalLocation,
        bestView,
        lotrinhLocation,
        partnerLocation
    }
}

locationView()
.then(data=>{
    console.log(data)
    res.render('admin/pages/2.location.admin.ejs',{
        totalLocation: data.totalLocation,
        bestView: data.bestView,
        lotrinhLocation: data.lotrinhLocation,
        partnerLocation: data.partnerLocation
    });
})
    
});

//ADD LOCATION
router.get('/addlocation',checklogin, function(req, res, next) {
    diadiemchitietModel.find({})
    .limit(50)
    .sort({timecreate:'desc'})
    .then(data=>{
        res.render('admin/pages/2A.addlocation.admin.ejs',{data:data});
    })
});

router.post('/addlocation',urlencodedParser,checklogin, function(req, res, next) {
    console.log(req.body)
    let date = new Date();
    diadiemchitietModel.create({
        ten: req.body.ten,
        duong: req.body.duong,
        phuong: req.body.phuong,
        quan: req.body.quan,
        tinh: req.body.tinh,
        nuoc: req.body.nuoc,
        timecreate: date,
        by: req.body.by,
    })
    .then(data=>{
        console.log(data)
        res.send(data)
        
            
    })
    .catch(err=>{
        console.log(err)
    })
});


module.exports = router;

