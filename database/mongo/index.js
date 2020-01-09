'use strict';

// doc: https://github.com/Automattic/mongoose

const config = require('../config')
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const logger = require('../../logger')
const models = {};

const conn = function(){
    let url = 'mongodb://';
    url += config.mongoConfig.username ? config.mongoConfig.username + ':' : '';
    url += config.mongoConfig.password ? config.mongoConfig.password + '@' : '';
    url += config.mongoConfig.host ? config.mongoConfig.host : 'localhost';
    url += ':';
    url += config.mongoConfig.port ? config.mongoConfig.port : '27017';
    url += '/';
    url += config.mongoConfig.database ? config.mongoConfig.database : '';

    logger.info('');
    logger.info('---- ---- ---- ---- ---- ----');
    logger.info('| 开始创建连接MongoDB, url: %s', url);
    logger.info('---- ---- ---- ---- ---- ----');

    return mongoose.createConnection(url, config.mongoConfig.options);
}()

conn.on('open', () => {
    logger.info('');
    logger.info('---- ---- ---- ---- ---- ----');
    logger.info('| 成功打开MongoDB');
    logger.info('---- ---- ---- ---- ---- ----');
});

conn.on('connected', () => {
    logger.info('');
    logger.info('---- ---- ---- ---- ---- ----');
    logger.info('| 成功与MongoDB建立连接');
    logger.info('---- ---- ---- ---- ---- ----');
});


conn.on('error', (err) => {
    logger.error('');
    logger.error('---- ---- ---- ---- ---- ----');
    logger.error('| 连接MongoDB出错：%s', err);
    logger.error('---- ---- ---- ---- ---- ----');
});

conn.on('disconnected', () => {
    logger.info('');
    logger.info('---- ---- ---- ---- ---- ----');
    logger.info('| 断开MongoDB连接');
    logger.info('---- ---- ---- ---- ---- ----');
});

conn.on('close', () => {
    logger.info('');
    logger.info('---- ---- ---- ---- ---- ----');
    logger.info('| 关闭MongoDB连接');
    logger.info('---- ---- ---- ---- ---- ----');
});


// 加载models
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        let schema = require(path.join(__dirname, file));
        let modelName = file.slice(0, -3)
        logger.info('');
        logger.info('---- ---- ---- ---- ---- ----');
        logger.info('| 正在进入model:%s', modelName);
        models[modelName] = conn.model(modelName, schema);
        logger.info('| ===========100%=========');
        logger.info('---- ---- ---- ---- ---- ----');
    });

module.exports = models;
