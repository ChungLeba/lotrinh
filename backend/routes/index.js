/* Import */
var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model')
var diadiemchitietModel = require('../models/location.model')
var imglocationModel = require('../models/img.location.model');
var routerModel = require('../models/router.model');
var partnerModel = require('../models/partner.model');


/* Function , variable*/
/* TT tỉnh, tên tiếng việt, tên url */
var cactinh = 
[
  { no: 57, name: 'An Giang', name_slug: 'an-giang' },
  { no: 49, name: 'Bà Rịa - Vũng Tàu', name_slug: 'ba-ria-vung-tau' },
  { no: 47, name: 'Bình Dương', name_slug: 'binh-duong' },
  { no: 45, name: 'Bình Phước', name_slug: 'binh-phuoc' },
  { no: 39, name: 'Bình Thuận', name_slug: 'binh-thuan' },
  { no: 35, name: 'Bình Định', name_slug: 'binh-dinh' },
  { no: 62, name: 'Bạc Liêu', name_slug: 'bac-lieu' },
  { no: 15, name: 'Bắc Giang', name_slug: 'bac-giang' },
  { no: 4, name: 'Bắc Kạn', name_slug: 'bac-kan' },
  { no: 18, name: 'Bắc Ninh', name_slug: 'bac-ninh' },
  { no: 53, name: 'Bến Tre', name_slug: 'ben-tre' },
  { no: 3, name: 'Cao Bằng', name_slug: 'cao-bang' },
  { no: 63, name: 'Cà Mau', name_slug: 'ca-mau' },
  { no: 59, name: 'Cần Thơ', name_slug: 'can-tho' },
  { no: 41, name: 'Gia Lai', name_slug: 'gia-lai' },
  { no: 11, name: 'Hoà Bình', name_slug: 'hoa-binh' },
  { no: 2, name: 'Hà Giang', name_slug: 'ha-giang' },
  { no: 23, name: 'Hà Nam', name_slug: 'ha-nam' },
  { no: 1, name: 'Hà Nội', name_slug: 'ha-noi' },
  { no: 28, name: 'Hà Tĩnh', name_slug: 'ha-tinh' },
  { no: 21, name: 'Hưng Yên', name_slug: 'hung-yen' },
  { no: 19, name: 'Hải Dương', name_slug: 'hai-duong' },
  { no: 20, name: 'Hải Phòng', name_slug: 'hai-phong' },
  { no: 60, name: 'Hậu Giang', name_slug: 'hau-giang' },
  { no: 50, name: 'Hồ Chí Minh', name_slug: 'ho-chi-minh' },
  { no: 37, name: 'Khánh Hòa', name_slug: 'khanh-hoa' },
  { no: 58, name: 'Kiên Giang', name_slug: 'kien-giang' },
  { no: 40, name: 'Kon Tum', name_slug: 'kon-tum' },
  { no: 8, name: 'Lai Châu', name_slug: 'lai-chau' },
  { no: 51, name: 'Long An', name_slug: 'long-an' },
  { no: 6, name: 'Lào Cai', name_slug: 'lao-cai' },
  { no: 44, name: 'Lâm Đồng', name_slug: 'lam-dong' },
  { no: 13, name: 'Lạng Sơn', name_slug: 'lang-son' },
  { no: 24, name: 'Nam Định', name_slug: 'nam-dinh' },
  { no: 27, name: 'Nghệ An', name_slug: 'nghe-an' },
  { no: 25, name: 'Ninh Bình', name_slug: 'ninh-binh' },
  { no: 38, name: 'Ninh Thuận', name_slug: 'ninh-thuan' },
  { no: 16, name: 'Phú Thọ', name_slug: 'phu-tho' },
  { no: 36, name: 'Phú Yên', name_slug: 'phu-yen' },
  { no: 29, name: 'Quảng Bình', name_slug: 'quang-binh' },
  { no: 33, name: 'Quảng Nam', name_slug: 'quang-nam' },
  { no: 34, name: 'Quảng Ngãi', name_slug: 'quang-ngai' },
  { no: 14, name: 'Quảng Ninh', name_slug: 'quang-ninh' },
  { no: 30, name: 'Quảng Trị', name_slug: 'quang-tri' },
  { no: 61, name: 'Sóc Trăng', name_slug: 'soc-trang' },
  { no: 9, name: 'Sơn La', name_slug: 'son-la' },
  { no: 26, name: 'Thanh Hóa', name_slug: 'thanh-hoa' },
  { no: 22, name: 'Thái Bình', name_slug: 'thai-binh' },
  { no: 12, name: 'Thái Nguyên', name_slug: 'thai-nguyen' },
  { no: 31, name: 'Thừa Thiên Huế', name_slug: 'thua-thien-hue' },
  { no: 52, name: 'Tiền Giang', name_slug: 'tien-giang' },
  { no: 54, name: 'Trà Vinh', name_slug: 'tra-vinh' },
  { no: 5, name: 'Tuyên Quang', name_slug: 'tuyen-quang' },
  { no: 46, name: 'Tây Ninh', name_slug: 'tay-ninh' },
  { no: 55, name: 'Vĩnh Long', name_slug: 'vinh-long' },
  { no: 17, name: 'Vĩnh Phúc', name_slug: 'vinh-phuc' },
  { no: 10, name: 'Yên Bái', name_slug: 'yen-bai' },
  { no: 7, name: 'Điện Biên', name_slug: 'dien-bien' },
  { no: 32, name: 'Đà Nẵng', name_slug: 'da-nang' },
  { no: 42, name: 'Đắk Lắk', name_slug: 'dak-lak' },
  { no: 43, name: 'Đắk Nông', name_slug: 'dak-nong' },
  { no: 48, name: 'Đồng Nai', name_slug: 'dong-nai' },
  { no: 56, name: 'Đồng Tháp', name_slug: 'dong-thap' }
]

