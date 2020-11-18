
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 

// test 할 때는 Mock 객체를 따로 만들어야 함. 
// req, res, next 모두 !!! 

// describe, test, expect 이런것들은 어디서 ...자동으로 불러와지는 것일까..
// 1. describe: describe(첫번째 인자: 설명, 두번째 인자: 그룹에 대한 내용.)

describe('isLoggedIn', () => {
    
    //------- MOCK ------/
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };

    const next = jest.fn(); 

     //-------------------/

    test('로그인 되어있으면 isLoggedIn이 next를 호출해야함.', () => {
        // 이것도 MOCK
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        isLoggedIn(req, res, next); 
        expect(next).toBeCalledTimes(1); 
    }); 

    test('로그인 되어있지 않으면 isLoggedIn이 에러를 응답해야함.', () => {
        // 이것도 MOCK
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요'); 
    });
}); 


describe('isNotLoggedIn', () => {

    //------- MOCK ------/
    const res = {
        redirect: jest.fn(),
    };
    const next = jest.fn(); 

     //-------------------/

    test('로그인 되어있으면 isNotLoggedIn이 에러를 호출해야함.', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        // 실제 호출해 보기 ! 
        isNotLoggedIn(req, res, next); 
        const message = encodeURIComponent('로그인한 상태입니다.');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    }); 

    test('로그인 되어있지 않으면 isNotLoggedIn이 next를 응답해야함.', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isNotLoggedIn(req, res, next); 
        expect(next).toBeCalledTimes(1);
    });
}); 
