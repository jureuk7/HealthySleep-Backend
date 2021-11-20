import Joi from 'joi';
import User from '../../models/user';

/*
    POST /api/auth/register
    {
        username: 'id',
        password: 'pw'
    }
*/

export const register = async ctx => {
    //Request Body check
    const schema = Joi.object().keys({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        password: Joi.string().required(),
    });
    const result = schema.validate(ctx.request.body);
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const {username, password} = ctx.request.body;
    try {
        const exists = await User.findByUsername(username);
        if(exists) {
            ctx.status = 409 // Conflict
            return;
        }

        const user = new User({
            username,
        });
        await user.setPassword(password);
        await user.save();

        ctx.body = user.serialize(); // hashedPassword제거

        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000*60*60*24*7,
            httpOnly: true,
        });
    } catch(e) {
        ctx.throw(500,e);
    }
};

export const login = async ctx => {
    const {username, password} = ctx.request.body;

    // username, password 있는지 확인 후 에러처리
    if(!username || !password) {
        ctx.status = 401; // Unauthorized
        return;
    }

    try {
        const user = await User.findByUsername(username);
        //계정 존재 확인
        if(!user) {
            ctx.status = 401 //same code Unauthorized
            return;
        }
        const valid = await user.checkPassword(password);
        // 잘못된 비밀번호
        if(!valid) {
            ctx.status = 401 //Unauthorized
            return;
        }
        ctx.body = user.serialize();
        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000*60*60*24*7,
            httpOnly: true,
        });
    } catch(e) {
        ctx.throw(500,e);
    }
}

export const check = async ctx => {
    const { user} =ctx.state;
    if(!user) {
        //로그인 중 아님
        ctx.status = 401;
        return;
    }
    ctx.body = user;
};

export const logout = async ctx => {
    ctx.cookies.set('access_token');
    ctx.status = 204; // No Content
};