/* Router */

/* 1.Trang chủ */
router.get('/', function(req, res, next) {
  res.redirect('/tim-kiem')
});

/* 2.Trang chi tiết tuyến đường */
router.get('/lo-trinh/:id', function(req, res, next) {
  
  routerModel.findById(req.params.id)
  .populate("chieudi.locationID")
  .populate("chieuve.locationID")
  .populate('partnerID')
  .populate('nccID')
  .then(data=>{
      //console.log(data)
      res.render('customer/pages/router.customer.ejs',{user:req.partnername, data:data});
  })
  .catch(err=>{
      console.log(err)
  })
})
/* 3A.Trang chi tiết lịch trình chuyến chiều đi */
router.get('/lo-trinh/lich-trinh/chieu-di/:id/chuyen/:machuyen',function(req , res, next){
  //console.log(req.params)
  async function timchuyen(){
    let datatrips = []
    let trips = []
    await routerModel.findOne({
        _id: req.params.id

    })
    .populate("chieudi.locationID")
    .populate("partnerID")
    .populate('nccID')
    .then(data=>{
        //console.log("chieu di: ",data.chieudi.length)
        datatrips.push({
          "_id": data._id,
          "ten": data.ten,
          "ncc": data.nccID.tenncc,
          "loai": data.loai,
          "matuyen": data.matuyen,
          "partnerID":data.partnerID
        })
        datatrips.push()
        for (let index = 0; index < data.chieudi.length; index++) {
            for (let t = 0; t < data.chieudi[index].time.length; t++) {
                
                if(data.chieudi[index].time[t].tripCode == req.params.machuyen){
                    let trip = {}
                    trip.time =  data.chieudi[index].time[t]
                    trip.locationID = data.chieudi[index].locationID
                    trips.push(trip)
                }
                
            }
        }
        console.log("trip: ",trips.length)
        datatrips.push(trips)
        
    })
    .catch(err=>{
        console.log(err)
    })
    return datatrips
  }
  timchuyen()
  .then(data=>{
      //console.log("data: ",data)
      res.render('customer/pages/2A.departure.trip.ejs',{data:data});

  })
  .catch(err=>{
      console.log(err)
  })
})

/* 3B.Trang chi tiết lịch trình chuyến chiều về */
router.get('/lo-trinh/lich-trinh/chieu-ve/:id/chuyen/:machuyen',function(req , res, next){
  //console.log(req.params)
  async function timchuyen(){
    let datatrips = []
    let trips = []
    await routerModel.findOne({
        _id: req.params.id

    })
    .populate("chieuve.locationID")
    .populate("partnerID")
    .populate('nccID')
    .then(data=>{
        //console.log("chieu di: ",data.chieuve.length)
        datatrips.push({
          "_id": data._id,
          "ten": data.ten,
          "ncc": data.nccID.tenncc,
          "matuyen": data.matuyen,
          "partnerID":data.partnerID
        })
        datatrips.push()
        for (let index = 0; index < data.chieuve.length; index++) {
            for (let t = 0; t < data.chieuve[index].time.length; t++) {
                
                if(data.chieuve[index].time[t].tripCode == req.params.machuyen){
                    let trip = {}
                    trip.time =  data.chieuve[index].time[t]
                    trip.locationID = data.chieuve[index].locationID
                    trips.push(trip)
                }
                
            }
        }
        //console.log("trip: ",trips.length)
        datatrips.push(trips)
        
    })
    .catch(err=>{
        console.log(err)
    })
    return datatrips
  }
  timchuyen()
  .then(data=>{
      //console.log("data: ",data)
      res.render('customer/pages/2B.return.trip.ejs',{data:data});

  })
  .catch(err=>{
      console.log(err)
  })
})

