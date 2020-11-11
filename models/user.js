module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: true, 
            unique: true,
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        snsID: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        // 테이블 옵션 
        timestamps: true,
        paranoid: true,
    })
);

/**
 * 사용자 정보를 저장하는 모델입니다. 
 * 이메일, 닉네임, 비밀번호를 저장하고 SNS 로그인을 하였을 경우에는 provider 와 snsID를 저장합니다. 
 * 예) 카카오 로그인 - provider === kakao, 로컬 로그인 - provider === local
 */