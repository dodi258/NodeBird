const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const { User } = require('../models');

const router = express.Router(); 
//join : 
// 1. 같은 메일로 가입한 사람이 있으면, 안됨
// 2. 같은 메일로 가입한 사람 없으면, 비밀번호 암호화한 후, 사용자 정보 생성한다. 
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body; 

    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일 입니다.');
            return res.redirect('/join'); 
        }
        // 만약 같은 이메일로 가입되어있지 않다면, ! 비번 암호화해서, 유저 정보 새로 저장합니다. 
        const hash = await bcrypt.hash(password, 12); 
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error); 
    }
});

// login:
// 1. 
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError); 
            return next(authError); 
        }

        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
})
// logout
// req.logout 메서드는 req.user 객체를 제거하고, req.session.destory는 req.session 객체의 내용을 제거한다. 

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(); 
    req.session.destroy();
    res.redirect('/');
});
module.exports = router; 