/* 4. Chi tiết địa điểm */
router.get('/dia-diem/:id',function(req , res, next){
  /* Tìm các tuyến đi, đi qua và đến */

  async function timcactuyen(){
    let cactuyenquadiem_chieudi = await routerModel.find({chieudi: {$elemMatch: {locationID:{$regex:req.params.id}}}})
    let cactuyenquadiem_chieuve = await routerModel.find({chieuve: {$elemMatch: {locationID:{$regex:req.params.id}}}})
    //console.log("chieudi: ",cactuyenquadiem_chieudi)
    //console.log("chieuve: ",cactuyenquadiem_chieuve)
    let cactuyenkhoihanh = []
    let cactuyenketthuc = []
    let cactuyendiqua = []
    /* Tìm ở chiều đi */
    for (let index = 0; index < cactuyenquadiem_chieudi.length; index++) {
      if(cactuyenquadiem_chieudi[index].chieudi[0].locationID==req.params.id){
        cactuyenkhoihanh.push(cactuyenquadiem_chieudi[index])
      } else if(cactuyenquadiem_chieudi[index].chieudi[cactuyenquadiem_chieudi[index].chieudi.length - 1].locationID==req.params.id){
        cactuyenketthuc.push(cactuyenquadiem_chieudi[index])
      } else if(cactuyenquadiem_chieudi[index].chieudi[0].locationID!==req.params.id&&cactuyenquadiem_chieudi[index].chieudi[cactuyenquadiem_chieudi[index].chieudi.length - 1].locationID!==req.params.id){
        cactuyendiqua.push(cactuyenquadiem_chieudi[index])
      }
    }
    /* Tìm ở chiều về */
    for (let index = 0; index < cactuyenquadiem_chieuve.length; index++) {
      if(cactuyenquadiem_chieuve[index].chieuve[0].locationID==req.params.id){
        cactuyenkhoihanh.push(cactuyenquadiem_chieuve[index])
      } else if(cactuyenquadiem_chieuve[index].chieuve[cactuyenquadiem_chieuve[index].chieuve.length - 1].locationID==req.params.id){
        cactuyenketthuc.push(cactuyenquadiem_chieuve[index])
      } else if(cactuyenquadiem_chieuve[index].chieuve[0].locationID!==req.params.id&&cactuyenquadiem_chieuve[index].chieuve[cactuyenquadiem_chieuve[index].chieuve.length - 1].locationID!==req.params.id){
        cactuyendiqua.push(cactuyenquadiem_chieuve[index])
      } 
    } 
    //console.log("cactuyen_khoihanh: ",cactuyenkhoihanh)
    //console.log("cactuyen_ketthuc: ",cactuyenketthuc)
    //console.log("cactuyen_diqua: ",cactuyendiqua)
    return {
      cactuyenkhoihanh, 
      cactuyenketthuc,
      cactuyendiqua
    }
  }

  timcactuyen()
  .then(cactuyen=>{
    let cactuyenkhoihanh = cactuyen.cactuyenkhoihanh
    let cactuyenketthuc = cactuyen.cactuyenketthuc
    let cactuyendiqua = cactuyen.cactuyendiqua
    diadiemchitietModel.findById({
      _id:req.params.id
    })
    .populate('byuserID')
    .then(data=>{
      res.render('customer/pages/4.1location.customer.ejs',{data: data,cactuyenkhoihanh: cactuyenkhoihanh,cactuyenketthuc: cactuyenketthuc, cactuyendiqua: cactuyendiqua })
    })
    .catch(err=>{
      console.log(err)
    })
  })
  

  
})
/* 5. Trang riêng nhà cung cấp */
router.get('/p/:id',function(req , res, next){

  async function datancc(){

    let sotuyen = await routerModel.count({nccID:req.params.id})
    let cactuyen = await routerModel.find({nccID:req.params.id})
    .populate('chieudi.locationID')
    let soluongdiadiem = 0
    for (let index = 0; index < cactuyen.length; index++) {
      soluongdiadiem = soluongdiadiem + cactuyen[index].chieudi.length
    }
    //console.log(soluongdiadiem)
    let nccinfo = await partnerModel.find({_id:req.params.id})
    .populate('userID')
    
    return {
      sotuyen,
      cactuyen,
      soluongdiadiem,
      nccinfo
    }

  }
  datancc()
  .then(datancc=>{
    //console.log(datancc.nccinfo)
    res.render('customer/pages/5.ncc.customer.ejs',{data: datancc})
  })

  
  
  
})

