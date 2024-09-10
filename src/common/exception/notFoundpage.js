// This function is going to manage 404 error page
function NotFoundErr(req, res, next) {
    return res.status(404).json({
        StatusCode: res.statusCode,
        message: `ROUTE ${req.url} IS NOT AVAILABLE`
    });
};


module.exports = NotFoundErr;