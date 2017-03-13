/**
 * Created by ling xue on 14-4-29.
 * The file is include all the client message of system.
 * The message used to be a tip on the client.
 * EX. module_api_logic_result
 */

/**
 * The module of system basic module
 * @type {string}
 */
var SYS_AUTH_TOKEN_ERROR ="当前用户级别，不能完成此操作" ; //The token info in request headers is error,can't access api.
var SYS_VALIDATE_EMAIL_ERROR = "The email is not correct"; // The email will be used format is not correct.
var SYS_VALIDATE_EMAIL_DUPLICATE = "该邮箱已经被使用"; // The email will be used format is not correct.
var SYS_INTERNAL_ERROR_MSG = "Web Service Internal Error . ";
var SYS_PARAMETERS_ERROR_MSG = "Parameters is error . ";
var SYS_TABLE_DUPLICATE_ERROR_MSG = "Duplicate parameter !";
var SYS_TAX_DUPLICATE_ERROR_MSG = "Duplicate parameter !";
var SYS_MESSAGE_QUEUE_ERROR_MSG = "Message queue is down !";
/**
 * The module of customer
 * @type {string}
 */
var CUST_SIGNUP_REGISTERED = "已被注册";//Cutomer do signup ,but the current phone has been exist in system.
var CUST_SIGNUP_REGISTERED_EN = "The user has been exist in system .";//Cutomer do signup ,but the current phone has been exist in system.
var CUST_LOGIN_USER_UNREGISTERED = "尚未注册"; //Customer use a email that not exist in system to login
var CUST_SMS_CAPTCHA_ERROR = "短信验证码错误";
var CUST_LOGIN_PSWD_ERROR = "登录密码错误" ; // Customer enter a wrong password on login
var CUST_ORIGIN_PSWD_ERROR = "原始密码错误" ; //Customer need enter origin password before change new login password
var CUST_ACTIVE_DATA_ERROR = "The active url is not valid"; //The active data is wrong in active url.
var CUST_ACTIVE_DUPLICATE_ERROR = "The user has been actived" // User do active when user state is active.
var CUST_ACTIVE_STATE_ERROR = "The user is not actived" // User do active when user state is active.
var CUST_FORBIDDEN_STATE_ERROR = "The user is forbidden" // User status is forbidden.
var CUST_CHANGE_EMAIL_DATA_ERROR = "The change email url is not valid" // User do active when user state is active.

/**
 * The module for admin
 */
var ADMIN_LOGIN_USER_UNREGISTERED = "用户不存在"; //Customer use a email that not exist in system to login.




/**
 * The module of image
 * @type {string}
 */
var IMG_QUERY_NO_EXIST = "The image is not found"; //can not get image by meta data.


/**
 * The module of mongodb record status
 * @type {string}
 */
var SYS_ADD_API_RECORD_ERROR = "Can not add api to mongodb";
var SYS_ADD_ORDER_LOCATION_ERROR = "Can not add order loaction info to mongodb";



/**
 * Export
 * @type {{SYS_AUTH_TOKEN_ERROR: string, SYS_VALIDATE_EMAIL_ERROR: string, CUST_SIGNUP_EMAIL_REGISTERED: string, CUST_LOGIN_USER_UNREGISTERED: string, CUST_ORIGIN_PSWD_ERROR: string, CUST_LOGIN_PSWD_ERROR: string, CUST_ACTIVE_DATA_ERROR: string, CUST_ACTIVE_DUPLICATE_ERROR: string, PROD_QUERY_BIZ_NO_DATA: string, PROD_QUERY_NO_EXIST: string, PROD_QUERY_TYPE_BIZ_NULL: string, PROD_QUERY_TOP_NULL: string, COUPON_SEND_INVALID_USER: string}}
 */
module.exports = {
    SYS_AUTH_TOKEN_ERROR :SYS_AUTH_TOKEN_ERROR,
    SYS_VALIDATE_EMAIL_ERROR : SYS_VALIDATE_EMAIL_ERROR,
    SYS_VALIDATE_EMAIL_DUPLICATE : SYS_VALIDATE_EMAIL_DUPLICATE ,
    SYS_INTERNAL_ERROR_MSG : SYS_INTERNAL_ERROR_MSG,
    SYS_TABLE_DUPLICATE_ERROR_MSG : SYS_TABLE_DUPLICATE_ERROR_MSG ,
    SYS_TAX_DUPLICATE_ERROR_MSG : SYS_TAX_DUPLICATE_ERROR_MSG ,
    SYS_PARAMETERS_ERROR_MSG : SYS_PARAMETERS_ERROR_MSG,

    CUST_SIGNUP_REGISTERED :CUST_SIGNUP_REGISTERED,
    CUST_SIGNUP_REGISTERED_EN : CUST_SIGNUP_REGISTERED_EN,
    CUST_LOGIN_USER_UNREGISTERED : CUST_LOGIN_USER_UNREGISTERED,
    CUST_SMS_CAPTCHA_ERROR : CUST_SMS_CAPTCHA_ERROR ,
    CUST_ORIGIN_PSWD_ERROR : CUST_ORIGIN_PSWD_ERROR,
    CUST_LOGIN_PSWD_ERROR : CUST_LOGIN_PSWD_ERROR,
    CUST_ACTIVE_DATA_ERROR : CUST_ACTIVE_DATA_ERROR,
    CUST_ACTIVE_DUPLICATE_ERROR : CUST_ACTIVE_DUPLICATE_ERROR,
    CUST_ACTIVE_STATE_ERROR : CUST_ACTIVE_STATE_ERROR,
    CUST_CHANGE_EMAIL_DATA_ERROR : CUST_CHANGE_EMAIL_DATA_ERROR,
    CUST_FORBIDDEN_STATE_ERROR : CUST_FORBIDDEN_STATE_ERROR ,

    IMG_QUERY_NO_EXIST : IMG_QUERY_NO_EXIST,
    SYS_ADD_API_RECORD_ERROR : SYS_ADD_API_RECORD_ERROR,
    SYS_ADD_ORDER_LOCATION_ERROR : SYS_ADD_ORDER_LOCATION_ERROR,

    ADMIN_LOGIN_USER_UNREGISTERED : ADMIN_LOGIN_USER_UNREGISTERED ,
    SYS_MESSAGE_QUEUE_ERROR_MSG : SYS_MESSAGE_QUEUE_ERROR_MSG

}