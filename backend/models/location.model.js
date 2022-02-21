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
    byuserID: String,
    todayviews: Number,
    totalviews: Number
    },{collection : 'locations'})
    
var diadiemchitietModel = mongoose.model('diadiemchitietModel',diadiemchitietSchema)



/* diadiemchitietModel.updateMany({},{$set: {todayviews: random}},{upsert:true,
    multi:true})
.then(data=>{
    console.log(data)
})
.catch(err=>{
    console.log(err)
}) */

/* diadiemchitietModel.findOne({tinh:"Thành phố Đà Nẵng"})
.then(data=>{
    let tinhID = data._id
    console.log("kq:",tinhID)
})
.catch(err=>{
    console.log(err)
})
 */


module.exports = diadiemchitietModel