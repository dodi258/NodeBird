const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');
const db = require('../models');

const router = express.Router(); 

try {
    fs.readdirSync('public');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 파일을 생성합니다. ');
    fs.mkdirSync('uploads');
}

//upload 1
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'public/img');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 100 * 1024 * 1024 },
});

//img 파일 안에 올릴 때 - view/main.html --> 에서 호출합니당. 
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
});

//로그인 했는지 보고, post 와 hashtag 데이터 베이스 안에 넣을 때  
const upload2 = multer(); 

// --- 처음에 버튼 누르면 여길로 들어와서 db가 업뎃됩니다잉 - 
router.post('/', isLoggedIn, upload2.none(), async(req, res, next) => {
    try{
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            //데베에 있는 post 자체에 지금 tag 넣는 중. 
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router; 