const AV = require('leancloud-storage');

AV.init({
    appId: process.env.lc_app_id,
    appKey: process.env.lc_app_key
});

module.exports = function* () {
    const Article = AV.Object.extend('Article');

    const article = new Article();
    article.set('title', '测试');
    article.set('url', 'http://www.google.com');
    article.set('tags', 'google,test');

    return yield article.save();
    /*
    .then(function (todo) {
        // 成功保存之后，执行其他逻辑.
        console.log('New object created with objectId: ' + article.id);
    }, function (error) {
        // 异常处理
        console.error('Failed to create new object, with error message: ' + error.message);
    });
    */
    
}

