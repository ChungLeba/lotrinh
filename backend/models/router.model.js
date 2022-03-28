const mongoose = require('mongoose');
require('dotenv').config()

try {
mongoose.connect(process.env.DBSTRING);

} catch (error) {
    handleError(error);
  }


// Model
/* var routerSchema = new mongoose.Schema({
    ten: String, 
    chieudi: [{type: String, ref:"diadiemchitietModel"}],
    chieuve: [{type: String, ref:"diadiemchitietModel"}],
    partnerID: {type: String, ref:"userModel"},
    timecreate: Date,
    timeedit: Date
},{collection : 'routers'}) */

var routerSchema = new mongoose.Schema({
    url_friendly: String,
    ten: String,
    nccID:{type: String, ref:"partnerModel"},
    matuyen: String,
    loai: String, 
    chieudi: [{locationID: {type: String, ref:"diadiemchitietModel"}, location_slug: String, time:[{
                                                                            no:{type: Number},
                                                                            tripCode:{type: String},
                                                                            time:{type: String},
                                                                            date:{type: Date},
                                                                            frequency:{type: String}
                                                                            }]}],
    chieuve: [{locationID: {type: String, ref:"diadiemchitietModel"}, location_slug: String, time:[{
                                                                            no:{type: Number},
                                                                            tripCode:{type: String},
                                                                            time:{type: String},
                                                                            date:{type: Date},
                                                                            frequency:{type: String}
                                                                            }]}],
    partnerID: {type: String, ref:"userModel"},
    timecreate: Date,
    timeedit: Date,
    totalviews: Number,
    impression: Number,
    publish: Number //1:đã, 0: chưa
},{collection : 'routers'})
    
var routerModel = mongoose.model('routerModel',routerSchema)
//UPDATE URL
/* let url_friendly = function (loai,matuyen,ten){
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

routerModel.find({},{chieudi:0, chieuve:0})
.then(data=>{
    //console.log(data)
    async function update_url(){
        for (let index = 0; index < data.length; index++) {
            console.log(data[index]._id)
            console.log(data[index].ten)
            if (data[index].loai==1){
                await routerModel.updateOne(
                    {_id: data[index]._id},
                    {url_friendly: url_friendly("Xe buýt",data[index].matuyen,data[index].ten)}
                )
                .then(kq=>{console.log(kq)})
                .catch(err=>{console.log(err)})
            } else if (data[index].loai==2){
                await routerModel.updateOne(
                    {_id: data[index]._id},
                    {url_friendly: url_friendly("Xe khách",data[index].matuyen,data[index].ten)}
                )
                .then(kq=>{console.log(kq)})
                .catch(err=>{console.log(err)})
            } else if (data[index].loai==3){
                await routerModel.updateOne(
                    {_id: data[index]._id},
                    {url_friendly: url_friendly("Xe taxi",data[index].matuyen,data[index].ten)}
                )
                .then(kq=>{console.log(kq)})
                .catch(err=>{console.log(err)})
            } else if (data[index].loai==4){
                await routerModel.updateOne(
                    {_id: data[index]._id},
                    {url_friendly: url_friendly("Xe moto",data[index].matuyen,data[index].ten)}
                )
                .then(kq=>{console.log(kq)})
                .catch(err=>{console.log(err)})
            } else if (data[index].loai==5){
                await routerModel.updateOne(
                    {_id: data[index]._id},
                    {url_friendly: url_friendly("Thuyền, tàu biển",data[index].matuyen,data[index].ten)}
                )
                .then(kq=>{console.log(kq)})
                .catch(err=>{console.log(err)})
            } else if (data[index].loai==6){
                await routerModel.updateOne(
                    {_id: data[index]._id},
                    {url_friendly: url_friendly("Phương tiện khác",data[index].matuyen,data[index].ten)}
                )
                .then(kq=>{console.log(kq)})
                .catch(err=>{console.log(err)})
            }
            
        }
    }
    update_url()
}) */

//UPDATE
/* routerModel.updateMany({publish:1})
.then(data=>{
    console.log(data)
}) */

/* routerModel.create({
    ten: 'Ha Noi - Ho Chi Minh', 
    chieudi: [{locationID:"61e93355c6391909a4dd0582", time:[
                                                                "2021-12-06T13:20:33.772Z",
                                                                "2021-12-06T13:20:33.772Z",
                                                                "2021-12-06T13:20:33.772Z",
                                                                "2021-12-06T13:20:33.772Z"
                                                            ]
                },
                {locationID:"61e93355c6391909a4dd0582", time:[
                                                                "2021-12-06T13:20:33.772Z",
                                                                "2021-12-06T13:20:33.772Z",
                                                                "2021-12-06T13:20:33.772Z",
                                                                "2021-12-06T13:20:33.772Z"
                                                            ]
                },
                {locationID:"61e93355c6391909a4dd0582", time:[
                                                                "2021-12-06T13:20:33.772Z",
                                                                "2021-12-06T13:20:33.772Z",
                                                                "2021-12-06T13:20:33.772Z",
                                                                "2021-12-06T13:20:33.772Z"
                ]
                }
                                                    ],
    chieuve: [
            {locationID:"61e93355c6391909a4dd0582", time:[
                "2021-12-06T13:20:33.772Z",
                "2021-12-06T13:20:33.772Z",
                "2021-12-06T13:20:33.772Z",
                "2021-12-06T13:20:33.772Z"
            ]
            },
            {locationID:"61e93355c6391909a4dd0582", time:[
                        "2021-12-06T13:20:33.772Z",
                        "2021-12-06T13:20:33.772Z",
                        "2021-12-06T13:20:33.772Z",
                        "2021-12-06T13:20:33.772Z"
                    ]
            },
            {locationID:"61e93355c6391909a4dd0582", time:[
                        "2021-12-06T13:20:33.772Z",
                        "2021-12-06T13:20:33.772Z",
                        "2021-12-06T13:20:33.772Z",
                        "2021-12-06T13:20:33.772Z"
            ]
            }
            ],
    partnerID: "61dfe00b64f5dfcc64b6f417",
    timecreate: new Date()
})
.then(data=>{
    console.log(data)
})
.catch(err=>{
    console.log(err)
}) */

module.exports = routerModel;