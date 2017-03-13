/**
 * Created by ling xue on 15-12-23.
 */
var sysError = require('./SystemError.js');
var sysMsg= require('./SystemMsg.js');

function resetQueryRes(res,result,errMsg){
    res.send(200,{success : true,result:result,msg:errMsg});
}

function resetCreateRes(res,result,errMsg){
    if(result && result.insertId){
        res.send(200,{success : true,id:result.insertId});
    }else{
        res.send(200,{success : false,msg:errMsg});
    }
}

function resetUpdateRes(res,result,errMsg){
    if(result && result.affectedRows>0){
        res.send(200,{success : true});
    }else{
        res.send(200,{success : false,msg:errMsg});
    }
}

function resetFailedRes(res,errMsg){
    res.send(200,{success:false,msg:errMsg});
}

function resInternalError(error , res ,next){
    return next(sysError.InternalError(sysMsg.SYS_INTERNAL_ERROR_MSG));
    //throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
}

module.exports = {
    resetQueryRes : resetQueryRes,
    resetCreateRes : resetCreateRes,
    resetUpdateRes : resetUpdateRes ,
    resetFailedRes : resetFailedRes ,
    resInternalError : resInternalError
}