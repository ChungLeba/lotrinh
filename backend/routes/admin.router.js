
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var crypto = require("crypto")

var jwt = require('jsonwebtoken');
var multer = require('multer')

var userModel = require('../models/user.model')
var diadiemchitietModel = require('../models/location.model')
var userModel = require('../models/user.model')
var imglocationModel = require('../models/img.location.model');
const { json } = require('express');



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
                        req.nickname = data.nickname
                        req.userID = data.id

                        console.log('Quyền user này: '+req.permis+" Nickname: "+ req.nickname+" userID:" + req.userID)
                        return next()
                    })
                    
                    
                }
            })
        }
        
    })
}

//LOGIN TO ADMIN SAVE TOKEN
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
                tokenSatime = jwt.sign({id:data._id,
                                        nickname:data.nickname}, process.env.LOGINJWT, {expiresIn: '24h'});
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
  res.render('admin/pages/1.home.admin.ejs',{user:req.nickname});
});
//LOCATION MANAGER
router.get('/locationmanager',checklogin, function(req, res, next) {
async function locationManage() {
    //Tổng địa điểm
    var totalLocation = await diadiemchitietModel.countDocuments();
    //Lấy 10 kết quả địa điểm xem nhiều nhất để có phương án xây dựng dữ liệu
    var bestView = await diadiemchitietModel.find()
                        .limit(10)
                        .sort({totalviews:'desc'});    
    //Thống kê 50 điểm mới nhất bởi Lộ Trình xây dựng
    var lotrinhLocation = await diadiemchitietModel.find({by:"administrator"})
                        .limit(50)
                        .sort({timecreate:'asc'})
    //Thống kê 50 điểm mới nhất bởi Partner xây dựng
    var partnerLocation = await diadiemchitietModel.find({by:"partner"})
                        .limit(50)
                        .sort({timeedit:'asc'})               
    //console.log(totalLocation)                          
    return {
        totalLocation,
        bestView,
        lotrinhLocation,
        partnerLocation
    }
}

locationManage()
.then(data=>{
    console.log(data)
    res.render('admin/pages/2.locationmana.admin.ejs',{
        totalLocation: data.totalLocation,
        bestView: data.bestView,
        lotrinhLocation: data.lotrinhLocation,
        partnerLocation: data.partnerLocation,
        user:req.nickname
    });
})
    
});

//ADD LOCATION
router.get('/addlocation',checklogin, function(req, res, next) {
    diadiemchitietModel.find({})
    .limit(50)
    .sort({timecreate:'desc'})
    .then(data=>{
        res.render('admin/pages/2A.addlocation.admin.ejs',{user:req.nickname,
            data:data});
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
        todayviews: "1",
        totalviews: "1",
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

//GET ALL LOCATION
router.get('/location',urlencodedParser,checklogin, function(req, res, next) {
    console.log(req.query)
    let page = req.query.page;
    console.log(req.query)
    const PAGE_SIZE =50;
    if(page){
        page = parseInt(page);
        if (page <1){
            page = 1;
        }
        var slboqua = (page - 1)*PAGE_SIZE;
        diadiemchitietModel.find({})
        .skip(slboqua)
        .limit(PAGE_SIZE)
        .sort({timecreate:'asc'})
        .then(data=>{
            console.log(data)
            res.json(data)
        })
    } else {
        //MẶC ĐỊNH
        diadiemchitietModel.find({})
        .limit(PAGE_SIZE)
        .sort({timecreate:'desc'})
        .then(data=>{
            res.render('admin/pages/2B.locationall.admin.ejs',{user:req.nickname,data:data})
        })
    }
});

//GET 1 LOCATION
router.get('/location/:locationId',urlencodedParser,checklogin, function(req, res, next) {
    //res.send(req.params)
    //console.log(req.params.locationId)
    async function locationReview() {
        //Lấy địa điểm
        let location = await diadiemchitietModel.findById({_id: req.params.locationId})
        //Lấy hình ảnh
        let imgLocation = await imglocationModel.find({locationID: req.params.locationId})
                            .limit(16)
                            .sort({totalviews:'desc'});                             
        return {
            location,
            imgLocation
        }
    }
    locationReview()
    /* diadiemchitietModel.findById({
        _id: req.params.locationId
    }) */
    .then(data=>{
        console.log(data.imgLocation)
        res.render('admin/pages/2C.viewareview.admin.ejs',{
                                                            user:req.nickname,
                                                            data:data.location,
                                                            imgsData: data.imgLocation
        });
    })
    .catch(err=>{
        console.log(err)
    })
});




//PUT
router.put('/location/:locationId',urlencodedParser,checklogin, function(req, res, next) {
    console.log(req.params)
    let date = new Date();
    diadiemchitietModel.findByIdAndUpdate({_id: req.params.locationId},
        {
        ten: req.body.ten,
        duong: req.body.duong,
        phuong: req.body.phuong,
        quan: req.body.quan,
        tinh: req.body.tinh,
        nuoc: req.body.nuoc,
        timeedit: date,
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
//DELETE
router.delete('/location/:locationId',urlencodedParser,checklogin, function(req, res, next) {
    console.log(req.params)
    diadiemchitietModel.findByIdAndDelete({_id: req.params.locationId})
    .then(data=>{
        console.log(data)
        res.send(data)
    })
    .catch(err=>{
        console.log(err)
    })
});


//UPLOAD HÌNH ẢNH
//CONFIG UPLOAD
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/imglocation')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname.replace(' ','-'))
    }
  })
const upload = multer({ storage: storage })

//PUT LINK UPLOAD IMG - WORKING
router.post('/location/img/:locationId',urlencodedParser,checklogin,upload.array('imgurl', 10), function(req, res, next) {
    console.log(req.files)
    console.log("data:",req.body.locationID)

    console.log("by:",req.userID)
    //Neu Location ID chua co anh thi POST
    imglocationModel.findOne({
        locationID: req.body.locationID
    })
    .then(data=>{
        console.log(data)
        imgurls =[]
            for (let index = 0; index < req.files.length; index++) {
                imgurl = {}
                imgurl.originalname = req.files[index].originalname
                imgurl.filename = req.files[index].filename
                imgurl.size = req.files[index].size
                imgurl.by = req.userID
                imgurl.timecreate = new Date()
                imgurl.totalviews = 1
                imgurls.push(imgurl)
            }
        console.log(imgurls)
        if(data){
            //PUT
            imglocationModel.findOneAndUpdate({
                locationID: req.body.locationID
            }, {
                $push:{imgs:imgurls}
            })
            .then(data=>{
                res.json({mes:"Hình ảnh đã được thêm"})
            })
            .catch(err=>{
                console.log(err)
            })

        } else {
            //CREAT
            
            imglocationModel.create({
            locationID: req.body.locationID,
            imgs: imgurls
            })
            .then(data=>{
                res.json({mes:"Hình ảnh đã được tải lên"})
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
    
    


});

module.exports = router;

