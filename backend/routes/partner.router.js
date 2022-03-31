
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var crypto = require("crypto")

var jwt = require('jsonwebtoken');
var multer = require('multer')

var userModel = require('../models/user.model')
var diadiemchitietModel = require('../models/location.model')
var imglocationModel = require('../models/img.location.model');
var routerModel = require('../models/router.model');
var partnerModel = require('../models/partner.model');
const { json } = require('express');
const { time } = require('console');



// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//Function checklogin
var checkloginpartner = function(req,res,next){
    let token = req.cookies.tokenSatime
    //console.log(token)
    userModel.findOne({
        lasttoken: token
    })
    .then(data=>{
        //console.log("token:"+ data)
        if(data){
            //console.log("Token bị rò rỉ")
            res.redirect('/partner/dang-nhap')
        } else {
            jwt.verify(token, process.env.LOGINJWT, function(err, data){
                if(err){
                    //console.log(err)
                    res.redirect('/partner/dang-nhap')
                } else {
                    //console.log("Token hợp lệ: ", data)
                    //tìm quyền
                    userModel.findById({_id:data.id})
                    .then(data=>{
                        req.permis = parseInt(data.phanquyen)
                        req.partnername = data.hoten
                        req.userID = data.id
                        //console.log('Quyền user này: '+req.permis+" Nickname: "+ req.nickname+" userID:" + req.userID)
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
    //console.log(req.body)
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
                salt: salt,
                totalviews: 1
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
    res.render('partner/pages/0B.login.partner.ejs',{hi:"Vui lòng đăng nhập để sử dụng LOTRINH.VN. Chúc quý khách hành thành công !"});
})
router.post('/dang-nhap',urlencodedParser,function(req , res, next){
    //console.log(req.body)
    userModel.findOne({
        email: req.body.email
    })
    .then(data=>{
        if(data == null) {
            res.json({mes:"Tài khoản không tồn tại, vui lòng đăng ký"})
        } else {
            //console.log(data)
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
    async function tongquannguoidung(){
        let thongke = []
        let bestview = []
        let sotuyenduong = await routerModel.count({partnerID:req.userID})
        let sodiadiadiem = await diadiemchitietModel.count({byuserID:req.userID})
        let soncc = await partnerModel.count({userID:req.userID})
        let tuyenduongcuauser = await routerModel.find({partnerID:req.userID})
        let cacchuyen_chieudi = []
        let cacchuyen_chieuve = []
        for (let index = 0; index < tuyenduongcuauser.length; index++) {

            if (tuyenduongcuauser[index].chieudi[0]){
                for (let t = 0; t < tuyenduongcuauser[index].chieudi[0].time.length; t++) {
                    cacchuyen_chieudi.push(tuyenduongcuauser[index].chieudi[0].time[t])
                }
                
            } else if(tuyenduongcuauser[index].chieuve[0]){
                for (let z = 0; z < tuyenduongcuauser[index].chieudi[0].time.length; z++) {
                    cacchuyen_chieudi.push(tuyenduongcuauser[index].chieudi[0].time[z])
                }
            }

        }
        let tongsochuyen = cacchuyen_chieudi.length + cacchuyen_chieuve.length
        //console.log(tongsochuyen)
        thongke.push(sotuyenduong, sodiadiadiem, soncc, tongsochuyen)
        
        let tuyenduongbestview = await routerModel.find({partnerID:req.userID})
        .limit(5)
        .sort({totalviews:"desc"})
        
        let diadiembestview = await diadiemchitietModel.find({})
        .populate("byuserID")
        .sort({totalviews:"desc"})
        .limit(5)
        bestview.push(tuyenduongbestview, diadiembestview)
        let tongluotxem = await userModel.findById({_id:req.userID},{
            phanquyen: 0,
            email:0,
            hoten:0,
            nickname:0,
            sodienthoai:0,
            diachi:0,
            hash:0,
            salt:0,
            lasttoken:0,
        })

        return {
            thongke,
            bestview,
            tongluotxem
        }
    }
    tongquannguoidung()
    .then (data=>{
        //console.log(data)
        if(data.thongke[2]==0){
            res.redirect("/partner/partner-info")
        } else{
            res.render('partner/pages/1.home.partner.ejs',{user:req.partnername, data:data});
        }

    })
    
})

//ROUTER MANAGER
router.get('/routers',checkloginpartner,function(req , res, next){
    routerModel.find({
        partnerID:req.userID})
    .sort({timecreate: 'desc'})
    .populate('chieudi.locationID')
    .populate('chieuve.locationID')
    .populate('partnerID')
    .then(data=>{
        if(data){
            console.log(data.length)
            res.render('partner/pages/2.router.partner.ejs',{user:req.partnername, data:data});
        } else {
            res.render('partner/pages/2.router.partner.ejs',{user:req.partnername, data:''});
        }
    })
})
router.post('/routers',checkloginpartner,urlencodedParser,function(req , res, next){
    console.log(req.body)
    routerModel.findByIdAndUpdate({
        _id:req.body.routerID,
        partnerID: req.userID
    },{
        publish:req.body.publish
    })
    .then(data=>{
        res.json({mes:"Đã thay đổi trạng thái xuất bản: "+req.body.status})
    })
    .catch(err=>{
        console.log(err)
    })
})

//ROUTER ADD
router.get('/routers/add',checkloginpartner,function(req , res, next){
    async function timdiadiemdaco(){
        let kq = await diadiemchitietModel.find({
        })
        .sort({timecreate:'desc'})
        return kq

    }
    
    timdiadiemdaco()
    .then(dsdiadiem=>{
        //console.log(dsdiadiem)
        partnerModel.find({
            userID: req.userID
        })
        .then(data=>{
            //console.log(data)
            let cacncc = []
            for (let index = 0; index < data.length; index++) {
                let ncc ={}
                ncc.id = data[index]._id
                ncc.tenncc = data[index].tenncc
                cacncc.push(ncc)
            }
            //console.log(cacncc)
            if(cacncc.length>0){
                res.render('partner/pages/2A.addrouter.partner.ejs',{user:req.partnername,cacncc:cacncc,dsdiadiem:dsdiadiem});
            } else {
                res.redirect("/partner/partner-info")
            }
        })
    })

    
    
    
})

router.post('/routers/add',checkloginpartner,urlencodedParser,function(req , res, next){
    /* Tạo url_friendly địa điểm */
    let diadiem_url_friendly = function (ten,duong,phuong,quan,tinh){
        //nhúng
        var moment = require('moment');
        const crypto = require("crypto");
        function slugify(string) {
        const a = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ·/_,:;"
        const b = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd------"
        const p = new RegExp(a.split('').join('|'), 'g')
    
        return string.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
        }
        //chạy
        let ran = crypto.randomInt(11111111,99999999)
        let date = new Date();
        let url_friendly = slugify(ten)+"-tai-"+slugify(duong)+"-"+slugify(phuong)+"-"+slugify(quan)+"-"+slugify(tinh)+"-"+moment(date).format('DD-MM-YYYY-hh-mm-ss')+"-"+ran
        //kết quả
        return url_friendly
    }
    //Nap dia diem chieu di
    let cacdiadiemchieudi = JSON.parse(req.body.chieudi)
    let cacdiadiemchieudi_res = []
    async function napdiadiem_chieudi (){
        for (let index = 0; index < cacdiadiemchieudi.length; index++) {
            let timdiadiem = await diadiemchitietModel.findOne({
                                    ten: cacdiadiemchieudi[index][0],
                                    duong: cacdiadiemchieudi[index][1],
                                    phuong: cacdiadiemchieudi[index][2],
                                    quan: cacdiadiemchieudi[index][3],
                                    tinh: cacdiadiemchieudi[index][4]
                                    })

            if(timdiadiem){
                //console.log(timdiadiem)
                let diadiemchieudi = {}
                console.log("Tìm thấy: ", timdiadiem._id)
                diadiemchieudi.locationID = timdiadiem._id
                diadiemchieudi.time = []
                cacdiadiemchieudi_res.push(diadiemchieudi)
            } else {
                
                /* Tạo địa điểm */
                let diadiemchieudi = {}
                let taodiadiem = await diadiemchitietModel.create({
                    ten: cacdiadiemchieudi[index][0],
                    duong: cacdiadiemchieudi[index][1], 
                    phuong: cacdiadiemchieudi[index][2],
                    quan: cacdiadiemchieudi[index][3],
                    tinh: cacdiadiemchieudi[index][4],
                    by: req.nickname,
                    byuserID: req.userID,
                    timecreate: new Date(),
                    totalviews:1,
                    url_friendly: diadiem_url_friendly(cacdiadiemchieudi[index][0],cacdiadiemchieudi[index][1],cacdiadiemchieudi[index][2],cacdiadiemchieudi[index][3],cacdiadiemchieudi[index][4] )
                })
                console.log("Tạo mới: ", taodiadiem._id)
                diadiemchieudi.locationID = taodiadiem._id
                diadiemchieudi.time = []
                cacdiadiemchieudi_res.push(diadiemchieudi)
            }
        }
        return cacdiadiemchieudi_res
    }
    //Lay Router chieu di
    /* napdiadiem_chieudi()
    .then(data=>{
        console.log("Chieu di: ",cacdiadiemchieudi_res)
    }) */
    //Nap dia diem chieu ve
    let cacdiadiemchieuve = JSON.parse(req.body.chieuve)
    let cacdiadiemchieuve_res = []
    async function napdiadiem_chieuve (){
        for (let index = 0; index < cacdiadiemchieuve.length; index++) {
            let timdiadiem = await diadiemchitietModel.findOne({
                                    ten: cacdiadiemchieuve[index][0],
                                    duong: cacdiadiemchieuve[index][1],
                                    phuong: cacdiadiemchieuve[index][2],
                                    quan: cacdiadiemchieuve[index][3],
                                    tinh: cacdiadiemchieuve[index][4]
                                    })

            if(timdiadiem){
                let diadiemchieuve = {}
                console.log("Tìm thấy: ", timdiadiem._id)
                diadiemchieuve.locationID = timdiadiem._id
                diadiemchieuve.time = []
                cacdiadiemchieuve_res.push(diadiemchieuve)
            } else {
                let diadiemchieuve = {}
                let taodiadiem = await diadiemchitietModel.create({
                    ten: cacdiadiemchieuve[index][0],
                    duong: cacdiadiemchieuve[index][1],
                    phuong: cacdiadiemchieuve[index][2],
                    quan: cacdiadiemchieuve[index][3],
                    tinh: cacdiadiemchieuve[index][4],
                    by: req.nickname,
                    byuserID: req.userID,
                    timecreate: new Date(),
                    totalviews:1,
                    url_friendly:diadiem_url_friendly(cacdiadiemchieuve[index][0],cacdiadiemchieuve[index][1],cacdiadiemchieuve[index][2],cacdiadiemchieuve[index][3],cacdiadiemchieuve[index][4])
                })
                console.log("Tạo mới: ", taodiadiem._id)
                diadiemchieuve.locationID = taodiadiem._id
                diadiemchieuve.time = []
                cacdiadiemchieuve_res.push(diadiemchieuve) 
            }
        }
        return cacdiadiemchieuve_res
    }
    //Lay Router chieu ve
    /* napdiadiem_chieuve()
    .then(data=>{
        console.log("Chieu ve: ",cacdiadiemchieuve_res)
    }) */
    //Tao ham lay id chieu di va chieu ve
    async function taotuyenduong(){
        let chieudi = await napdiadiem_chieudi()
        let chieuve = await napdiadiem_chieuve()
        return {chieudi, chieuve}
    }
    //Tao tuyen duong
    taotuyenduong()
    .then(data=>{
        //console.log(data)
        //tao url_friendly
        let url_friendly = function (loai,matuyen,ten){
            //nhúng
            var moment = require('moment');
            const crypto = require("crypto");
            function slugify(string) {
              const a = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ·/_,:;"
              const b = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd------"
              const p = new RegExp(a.split('').join('|'), 'g')
          
              return string.toString().toLowerCase()
                .replace(/\s+/g, '-') // Replace spaces with -
                .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
                .replace(/&/g, '-and-') // Replace & with 'and'
                .replace(/[^\w\-]+/g, '') // Remove all non-word characters
                .replace(/\-\-+/g, '-') // Replace multiple - with single -
                .replace(/^-+/, '') // Trim - from start of text
                .replace(/-+$/, '') // Trim - from end of text
            }
            //chạy
            let ran = crypto.randomInt(11111111,99999999)
            let date = new Date();
            let url_friendly = slugify(loai)+"-"+slugify(matuyen)+"-"+slugify(ten)+"-"+moment(date).format('DD-MM-YYYY-hh-mm-ss')+"-"+ran
            //kết quả
            return url_friendly
        }
        if(req.body.loai==1){
            var loaiphuongtien = "xe buýt"
        } else if(req.body.loai==2){
            var loaiphuongtien = "xe khách"
        } else if(req.body.loai==3){
            var loaiphuongtien = "xe taxi"
        } else if(req.body.loai==4){
            let loaiphuongtien = "xe mô tô"
        } else if(req.body.loai==5){
            var loaiphuongtien = "thuyền, tàu biển"
        } else if(req.body.loai==6){
            var loaiphuongtien = "phương tiện khác"
        } 
        routerModel.create({
            ten: req.body.ten, 
            matuyen: req.body.code,
            loai: req.body.loai,
            nccID: req.body.nccID,
            chieudi: data.chieudi,
            chieuve: data.chieuve,
            partnerID: req.userID,
            publish: 0,
            timecreate: new Date(),
            url_friendly: url_friendly(loaiphuongtien,req.body.code,req.body.ten)
        })
        .then(data=>{
            //console.log("kq them tuyen:", data)
            res.json({mes:"Thêm tuyến thành công"})
        })
        .catch(err=>{
            console.log(err)
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
})

//ROUTER 1 VIEW
//GET
router.get('/routers/:id',checkloginpartner,function(req , res, next){
    //console.log(req.params.id)
    //Cac dia diem da co
    async function timdiadiemdaco(){
        let kq = await diadiemchitietModel.find({
        })
        .sort({timecreate:'desc'})
        return kq

    }
    //Cac nha cung cap
    async function cacncc(){
        let datacacncc = await partnerModel.find({
            userID: req.userID
        })
        let cacncc = []
        for (let index = 0; index < datacacncc.length; index++) {
            let ncc ={}
            ncc.id = datacacncc[index]._id
            ncc.tenncc = datacacncc[index].tenncc
            cacncc.push(ncc)
        }
        return cacncc
    }
    cacncc()
    .then(cacncc=>{
        timdiadiemdaco()
        .then(dsdiadiem=>{
            routerModel.findById(req.params.id)
            .populate("chieudi.locationID")
            .populate("chieuve.locationID")
            .then(data=>{
                //console.log(data)
                res.render('partner/pages/2B.viewrouter.partner.ejs',{user:req.partnername, data:data, cacncc: cacncc, dsdiadiem:dsdiadiem});
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    
})
//PUT
router.put('/routers/:id',checkloginpartner,urlencodedParser,function(req , res, next){
    //slug_url
    let url_friendly = function (loai,matuyen,ten){
        //nhúng
        var moment = require('moment');
        const crypto = require("crypto");
        function slugify(string) {
          const a = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ·/_,:;"
          const b = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd------"
          const p = new RegExp(a.split('').join('|'), 'g')
      
          return string.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
        }
        //chạy
        let ran = crypto.randomInt(11111111,99999999)
        let date = new Date();
        let url_friendly = slugify(loai)+"-"+slugify(matuyen)+"-"+slugify(ten)+"-"+moment(date).format('DD-MM-YYYY-hh-mm-ss')+"-"+ran
        //kết quả
        return url_friendly
    }
    //
    if(req.body.chieudi==null&&req.body.chieuve==null){
        //tao url_friendly
        if(req.body.loai==1){
            var loaiphuongtien = "xe buýt"
        } else if(req.body.loai==2){
            var loaiphuongtien = "xe khách"
        } else if(req.body.loai==3){
            var loaiphuongtien = "xe taxi"
        } else if(req.body.loai==4){
            let loaiphuongtien = "xe mô tô"
        } else if(req.body.loai==5){
            var loaiphuongtien = "thuyền, tàu biển"
        } else if(req.body.loai==6){
            var loaiphuongtien = "phương tiện khác"
        }
        routerModel.findByIdAndUpdate({_id:req.params.id, partnerID:req.userID},{
            ten: req.body.ten, 
            matuyen: req.body.code,
            loai: req.body.loai,
            nccID: req.body.nccID,
            partnerID: req.userID,
            timeedit: new Date(),
            url_friendly: url_friendly(loaiphuongtien,req.body.code,req.body.ten)
        })
        .then(data=>{
            //console.log("kq them tuyen:", data)
            res.json({mes:"Sửa thông tin tuyến thành công"})
        })
        .catch(err=>{
            console.log(err)
        })
    } else if (req.body.chieudi||req.body.chieuve){
        //Nap dia diem chieu di
        let cacdiadiemchieudi = JSON.parse(req.body.chieudi)
        //console.log(cacdiadiemchieudi)

        async function napdiadiem_chieudi (){
            let cacdiadiemchieudi_res = []
            for (let index = 0; index < cacdiadiemchieudi.length; index++) {
                let timdiadiem = await diadiemchitietModel.findOne({
                                        ten: cacdiadiemchieudi[index][0],
                                        duong: cacdiadiemchieudi[index][1],
                                        phuong: cacdiadiemchieudi[index][2],
                                        quan: cacdiadiemchieudi[index][3],
                                        tinh: cacdiadiemchieudi[index][4]
                                        })

                if(timdiadiem){
                    let diadiemchieudi = {} 
                    //console.log("Tìm thấy: ", timdiadiem._id)
                    diadiemchieudi.locationID = timdiadiem._id
                    diadiemchieudi.time = []
                    cacdiadiemchieudi_res.push(diadiemchieudi)  
                    //console.log("dia diem: ",cacdiadiemchieudi_res)
                } else {
                    let diadiemchieudi = {} 
                    let taodiadiem = await diadiemchitietModel.create({
                        ten: cacdiadiemchieudi[index][0],
                        duong: cacdiadiemchieudi[index][1],
                        phuong: cacdiadiemchieudi[index][2],
                        quan: cacdiadiemchieudi[index][3],
                        tinh: cacdiadiemchieudi[index][4],
                        by: req.nickname,
                        byuserID: req.userID,
                        timecreate: new Date(),
                        totalviews:1
                    })
                    //console.log("Tạo mới: ", taodiadiem._id)
                    diadiemchieudi.locationID = taodiadiem._id
                    diadiemchieudi.time = []
                    cacdiadiemchieudi_res.push(diadiemchieudi)
                }
            }
            return cacdiadiemchieudi_res
        }

        //Nap dia diem chieu ve
        let cacdiadiemchieuve = JSON.parse(req.body.chieuve)

        async function napdiadiem_chieuve (){
            let cacdiadiemchieuve_res = []
            
            for (let index = 0; index < cacdiadiemchieuve.length; index++) {
                let timdiadiem = await diadiemchitietModel.findOne({
                                        ten: cacdiadiemchieuve[index][0],
                                        duong: cacdiadiemchieuve[index][1],
                                        phuong: cacdiadiemchieuve[index][2],
                                        quan: cacdiadiemchieuve[index][3],
                                        tinh: cacdiadiemchieuve[index][4]
                                        })

                if(timdiadiem){
                    let diadiemchieuve = {}
                    //console.log("Tìm thấy: ", timdiadiem._id)
                    diadiemchieuve.locationID = timdiadiem._id
                    diadiemchieuve.time = []
                    cacdiadiemchieuve_res.push(diadiemchieuve)
                } else {
                    let diadiemchieuve = {}
                    let taodiadiem = await diadiemchitietModel.create({
                        ten: cacdiadiemchieuve[index][0],
                        duong: cacdiadiemchieuve[index][1],
                        phuong: cacdiadiemchieuve[index][2],
                        quan: cacdiadiemchieuve[index][3],
                        tinh: cacdiadiemchieuve[index][4],
                        by: req.nickname,
                        byuserID: req.userID,
                        timecreate: new Date(),
                        totalviews:1
                    })
                    //console.log("Tạo mới: ", taodiadiem._id)
                    diadiemchieuve.locationID = taodiadiem._id
                    diadiemchieuve.time = []
                    cacdiadiemchieuve_res.push(diadiemchieuve) 
                }
            }
            return cacdiadiemchieuve_res
        }
        //Tao ham lay id chieu di va chieu ve
        async function taotuyenduong(){
            let chieudi = await napdiadiem_chieudi()
            let chieuve = await napdiadiem_chieuve()
            return {chieudi, chieuve}
        }
        
        //Sua tuyen duong
        taotuyenduong()
        .then(data=>{
            //console.log(data)
            //tao url_friendly
            if(req.body.loai==1){
                var loaiphuongtien = "xe buýt"
            } else if(req.body.loai==2){
                var loaiphuongtien = "xe khách"
            } else if(req.body.loai==3){
                var loaiphuongtien = "xe taxi"
            } else if(req.body.loai==4){
                let loaiphuongtien = "xe mô tô"
            } else if(req.body.loai==5){
                var loaiphuongtien = "thuyền, tàu biển"
            } else if(req.body.loai==6){
                var loaiphuongtien = "phương tiện khác"
            }

            routerModel.findByIdAndUpdate({_id:req.params.id, partnerID:req.userID},{
                ten: req.body.ten, 
                matuyen: req.body.code,
                loai: req.body.loai,
                nccID: req.body.nccID,
                chieudi: data.chieudi,
                chieuve: data.chieuve,
                partnerID: req.userID,
                timeedit: new Date(),
                url_friendly: url_friendly(loaiphuongtien,req.body.code,req.body.ten)
            })
            .then(data=>{
                //console.log("kq them tuyen:", data)
                res.json({mes:"Sửa lộ trình tuyến thành công"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }
    
    
})
//DELETE
router.delete('/routers/:id',urlencodedParser,checkloginpartner,function(req , res, next){
    //console.log(req.params)
    async function xoatuyen(){
        let kqxoa  = await routerModel.deleteOne({
            _id:req.params.id,
            partnerID: req.userID
        })
        return kqxoa
    }
    xoatuyen()
    .then(data=>{
        res.json({mes:"Xóa tuyến thành công"})
    })

})

//TIMETABLE

router.get('/timetables/:id',checkloginpartner,function(req , res, next){
    //console.log(req.params.id)
    routerModel.findById(req.params.id)
    .populate("chieudi.locationID")
    .populate("chieuve.locationID")
    .then(data=>{
        //console.log(data)
        res.render('partner/pages/2C.timetable.partner.ejs',{user:req.partnername, data:data});
    })
    .catch(err=>{
        console.log(err)
    })
})

//TIMETABLE - TAO CHIEUDI

router.get('/timetables/departure/:id',checkloginpartner,function(req , res, next){
    console.log(req.params.id)
    routerModel.findById(req.params.id)
    .populate("chieudi.locationID")
    .then(data=>{
        //console.log(data)
        res.render('partner/pages/2E.departure.partner.ejs',{user:req.partnername, data:data});
    })
    .catch(err=>{
        console.log(err)
    })
})
//Them lich trinh chieu di
router.put('/timetables/departure/:id',checkloginpartner,function(req , res, next){
    let chuyen_chieudi = JSON.parse(req.body.chuyen_chieudi)
    //console.log(chuyen_chieudi)
    routerModel.findById(req.params.id)
    .then(data=>{
        //console.log(data)
            for (let index = 0; index < chuyen_chieudi.length; index++) {
                routerModel.updateOne({
                    _id: req.params.id,
                    partnerID:req.userID, 
                    "chieudi._id": chuyen_chieudi[index].diadiemdiquaid
                },{
                    $push: {"chieudi.$.time":chuyen_chieudi[index]}
                }
                )
                .then(data=>{
                    //console.log(data)
                    
                    
                })
                .catch(err=>{
                    console.log(err)
                })
            }        
        res.json({mes:"Thêm lịch trình thành công"})
    })
    .catch(err=>{
        console.log(err)
    })
})
//Xem chi tiet lich trinh cua chuyen - chieu di
router.get('/timetables/departure/:id/trip/:tripcode',checkloginpartner,function(req , res, next){
    //console.log(req.params)
    async function timchuyen(){
        let trips = []
        await routerModel.findOne({
            _id: req.params.id
    
        })
        .populate("chieudi.locationID")
        .then(data=>{
            //console.log("chieu di: ",data.chieudi.length)
            
            for (let index = 0; index < data.chieudi.length; index++) {
                for (let t = 0; t < data.chieudi[index].time.length; t++) {
                    
                    if(data.chieudi[index].time[t].tripCode == req.params.tripcode){
                        let trip = {}
                        trip.time =  data.chieudi[index].time[t]
                        trip.locationID = data.chieudi[index].locationID
                        trips.push(trip)
                    }
                    
                }
            }
            //console.log("trip: ",trips.length)
            
        })
        .catch(err=>{
            console.log(err)
        })
        return trips
    }
    timchuyen()
    .then(data=>{
        //console.log(data.length)
        res.render('partner/pages/2G.departure.trip.partner.ejs',{user:req.partnername, data:data, routerID: req.params.id});

    })
    .catch(err=>{
        console.log(err)
    })
})
//Xoa lich trinh - chieu di
router.delete('/timetables/departure/:id/trip/:tripcode',checkloginpartner,function(req , res, next){
    routerModel.findById(req.params.id)
    .then(data=>{
        //console.log(data)
            routerModel.updateMany({
                _id: req.params.id,
                partnerID:req.userID
            },{
                $pull: {
                            'chieudi.$[].time':{tripCode:req.params.tripcode} // $[] chon all array
                        }
            },
            { multi: true }
            )
            .then(data=>{
                //console.log(data)
                res.json({mes:"Xóa chuyến thành công"})
            })
            .catch(err=>{
                console.log(err)
            })
    })
    .catch(err=>{
        console.log(err)
    })
})

//TIMETABLE - TAO CHIEUVE

router.get('/timetables/return/:id',checkloginpartner,function(req , res, next){
    //console.log(req.params.id)
    routerModel.findById(req.params.id)
    .populate("chieuve.locationID")
    .then(data=>{
        //console.log(data)
        if(data.chieuve.length==0){
            res.json("Chưa có dữ liệu tuyến đường chiều về")
        } else {
            res.render('partner/pages/2E.return.partner.ejs',{user:req.partnername, data:data});

        }
    })
    .catch(err=>{
        console.log(err)
    })
})
//Them lich trinh chieu ve
router.put('/timetables/return/:id',checkloginpartner,function(req , res, next){
    let chuyen_chieuve = JSON.parse(req.body.chuyen_chieuve)
    //console.log(chuyen_chieuve)
    routerModel.findById(req.params.id)
    .then(data=>{
        //console.log(data)
        for (let index = 0; index < chuyen_chieuve.length; index++) {
            routerModel.updateOne({
                _id: req.params.id, 
                partnerID:req.userID,
                "chieuve._id": chuyen_chieuve[index].diadiemdiquaid
            },{
                $push: {"chieuve.$.time":chuyen_chieuve[index]}
            }
            )
            .then(data=>{
                //console.log(data)
                
                
            })
            .catch(err=>{
                console.log(err)
            })
        }
        res.json({mes:"Thêm lịch trình thành công"})
    })
    .catch(err=>{
        console.log(err)
    })
})

//Xem chi tiet lich trinh cua chuyen - chiều về
router.get('/timetables/return/:id/trip/:tripcode',checkloginpartner,function(req , res, next){
    //console.log(req.params)
    async function timchuyen(){
        let trips = []
        await routerModel.findOne({
            _id: req.params.id
    
        })
        .populate("chieuve.locationID")
        .then(data=>{
            //console.log(data.chieuve)
            
            for (let index = 0; index < data.chieuve.length; index++) {
                for (let t = 0; t < data.chieuve[index].time.length; t++) {
                    
                    if(data.chieuve[index].time[t].tripCode == req.params.tripcode){
                        let trip = {}
                        trip.time =  data.chieuve[index].time[t]
                        trip.locationID = data.chieuve[index].locationID
                        trips.push(trip)
                    }
                    
                }
            }
            //console.log(trips)
            
        })
        .catch(err=>{
            console.log(err)
        })
        return trips
    }
    timchuyen()
    .then(data=>{
        //console.log(data)
        res.render('partner/pages/2G.return.trip.partner.ejs',{user:req.partnername, data:data, routerID: req.params.id});
    })
    .catch(err=>{
        console.log(err)
    })
})

//Xoa lich trinh - chieu di
router.delete('/timetables/return/:id/trip/:tripcode',checkloginpartner,function(req , res, next){
    routerModel.findById(req.params.id)
    .then(data=>{
        //console.log(data)
            routerModel.updateMany({
                _id: req.params.id,
                partnerID:req.userIDs
            },{
                $pull: {
                            'chieuve.$[].time':{tripCode:req.params.tripcode} // $[] chon all array
                        }
            },
            { multi: true }
            )
            .then(data=>{
                //console.log(data)
                res.json({mes:"Xóa chuyến thành công"})
            })
            .catch(err=>{
                console.log(err)
            })
    })
    .catch(err=>{
        console.log(err)
    })
})


//3.ĐỊA ĐIỂM ĐÓN TRẢ
router.get('/location',checkloginpartner,function(req , res, next){
    //console.log(req.query)
    let page = req.query.page;
    const PAGE_SIZE =50;
    if(page){
        page = parseInt(page);
        if (page <1){
            page = 1;
        }
        var slboqua = (page - 1)*PAGE_SIZE;
        diadiemchitietModel.find({byuserID: req.userID})
        .skip(slboqua)
        .limit(PAGE_SIZE)
        .sort({totalviews:'desc',timecreate:'desc'})
        .then(data=>{
            //console.log(data)
            res.json(data)
        })
    } else {
        diadiemchitietModel.find({
            byuserID: req.userID
        })
        .limit(PAGE_SIZE)
        .sort({totalviews:'desc',timecreate:'desc'})
        .then(data=>{
            if(data){
                res.render('partner/pages/3.location.partner.ejs',{user:req.partnername, data:data})
            } else {
                res.render('partner/pages/3.location.partner.ejs',{user:req.partnername, data:""})
            }

        })
        .catch(err=>{
            console.log(err)
        })
    }

    
    
    
})

//4.LỊCH TRÌNH
router.get('/timetables',checkloginpartner,function(req , res, next){
    routerModel.find({partnerID:req.userID})
    .limit(5)
    .populate("chieudi.locationID")
    .then(data=>{
        //console.log(data)
        res.render('partner/pages/4.timetable.partner.ejs',{user:req.partnername, data:data})
    })
    
})
//5.PHƯƠNG TIỆN
//6.NHÂN SỰ
//7.TT các NCC
router.get('/partner-info',checkloginpartner,function(req , res, next){
    async function timnccIDinrouter(){
        let cacncc = await partnerModel.find({
            userID: req.userID
        })
        //console.log("cacncc: ",cacncc)
        let datacactuyenql = []
        for (let index = 0; index < cacncc.length; index++) {
            let tuyenql = {}
            let cactuyenquanlycuancc = await routerModel.find({
                                            nccID:cacncc[index]._id
                                        })
            tuyenql._id = cacncc[index]._id
            tuyenql.tenncc = cacncc[index].tenncc
            tuyenql.cactuyenql = cactuyenquanlycuancc
            tuyenql.caclienhe = cacncc[index].caclienhe
            datacactuyenql.push(tuyenql)                                 
        }
        
        //console.log("data: ",datacactuyenql)
        return data = datacactuyenql
    }
    timnccIDinrouter()
    .then(data=>{
        //console.log(data)
        if(data){
            res.render('partner/pages/7.partner_info.partner.ejs',{user:req.partnername, userID:req.userID, data:data})
        } else (
            res.render('partner/pages/7.partner_info.partner.ejs',{user:req.partnername, userID:req.userID})
        )
    })
    .catch(err=>{
        console.log(err)
    })
    
    
})
router.post('/partner-info',checkloginpartner,urlencodedParser,function(req , res, next){
    //console.log(req.body)
    partnerModel.create({
        userID: req.userID,
        tenncc: req.body.tenncc,
        caclienhe:
        [
            JSON.parse(req.body.lienhe)
        ]
    })
    .then(data=>{
        //console.log(data)
        res.json({mes:"Thêm thành công"})
    })
    .catch(err=>{
        console.log(err)
    })
})

//7.1.TT 1 NCC
router.get('/partner-info/:id',checkloginpartner,function(req , res, next){
    async function data1ncc(){
        let data = {}
        let ncc = await partnerModel.find({
            _id:req.params.id
        })
        //console.log("data: ",ncc)
        data.ncc = ncc[0]
        let cactuyenquanlycuancc = await routerModel.find({
                                        nccID:ncc[0]._id
                                    })                               
        //console.log("cactuyenql: ",cactuyenquanlycuancc)
        data.cactuyenql = cactuyenquanlycuancc                          
        return data
    }
    data1ncc()
    .then(data=>{
        //console.log(data)
        if(data){
            res.render('partner/pages/7A.1partner_info.partner.ejs',{user:req.partnername, userID:req.userID, data:data})
        } else (
            res.render('partner/pages/7.partner_info.partner.ejs',{user:req.partnername, userID:req.userID})
        )
    })
    .catch(err=>{
        console.log(err)
    })
    
})
router.post('/partner-info/:id',checkloginpartner,function(req , res, next){
    console.log(req.body)
    if(req.body.bophan) {
        partnerModel.updateOne({
            _id: req.params.id,
            userID: req.userID
        },{
            $push: {
                "caclienhe":{
                    "tt":req.body.tt,
                    "bophan" : req.body.bophan,
                    "dienthoai" : req.body.dienthoai,
                    "email" : req.body.email,
                    "diachi" : req.body.diachi
                }
            }

        })
        .then(data=>{
            res.json({mes: "Thêm địa chỉ liên hệ thành công"})
        })
        
    }
    
})
//Sửa tên nhà cung cấp
router.put('/partner-info/:id',checkloginpartner,function(req , res, next){
    console.log(req.body)
    if(req.body.tenncc){
        partnerModel.findByIdAndUpdate({_id:req.params.id},
            {
                tenncc: req.body.tenncc
            })
        .then(data=>{
            //console.log(data)
            if(data){
                res.json({mes: "Sửa tên nhà cung cấp thành công"})
            }

        })
    }
    
})
//Sửa liên hệ
router.put('/partner-info/:id/:idlienhe',checkloginpartner,function(req , res, next){
    console.log("a:",req.body)
    console.log("a:",req.params)
    if(req.body.idsua){
        partnerModel.updateOne({
            _id:req.params.id, "caclienhe._id":req.params.idlienhe
        }, {
            $set: {
                "caclienhe.$.bophan":req.body.bophan,
                "caclienhe.$.dienthoai":req.body.dienthoai,
                "caclienhe.$.email":req.body.email,
                "caclienhe.$.diachi":req.body.diachi,
            }
        }
        )
        .then(data=>{
            console.log(data)
            if(data.modifiedCount==1){
                res.json({mes: "Sửa liên hệ thành công !"})
            }
        })
        .catch(err=>{
            console.log(err)

        })
    }
    
})
//Xóa liên hệ
router.delete('/partner-info/:id/:idlienhe',checkloginpartner,function(req , res, next){
    console.log("del:",req.params)
    partnerModel.updateOne({
        _id:req.params.id,
        userID: req.userID,
        "caclienhe._id":req.params.idlienhe
    }, {
        $pull: {
            caclienhe:{_id: req.params.idlienhe}
        }
    }
    )
    .then(data=>{
        console.log(data)
        if(data.modifiedCount==1){
            res.json({mes: "Xóa liên hệ thành công !"})
        }
    })
    .catch(err=>{
        console.log(err)

    })
    
})
//8. Hỗ trợ NCC
router.get('/ho-tro-dich-vu',checkloginpartner,function(req , res, next){
    res.render('partner/pages/8.help.partner.ejs',{user:req.partnername, userID:req.userID})
})

//9. USER INFO
router.get('/user-info',checkloginpartner,function(req , res, next){
    userModel.findById(req.userID)
    .then(data=>{
        //console.log(data)
        res.render('partner/pages/9.user_info.partner.ejs',{data:data,user:req.partnername, userID:req.userID})
    })
    
})
router.post('/user-info',checkloginpartner,urlencodedParser,function(req , res, next){
    //console.log(req.body)
    if(req.body.pass0&&req.body.pass2){
        //so sánh mật khẩu đang dùng
        //console.log("thay dổi mk")
        userModel.findById(req.userID)  
        .then(data=>{
            let hash_check = crypto.pbkdf2Sync(req.body.pass0, data.salt, 2000, 64,'sha512')
            hash_check = hash_check.toString('hex')
            if(hash_check!==data.hash){
                res.json({mes:"Mật khẩu không chính xác"})
            }
            else if(hash_check==data.hash){
                //Thực hiện thay đổi mật khẩu mới
                let new_salt = crypto.randomBytes(32).toString('hex');
                let new_hash_pass = crypto.pbkdf2Sync(req.body.pass2, new_salt, 2000, 64,'sha512')
                userModel.updateOne({_id:req.userID},{
                    hoten: req.body.name,
                    sodienthoai: req.body.fone,
                    hash: new_hash_pass.toString('hex'),
                    salt: new_salt
                })
                .then(data=>{
                    if(data.modifiedCount==1){
                        res.json({ok:"Thay đổi mật khẩu thành công !"});
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        })
    } else if(req.body.pass0==null&&req.body.pass1==null) {
        userModel.updateOne({_id:req.userID},{
            hoten: req.body.name,
            sodienthoai: req.body.fone
        })
        .then(data=>{
            console.log(data.modifiedCount)
            if(data.modifiedCount==1){
                res.json({ok:"Thông tin đã được cập nhật"})
            } else {
                res.json({mes:"Chưa có thay đổi gì !"})
            }
        })
    }
})


module.exports = router;

