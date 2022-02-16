var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model')
var diadiemchitietModel = require('../models/location.model')
var imglocationModel = require('../models/img.location.model');
var routerModel = require('../models/router.model');

/* 1.Trang chủ */
router.get('/', function(req, res, next) {
  routerModel.find()
  .limit(10)
  .sort({timeedit: 'desc'})
  .populate('chieudi.locationID')
  .populate('chieuve.locationID')
  .populate('partnerID')
  .then(data=>{
    //console.log(data)
    if(data){
      res.render('customer/pages/home.customer.ejs', { data: data });
    } else {
      res.end("chua co du lieu")
    }
    
  })
});

/* 2.Trang chi tiết tuyến đường */
router.get('/lo-trinh/:id', function(req, res, next) {
  routerModel.findById(req.params.id)
  .populate("chieudi.locationID")
  .populate("chieuve.locationID")
  .populate('partnerID')
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
  console.log(req.params)
  async function timchuyen(){
    let datatrips = []
    let trips = []
    await routerModel.findOne({
        _id: req.params.id

    })
    .populate("chieudi.locationID")
    .populate("partnerID")
    .then(data=>{
        console.log("chieu di: ",data.chieudi.length)
        datatrips.push({
          "_id": data._id,
          "ten": data.ten,
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
  console.log(req.params)
  async function timchuyen(){
    let datatrips = []
    let trips = []
    await routerModel.findOne({
        _id: req.params.id

    })
    .populate("chieuve.locationID")
    .populate("partnerID")
    .then(data=>{
        console.log("chieu di: ",data.chieuve.length)
        datatrips.push({
          "_id": data._id,
          "ten": data.ten,
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
      res.render('customer/pages/2B.return.trip.ejs',{data:data});

  })
  .catch(err=>{
      console.log(err)
  })
})
module.exports = router;
