var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

router.put('/:category_idx', async (req, res) => {
    let modifyQuery1 = `SELECT category_name FROM category WHERE category_idx=?`;
    let modifyResult1 = await db.queryParam_Arr(modifyQuery1, [req.params.category_idx]);
    if(!modifyResult1) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        //카테고리 유효성 검사 1. 이미 있는 카테고리인지 검사 2. 카테고리 글자수 검사
        if(modifyResult1[0].category_name == req.body.category_name) {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_CATE_NAME));
        } else if(req.body.category_name.length > 5 ){
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_CATE));
        } else {
            let modifyQuery2 = `UPDATE category SET category_name =? WHERE category_idx = ?`;
            let modifyResult2 = await db.queryParam_Arr(modifyQuery2, [req.body.category_name, req.params.category_idx]);
            if(!modifyResult2) {
                res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
            } else {
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.MODIFY_CATE_SUCCESS));
            }
        }
    
    }
});

module.exports = router;