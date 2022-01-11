const mongoose = require('mongoose');
require('dotenv').config()

try {
mongoose.connect(process.env.DBSTRING);

} catch (error) {
    handleError(error);
}

// Model
var imglocationSchema = new mongoose.Schema({
    locationID:{type: String, ref:"locations"},
    imgs:[{
            filename: String,
            originalname: String,
            size: Number,
            by: {type: String, ref:"users"},
            timecreate: Date,
            totalviews: Number
        }]    
    },{collection : 'img.locations'})
    
var imglocationModel = mongoose.model('imglocationModel',imglocationSchema)




imglocationModel.findById({
_id: "61dcf8dce44f25731a9cf4d5"
}) 
.then(data=>{
    console.log(data)
})
.catch(err=>{
    console.log(err)
})




module.exports = imglocationModel