// requirements
const express = require("express");
const AllExceptionHandler = require("./src/common/exception/errorsHandler");
const NotFoundErr = require("./src/common/exception/notFoundpage");
const app = express();
require("./src/config/mongoose.config");
// Routes 

// Error-Handling
app.use(NotFoundErr);
app.use(AllExceptionHandler);



app.listen(3000, () => {
    console.log("server is run on port 3000");
});