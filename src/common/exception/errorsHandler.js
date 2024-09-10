// returning all error results as json message 
function AllExceptionHandler(err, req, res, next) {

    let status = err?.status ?? err?.statusCode ?? err?.code;
    if (!status || isNaN(+status) || status > 511 || status < 200) status = 500;
    return res.status(status).json({
        message: err?.message ?? err?.stack ?? "InternalServerError",
        statusCode: status
    })
}
module.exports = AllExceptionHandler;