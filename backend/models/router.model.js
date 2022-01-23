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
    ten: String, 
    chieudi: [{locationID: {type: String, ref:"diadiemchitietModel"}, time:[{
                                                                            no:{type: Number},
                                                                            tripCode:{type: String},
                                                                            time:{type: String},
                                                                            date:{type: Date},
                                                                            frequency:{type: String}
                                                                            }]}],
    chieuve: [{locationID: {type: String, ref:"diadiemchitietModel"}, time:[{
                                                                            no:{type: Number},
                                                                            tripCode:{type: String},
                                                                            time:{type: String},
                                                                            date:{type: Date},
                                                                            frequency:{type: String}
                                                                            }]}],
    partnerID: {type: String, ref:"userModel"},
    timecreate: Date,
    timeedit: Date
},{collection : 'routers'})
    
var routerModel = mongoose.model('routerModel',routerSchema)

//CREATE DATA

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