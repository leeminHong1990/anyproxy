'use strict';

const const_val = require('../common/const_val')
const switches = require('../switches')
const url = require('url');
const db = require('../database')
const logger = require('../logger')

module.exports = {
    summary: '***************a rule to tiktok response******************',
    // 发送请求前拦截处理
    *beforeSendRequest(requestDetail) {
        // let reqUrl = url.parse(requestDetail.url.replace("cursor=0&count=20", "cursor=0&count=100"))
        // if (requestDetail.url.indexOf(const_val.COMMENT_URL) === 0){
        //
        //     // const newRequestOptions = requestDetail.requestOptions;
        //     // newRequestOptions.path = reqUrl.path;
        //     // return requestDetail;
        // }
    },
    // 发送响应前处理
    *beforeSendResponse(requestDetail, responseDetail) {
        // if (requestDetail.url === 'http://httpbin.org/user-agent') {
        //     const newResponse = responseDetail.response;
        //     newResponse.body += '- AnyProxy Hacked!';
        //
        //     // console.log('|--------beforeSendResponse--------|');
        //     // console.log(requestDetail, responseDetail);
        //     // console.log('|--------------------------------------|');
        //
        //     return new Promise((resolve, reject) => {
        //         setTimeout(() => { // delay
        //             resolve({ response: newResponse });
        //         }, 5000);
        //     });
        // }
        console.log(requestDetail.url)
        for (let i=0; i<const_val.COMMENT_URL.length; i++) {
            if (requestDetail.url.indexOf(const_val.COMMENT_URL[i]) === 0){
                let bodyString = responseDetail.response.body.toString()
                let bodyObject = JSON.parse(bodyString);
                logger.info('')
                logger.info('|--------正在处理Response响应--------|');
                logger.info('| 发起请求url:%s', requestDetail.url);
                logger.info('| Response body buffer to string:%s', bodyString);
                // logger.info('| Response comments:%s', bodyObject.comments);



                if (switches.DB === const_val.DATABASE_MONGO) {
                    for (let j=0; j<bodyObject.comments.length; j++){
                        let comment = bodyObject.comments[j]
                        logger.info('| 准备开始处理第%s条评论数据, cid:%s, aweme_id:%s, text:%s', j, comment.cid, comment.aweme_id, comment.text);
                        db.mongoModels['comments'].find({
                            cid:        comment.cid,
                            aweme_id:   comment.aweme_id
                        }, function (err, docs) {
                            // docs.forEach
                            console.log(docs)
                            let count = docs.length;
                            if (count > 0){
                                logger.error('| 查重第%s条评论数据已存在, count:%s cid:%s, aweme_id:%s, text:%s', j, count, comment.cid, comment.aweme_id, comment.text);
                            } else if (err){
                                logger.error('| 查重第%s条评论数据出错, err:%s cid:%s, aweme_id:%s, text:%s', j, err, comment.cid, comment.aweme_id, comment.text);
                            } else {
                                logger.info('| 准备开始存储第%s条评论数据, cid:%s, aweme_id:%s, text:%s', j, comment.cid, comment.aweme_id, comment.text);
                                let insert_comment = new db.mongoModels['comments']({
                                    cid:                comment.cid,
                                    text:               comment.text,
                                    aweme_id:           comment.aweme_id,
                                    create_time:        comment.create_time,
                                    digg_count:         comment.digg_count,
                                    status:             comment.status,
                                    user: {
                                        uid:            comment.user.uid,
                                        short_id:       comment.user.short_id,
                                        nickname:       comment.user.nickname,
                                        gender:         comment.user.gender,
                                        signature:      comment.user.signature
                                    },

                                    reply_id:           comment.reply_id,
                                    user_digged:        comment.user_digged,
                                    reply_comment:      comment.reply_comment,
                                    reply_to_reply_id:  comment.reply_to_reply_id,
                                    is_author_digged:   comment.is_author_digged,
                                    stick_position:     comment.stick_position
                                })
                                insert_comment.save((err)=>{
                                    if (err){
                                        logger.error('| 存储第%s条评论数据失败, err：%s, cid:%s, aweme_id:%s, text:%s', j, err, comment.cid, comment.aweme_id, comment.text);
                                    } else {
                                        logger.info('| 存储第%s条评论数据成功, cid:%s, aweme_id:%s, text:%s', j, comment.cid, comment.aweme_id, comment.text);
                                    }
                                })
                            }
                        });

                    }
                }
                logger.info('|--------------------------------------|');
                break
            }
        }


    },
    // 是否处理https请求
    *beforeDealHttpsRequest(requestDetail) {
        return true;
    },
    // 请求出错的事件
    *onError(requestDetail, error) {
        logger.error('')
        logger.error('|--------请求出错--------|')
        logger.error('| 发起请求url:%s', requestDetail.url)
        logger.error('|--------------------------------------|')
    },
    // https连接服务器出错
    *onConnectError(requestDetail, error) {
        logger.error('')
        logger.error('|--------连接服务器出错--------|')
        logger.error('| 发起请求url:%s', requestDetail.url)
        logger.error('|--------------------------------------|')
    }
};