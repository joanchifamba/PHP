const mongoose = require("mongoose");
process.once(process.env.MONGOOSE_SIGINT, function(){
    mongoose.connection.close(function(){
        console.log(process.env.MONGOOSE_SIGINT_MESSAGE);
        process.exit(parseInt(process.env.EXIT_CODE, 10));
    })
    
})

process.once(process.env.SIGUSR2, function (){
    mongoose.connection.close(function(){
        console.log(process.env.MONGOOSE_SIGUSR2_MESSAGE);
        process.kill(process.pid, process.env.SIGUSR2);
    })
});