/* 98 Thống kê */
router.get('/thong-ke',function(req , res, next){

  /* Đếm số tuyến đi qua tỉnh */
  async function demtuyenquatinh(){
    let cactuyenquacactinh = []
    for (let index = 0; index < cactinh.length; index++) {
      let cactuyenqua1tinh = {}
      cactuyenqua1tinh.name = cactinh[index].name_slug
      let tinhcantim = 'tinh-'+cactinh[index].name_slug
      let cactuyenquatinh_chieudi = await routerModel.count({chieudi: {$elemMatch: {location_slug:{$regex:tinhcantim}}}})
      let cactuyenquatinh_chieuve = await routerModel.count({chieuve: {$elemMatch: {location_slug:{$regex:tinhcantim}}}})
      cactuyenqua1tinh.sltuyen = cactuyenquatinh_chieudi + cactuyenquatinh_chieuve
      cactuyenquacactinh.push(cactuyenqua1tinh)
      console.log(cactuyenqua1tinh)
    }
    return cactuyenquacactinh
  }
  
  demtuyenquatinh()
  .then(data=>{
    console.log(data)
    res.json(data)
  })
    
})
/* 99 Lọc và tìm kiếm */
router.get('/tim-kiem',function(req , res, next){ 
  
  console.log("q: ",req.query)
  /* Function */
  /* Đếm loại phương tiện */
  async function demcacloaiphuongtien() {
    let total = []
    let total_xebus = await routerModel.count({loai:1})
    let total_xekhach = await routerModel.count({loai:2})
    let total_taxi = await routerModel.count({loai:3})
    let total_moto = await routerModel.count({loai:4})
    let total_tauthuyen = await routerModel.count({loai:5})
    let total_khac = await routerModel.count({loai:6})
    total.push(total_xebus,total_xekhach, total_taxi, total_moto, total_tauthuyen,total_khac)
    return total
  }
  
  /* Lọc theo loại */
  async function timkiemloai(loai,q){
    
    let total = await demcacloaiphuongtien()
    /* kq tim kiem */
    let kq = await routerModel.find({loai:q })
      .limit(10)
      .sort({timeedit: 'desc'})
      .populate('chieudi.locationID')
      .populate('chieuve.locationID')
      .populate('partnerID')
      .populate('nccID')

    return {
      kq,
      cactinh,
      loai,
      total
    }
  }
  /* Tìm kiếm theo loại và tinh */
  async function timkiemloaivatinh(loai,tinh){
    /* Đếm các tuyến đường */
    let total = await demcacloaiphuongtien()
    /* Kq tìm kiếm */
    let kq = await routerModel.find({loai:loai,$or:[{chieudi: {$elemMatch: {location_slug:{$regex:tinh}}}},{chieuve: {$elemMatch: {location_slug:{$regex:tinh}}}}]})
            .limit(10)
            .sort({timeedit: 'desc'})
            .populate('chieudi.locationID')
            .populate('chieuve.locationID')
            .populate('partnerID')
            .populate('nccID')
    return {
      kq,
      cactinh,
      loai,
      total
    }
  }
  /* Tìm kiếm theo tinh */
  async function timkiemtheotinh(loai, tinh){
    /* Đếm các tuyến đường */
    let total = await demcacloaiphuongtien()
    /* Kq tìm kiếm */
    let kq = await routerModel.find({$or:[{chieudi: {$elemMatch: {location_slug:{$regex:tinh}}}},{chieuve: {$elemMatch: {location_slug:{$regex:tinh}}}}]})
            .limit(10)
            .sort({timeedit: 'desc'})
            .populate('chieudi.locationID')
            .populate('chieuve.locationID')
            .populate('partnerID')
            .populate('nccID')
    return {
      kq,
      cactinh,
      loai,
      total
    }
  }

  /* Gợi ý từ khóa địa điểm (dung cho auto complete) */
  async function timkiemtheotukhoa(tukhoa){
    let kq = await diadiemchitietModel.find({$or:[{ten:{$regex:tukhoa}}, {duong:{$regex:tukhoa}}, {phuong:{$regex:tukhoa}}, {quan:{$regex:tukhoa}}, {tinh:{$regex:tukhoa}}]})
      .limit(50)
      .populate('byuserID')
      .sort({timeedit: 'desc'}) 
    return {
      kq
    }
  }
  
   

  if(req.query.loai&&req.query.tinh==null&&req.query.tukhoa==null){
    /* Tìm theo loại phương tiện */
    let loai = req.query.loai
    let q = req.query.loai
    
    timkiemloai(loai,q)
    .then(data=>{
      //console.log(data)
      res.render('customer/pages/home.customer.ejs', { data: data }); 
    })
  
  } else if(req.query.loai==null&&req.query.tinh==null&&req.query.tukhoa==null) {
    /* Tìm tất cả */
    let loai = "tat-ca"
    let q = /[1-6]/
    timkiemloai(loai,q)
    .then(data=>{
      //console.log(data)
      res.render('customer/pages/home.customer.ejs', { data: data });
    })
  
  } else if(req.query.loai!=='tat-ca'&&req.query.tinh&&req.query.tukhoa==null) {
    /* Tìm theo tinh va loai*/
    let loai = req.query.loai
    let tinh = req.query.tinh
    timkiemloaivatinh(loai,tinh)
    .then(data=>{
      //console.log(data)
      //res.json(data)
      res.render('customer/pages/home.customer.ejs', { data: data });
    })
  
  } else if(req.query.loai=='tat-ca'&&req.query.tinh&&req.query.tukhoa==null) {
    /* Tìm theo tinh va loai*/
    let tinh = req.query.tinh
    let loai = req.query.loai
    timkiemtheotinh(loai, tinh)
    .then(data=>{
      console.log(data)
      //res.json(data)
      res.render('customer/pages/home.customer.ejs', { data: data });
    })
  
  } else if(req.query.tukhoa) {
    /* Gợi ý địa điểm */
    let tukhoa = req.query.tukhoa
    timkiemtheotukhoa(tukhoa)
    .then(data=>{
      //console.log(data)
      res.json(data)
    })
    
  }

})

