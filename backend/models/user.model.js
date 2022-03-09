const mongoose = require('mongoose');
require('dotenv').config()

try {
mongoose.connect(process.env.DBSTRING);

} catch (error) {
    handleError(error);
  }


// Model
var userSchema = new mongoose.Schema({
    phanquyen: Number, //1: admin, 2: partner, 3: khach hang
    email: String,
    /* matkhau: String, */
    hoten: String,
    nickname: String,
    sodienthoai: String,
    diachi: String,
    hash: String,
    salt: String,
    lasttoken: String,
    totalviews: Number
    },{collection : 'users'})
    
var userModel = mongoose.model('userModel',userSchema)

//CREATE DATA
/* userModel.updateMany({totalviews:1})
.then(data=>{
    console.log(data)
}) */
/* userModel.create({
    phanquyen: 1, //1: admin, 2: nhanvien, 3: khach hang
    email: "lebachungtdh@gmail.com",
    hoten: "Lê Bá Chung",
    sodienthoai: "0989527911",
    diachi: "77 Lê Văn Thịnh, Hòa Minh, Liên Chiểu, Đà Nẵng",
    hash: "String",
    salt: "String",
    lasttoken: "String"
})

userModel.find()
.then(data=>{
    console.log(data)
})
.catch(err=>{
    console.log(err)
})
 */
module.exports = userModel;