const mongoose = require('mongoose');
require('dotenv').config()

try {
mongoose.connect(process.env.DBSTRING);

} catch (error) {
    handleError(error);
}

// Model
var diadiemchitietSchema = new mongoose.Schema({
    ten: String,
    duong: String,
    phuong: String,
    quan: String,
    tinh: String,
    nuoc: String,
    img_logo: String,
    loaidiem: String,
    gioithieu: String,
    dvql: [{name: {type: String},fone: {type: String},add: {type: String}}],
    dvcc: [{name: {type: String},fone: {type: String},add: {type: String}}],
    img_diadiem: String,
    timecreate: Date,
    timeedit: Date,
    by: String,
    byuserID: {type:String, ref:"userModel"},
    todayviews: Number,
    totalviews: Number,
    impression: Number,
    url_friendly: String
    },{collection : 'locations'})
    
var diadiemchitietModel = mongoose.model('diadiemchitietModel',diadiemchitietSchema)
//Update Slug
/* let url_friendly = function (ten,duong,phuong,quan,tinh){
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

diadiemchitietModel.find({})
.then(data=>{
    //console.log(data)
    async function update_location(){
        for (let index = 0; index < data.length; index++) {
            console.log(data[index]._id)
            await diadiemchitietModel.updateOne(
                {_id: data[index]._id},
                {url_friendly: url_friendly(data[index].ten, data[index].duong, data[index].phuong, data[index].quan, data[index].tinh)}
            )
            .then(kq=>{console.log(kq)})
            .catch(err=>{console.log(err)})
        }
    }
    update_location()
}) */

/* diadiemchitietModel.updateMany({totalviews:0})
.then(data=>{
    console.log(data)
}) */

/* diadiemchitietModel.updateMany({},{$set: {todayviews: random}},{upsert:true,
    multi:true})
.then(data=>{
    console.log(data)
})
.catch(err=>{
    console.log(err)
}) */

/* diadiemchitietModel.find({tinh:"Hà Nội"})
.then(data=>{
    console.log("kq:",data.length)
})
.catch(err=>{
    console.log(err)
})
 */


module.exports = diadiemchitietModel