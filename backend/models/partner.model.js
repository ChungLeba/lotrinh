const mongoose = require('mongoose');
require('dotenv').config()

try {
mongoose.connect(process.env.DBSTRING);

} catch (error) {
    handleError(error);
  }


// Model
var partnerSchema = new mongoose.Schema({
    userID: {type:String, ref:"userModel"},
    tenncc: String,
    urlrieng: String,
    caclienhe:
        [
            {tt:Number, bophan:String, dienthoai:String, diachi:String}
        ]
    },{collection : 'partner.info'})
    
var partnerModel = mongoose.model('partnerModel',partnerSchema)

//CREATE DATA

/* partnerModel.create({
    userID: "String",
    tenncc: "String",
    caclienhe:[
        {tt:1, bophan:"String", diachi:"String", dienthoai:"String"}
    ]
}) */

/* partnerModel.find()
.then(data=>{
    console.log(data)
})
.catch(err=>{
    console.log(err)
}) */

module.exports = partnerModel;