router.get('/tim-kiem/dia-diem/',function(req , res, next){ 
  
  //console.log("q: ",req.query)
  let diadiem = req.query.tukhoa
  let tachdiadiem = diadiem.split(", ")
  //console.log(tachdiadiem)
  if(tachdiadiem.length===5){
    /* Tìm tuyến đường chứa địa điểm */
    async function timkiemtuyentheodiadiem(){
      
      let locationID = await diadiemchitietModel.findOne({
        ten:tachdiadiem[0],
        duong:tachdiadiem[1],
        phuong: tachdiadiem[2],
        quan: tachdiadiem[3],
        tinh:  tachdiadiem[4],
      })
      
      //console.log("location: ",locationID)
        
      let kq = await routerModel.find({$or:[{chieudi: {$elemMatch: {locationID:locationID._id}}},{chieuve: {$elemMatch: {locationID:locationID._id}}}]})
      .limit(10)
      .sort({timeedit: 'desc'})
      .populate('chieudi.locationID')
      .populate('chieuve.locationID')
      .populate('partnerID')
      .populate('nccID')
      
      let total = []
      let total_xebus = 0
      let total_xekhach = 0
      let total_taxi = 0
      let total_moto = 0
      let total_tauthuyen = 0
      let total_khac = 0

      //console.log("ket qua: ", kq)
      for (let index = 0; index < kq.length; index++) {
        if(kq[index].loai=="1"){
          total_xebus++
        } else if(kq[index].loai=="2"){
          total_xekhach++
        } else if(kq[index].loai=="3"){
          total_taxi++
        } else if(kq[index].loai=="4"){
          total_moto++
        } else if(kq[index].loai=="5"){
          total_tauthuyen++
        } else if(kq[index].loai=="6"){
          total_khac++
        }
      }
      total.push(total_xebus,total_xekhach, total_taxi, total_moto, total_tauthuyen,total_khac)
      console.log("Tổng: ", total)
      return {
        kq,
        total
      }
    }
    timkiemtuyentheodiadiem()
    .then(data=>{
      //console.log(data)
      res.render('customer/pages/3A.location-seach.customer.ejs', { data: data });
      
    })
  }
  else {
    res.json("Chưa làm chỗ này")
  }
  
})
module.exports = router;
