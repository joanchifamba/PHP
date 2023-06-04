const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL, {useNewUrlParser:true, useUnifiedTopology:true});

mongoose.connection.on(process.env.MONGOOSE_EVENT_CONNECTED, function(){
    console.log(process.env.MONGOOSE_EVENT_CONNECTED_LABEL, process.env.DB_NAME);
});

mongoose.connection.on(process.env.MONGOOSE_EVENT_DISCONNECTED, function(){
    console.log(process.env.MONGOOSE_EVENT_DISCONNECTED_LABEL);
});

mongoose.connection.on(process.env.MONGOOSE_EVENT_ERROR, function(err) {
    console.log(err);
})
require("../../config/app.process");
require("../models/model");

