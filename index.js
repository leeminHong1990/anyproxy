'use strict';

const logger = require('./logger')
const AnyProxy = require('anyproxy');
const exec = require('child_process').exec;

if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
    AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
        // let users to trust this CA before using proxy
        if (!error) {
            const certDir = require('path').dirname(keyPath);
            console.log('The cert is generated at', certDir);
            const isWin = /^win/.test(process.platform);
            if (isWin) {
                exec('start .', { cwd: certDir });
            } else {
                exec('open .', { cwd: certDir });
            }
        } else {
            console.error('error when generating rootCA', error);
        }
    });
}

const options = {
    port: 8001,
    rule: require('./rule'),
    webInterface: {
        enable: true,
        webPort: 8002
    },
    // throttle: 1024000,
    forceProxyHttps: true,
    wsIntercept: false, // 开启websocket代理
    dangerouslyIgnoreUnauthorized: false,
    silent: false
};
const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on('ready', () => {
    logger.info('');
    logger.info('---- ---- ---- ---- ---- ----');
    logger.info('| 代理服务器启动完成');
    logger.info('---- ---- ---- ---- ---- ----');
});
proxyServer.on('error', (e) => {
    logger.error('');
    logger.error('---- ---- ---- ---- ---- ----');
    logger.error('| proxyServer error:%s', e.toString());
    logger.error('---- ---- ---- ---- ---- ----');
});

proxyServer.start();

//when finished
// proxyServer.close();