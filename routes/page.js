const express = require('express');
const { Post, User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 

const router = express.Router(); 
// METHOD: get ***** URL: /profile
// 로그인 한 사람만 접근이 가능하다. 
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
});

// METHOD: get ***** URL: /join
// 로그인 하지 않은 사람만 가능하다. 
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeBird',
        user: req.user, 
        joinError: req.flash('joinError'),
    });
});

// METHOD: get ***** URL: /
// 
router.get('/', (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
        user: req.user,
        loginError: req.flash('loginError'),
    });
});

router.get('/', (req, res, next) => {
    Post.findAll({
        include: {
            model: User,
            attributes: ['id', 'nick'],
        },
        order: [['createdAt', 'DESC']],
    })
    .then((posts) => {
            res.render('main', {
                title: 'NodeBird',
                twits: posts,
                user: req.user,
                loginError: req.flash('loginError'),
            });
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
})

module.exports = router; 