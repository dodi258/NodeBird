const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config(); 

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const { sequelize } = require('./models'); 
const passportConfig = require('./passport');

const app = express(); 
sequelize.sync(); //db 모델과 서버를 연결합니다. 
passportConfig(passport); 


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 
app.set('port', process.env.PORT || 8001);


app.use(morgan('dev')); //log 이쁘게 해주는 것. 
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 위치 설정
app.use('/img', express.static(path.join(__dirname, 'uploads'))); 
app.use(express.json()); // 왜? 
app.use(express.urlencoded({ extended: false })); // 왜
app.use(cookieParser(process.env.COOKIE_SECRET)); // 동봉된 쿠키를 해석해줍니다. 
app.use(session({ //세션 관리용 미들웨어, 로그인 등의 이유로 세션을 구현할 때 매우 유용. 
    resave: false, 
    saveUninitialized: false, 
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false, 
    },
}));

app.use(flash()); // connect flash == 일회성 메세지들을 웹 브라우저에 나타낼 때 쓰는 것. - 별로 중요하지는 않음. 
// 로그인을 위함, 쿠키, 세션등을 직접 처리하기 보다는 검증된 모듈을 사용하여서 편리하게 사용이 가능하다.
//구글, 페이스북, 카카오톡과 같은 기존의 SNS 서비스 계정으로 로그인하기도 합니다. 이또한 passport 를 사용해서 해결할 수 있습니다. 
app.use(passport.initialize());
app.use(passport.session());

// router 주소
app.use('/', pageRouter);
app.use('/auth', authRouter); 
app.use('/post', postRouter); 
app.use('/user', userRouter);

// 직접 미들웨어를 정의할 때  
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404; 
    next(err);
    /**
     * err = {
     *   status: 404, 
     *   message ?  : Not Found
     * }
     */
});

// 다음번 미들웨어에 err 가 넘겨짐. 
app.use((err, req, res, next) => {
    res.locals.message = err.message; 
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

/**
 * <<response 할때 사용할 수 있는 함수 >> 
 * res.send(버퍼 또는 문자열 또는 HTML 또는 JSON)
 * res.sendFile(파일 경로)
 * res.json(JSON 데이터)
 * res.redirect(주소) - 예시 res.redirect(메인 화면 주소)
 * res.render('템플릿 파일 경로', {변수}) 
 * res.status(404).send('Not Found');
 */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
})

