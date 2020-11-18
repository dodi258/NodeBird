const User = require('../models/user');

// 이처럼 async  함수이면 부를 때 await 을 붙여야 실행이 완료? 됨. 
// await user.addFollowing ()  --> 이런 식으로 
exports.addFollowing = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id }
        });

        if (user) {
            await user.addFollowing(parseInt (req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error); 
    }
};