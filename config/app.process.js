const mongoose = require("mongoose");
process.once(process.env.MONGOOSE_EVENT_SIGINT, function(){
    mongoose.connection.close(function(){
        console.log(process.env.MONGOOSE_EVENT_SIGINT_MESSAGE);
        process.exit(parseInt(process.env.EXIT_CODE, process.env.BASE));
    })
})

process.once(process.env.SIGUSR2, function (){
    mongoose.connection.close(function(){
        console.log(process.env.MONGOOSE_EVENT_SIGUSR2_MESSAGE);
        process.kill(process.pid, process.env.SIGUSR2);
    })
});