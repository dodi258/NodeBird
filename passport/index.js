const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id); 
    }); 
    
    passport.deserializeUser((id, done) => {
        User.findOne({ 
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Fllowers',
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Fllowings',
            }],
        })
            .then(user => done(null, user))
            .catch(err => done(err))
    });

    local(passport);
    kakao(passport); 
};

/**
 * <로그인 할 때>
 * 1. 로그인 요청이 들어옵니다. 
 * 2. passport.authenticate 메서드를 호출 합니다. 
 * 3. 로그인 전략을 수행합니다. (local vs kako)
 * 4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
 * 5. req.login 메서드가 passport.serializeUser 호출 합니다. - 세션 아이디 생성 
 * 6. req.session에 사용자 아이디만 저장 - deserialize가 세션에 저장한 아이디를 통해서 사용자 정보 객체를 불러옴. 
 * 7. 로그인을 완료 
 */

 /**
  * <로그인을 한 후에>
  * 1. 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드를 호출
  * 2. req.session 에 저장된 아이디로 데이터베이스에서 사용자 조회
  * 3. 조회된 사용자 정보를 req.user 에 저장
  * 4. 라우터에서 req.user 객체 사용 가능
  */