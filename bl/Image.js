
var imageDao = require('../dao/ImageDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var resUtil = require('../util/ResponseUtil.js');
var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var logger = serverLogger.createLogger('Image.js');

/**
 * get image file by image object id
 */
function getImageById(req, res, next) {
    var params = req.params;
    var imageId = params.imageId;
    var size = params.size;
    /*res.redirect({
        pathname: '/images/logo.png'}, next);*/
    imageDao.getMetaData(imageId, {size: size}, function (err, col) {
        if (err || !col) {
            logger.error(' getImageById ' + sysMsg.IMG_QUERY_NO_EXIST + params.imageId);
            return resUtil.resInternalError(err, res, next);
        }

        var etag = req.headers['if-none-match'];
        if (etag && col.md5 && etag == col.md5) {
            res.send(304);
            return next();
        }

        imageDao.getImage(imageId, {size: size}, function (err, fstream) {
            if (err) {
                logger.error(' getImageById ' + err.message);
                return resUtil.resInternalError(err, res, next);
            }

            res.cache({maxAge: 31536000});
            //res.set("cache-control","no-cache");
            res.set('content-type', col.contentType);
            res.set('last-modified', col.uploadDate);
            res.set('etag', col.md5);
            res.set('content-length', col.length);
            res.writeHead(200);
            fstream.pipe(res);
            fstream.once('end', function () {
                logger.info(' getImageById ' + 'success');
                next(false);
            });
        });
    })
}

/**
 * upload user id image,return image id
 */
function uploadImage(req, res, next) {
    var params = req.params;
    var metaData = {};
    metaData.userId = params.userId;
    metaData.imageType = params.imageType;
    imageDao.saveImage(req.files.image, metaData, function (error, path) {
        if (error) {
            logger.error(' uploadImage ' + error.message);
            return next(sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG));
        } else {
            logger.info(' uploadUserIdImage ' + ' success ');
            res.send(200, {success: true, imageId: path});
            return next();
        }
    })
}

/**
 * upload image in three size, large medium and small
 * @param req
 * @param res
 * @param next
 */
function uploadImageSet(req, res, next) {
    if (!req.files || ! req.files.image){
        return next(sysError.MissingParameterError("no image found in form data","no image found in form data"));
    }
    var params = req.params;
    var image = req.files.image;
    var metaData = {}, result = {};
    metaData.filename = image.name;

    if (params.biz_id) {
        metaData.biz_id = params.biz_id;
    }
    if (params.prod_id) {
        metaData.prod_id = params.prod_id;
    }
    if (params.promo_id) {
        metaData.promo_id = params.promo_id;
    }
    if (params.coupon_id) {
        metaData.coupon_id = params.coupon_id;
    }
    if (params.user_id) {
        metaData.user_id = params.user_id;
    }
    if (params.type_id) {
        metaData.type_id = params.type_id;
    }
    if (params.tenant) {
        metaData.tenant = params.tenant;
    }

    imageDao.saveImageSet(null, image, metaData, function (error, path) {
        if (error) {
            logger.error(' uploadImage ' + error.message);
            return resUtil.resInternalError(error, res, next);
        } else {
            result.insertId = path;
            resUtil.resetCreateRes(res, result, null);
            return next();
        }
    })
}


module.exports = {
    getImageById: getImageById,
    uploadImage: uploadImage,
    uploadImageSet: uploadImageSet
}
