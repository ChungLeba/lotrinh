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
    impression: Number
    },{collection : 'locations'})
    
var diadiemchitietModel = mongoose.model('diadiemchitietModel',diadiemchitietSchema)

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