//이미지 업로드까지 마무리가 되었으니 이제 팔로잉 기능과 해시태그 검색 기능만 추가하면 됩니다. 

const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router(); 

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            await user.addFollowing(parseInt((req.params.id, 10)));
            res.send('success');
        } else {
            res.status(404).send('no user'); 
        }
    } catch (error) {
        console.error(error); 
        next(error); 
    }
});

module.exports = router; 