const express = require('express');
const router = express.Router(); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 

// METHOD: get ***** URL: /profile
// 로그인 한 사람만 접근이 가능하다. 
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird', user: null });
});

// METHOD: get ***** URL: /join
// 로그인 하지 않은 사람만 가능하다. 
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeBird',
        user: null, 
        joinError: req.flash('joinError'),
    });
});

// METHOD: get ***** URL: /
// 
router.get('/', (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
        user: null,
        loginError: req.flash('loginError'),
    });
});

module.exports = router; 