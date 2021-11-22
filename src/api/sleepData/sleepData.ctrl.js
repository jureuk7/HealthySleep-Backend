import SleepData from '../../models/sleepData';
/*
    POST /api/sleepData/init
    {
        username: 'username',
        date: 'YYYY-MM-DD'
    }
*/
export const init = async ctx => {
    const {username, sleepDate} = ctx.request.body;
    const sleepData = new SleepData({
        username,
        sleepDate,
    });
    try {
        await sleepData.save();
        ctx.body = sleepData;
    } catch (e) {
        ctx.throw(500, e);
    }
}, setStartSleep = async ctx => {
    const {username, sleepDate, startSleep} = ctx.request.body;
    if (!username || !sleepDate || !startSleep) {
        ctx.status = 400;
        return;
    }
    try {
        ctx.body = await SleepData.findOneAndUpdate({username, sleepDate}, {startSleep: startSleep}, {
            new: true,
        }).exec();
    } catch (e) {
        ctx.throw(500, e);
    }
}, setFinishSleep = async ctx => {
    const {username, sleepDate, finishSleep} = ctx.request.body;
    if (!username || !sleepDate || !finishSleep) {
        ctx.status = 400;
        return;
    }
    try {
        ctx.body = await SleepData.findOneAndUpdate({username, sleepDate}, {finishSleep: finishSleep}, {
            new: true,
        }).exec();
    } catch (e) {
        ctx.throw(500, e);
    }
},isExists = async ctx => {
    const {username,sleepDate} = ctx.request.query;
    if (!username || !sleepDate) {
        ctx.status = 400;
        return;
    }

    try {
        const sleepData = await SleepData.findOne({username, sleepDate});
        if (!sleepData) {
            ctx.body = { 'exists': false};
            return;
        }
        ctx.body = { 'exists': true};
    } catch (e) {
        ctx.throw(500, e);
    }
},read = async ctx=> {
    const {username,sleepDate} = ctx.request.query;
    if(!username || !sleepDate) {
        ctx.status = 400;
        return;
    }
    try {
        const sleepData = await SleepData.findOne({username,sleepDate});
        if(!sleepData) {
            ctx.status = 404;
            return;
        }
        ctx.body = sleepData;
    } catch (e) {
        ctx.throw(500,e);
    }
},readWeekend = async ctx => {
    const {username,sleepDate} = ctx.request.query;
    if(!username || !sleepDate) {
        ctx.status= 400;
        return;
    }
    const current = new Date(`${sleepDate},08:00:00`);
    const week = [];

    for (let i = 1; i <= 7; i++) {
        let first = current.getDate() - current.getDay() + i
        let day = new Date(current.setDate(first)).toISOString().slice(0, 10)
        week.push(day)
    }
    const weekend = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']

    try {
        const response = {};
        let avgData = [];
        for(let i=0;i<7;i++) {
            const sleepData = await SleepData.findOne({username,sleepDate:week[i]});
            if(!sleepData) {
                const newData = new SleepData({
                    username,
                    sleepDate: week[i],
                });
                await newData.save();
            }
            const sleepDataSecond = await SleepData.findOne({username,sleepDate:week[i]});
            let elapsed;
            if(sleepDataSecond.startSleep && sleepDataSecond.finishSleep) {
                let prevDate;
                {
                    const {year, month, day, hour, min} = sleepDataSecond.startSleep;
                    if(year && month && day && hour && min) {
                        prevDate = new Date(Number(year), Number(month), Number(day), Number(hour), Number(min));
                    }
                }
                let nextDate;
                {
                    const {year, month, day, hour, min} = sleepDataSecond.finishSleep;
                    if(year && month && day && hour && min) {
                        nextDate = new Date(Number(year), Number(month), Number(day), Number(hour), Number(min));
                    }
                }
                if(prevDate !== "1899-12-30T15:32:08.000Z" && nextDate !== "1899-12-30T15:32:08.000Z") {
                    const elapsedSec = nextDate.getTime() - prevDate.getTime();
                    const elapsedMin = elapsedSec / 1000 / 60;
                    console.log(sleepDataSecond.startSleep);
                    console.log(sleepDataSecond.finishSleep);
                    console.log(prevDate);
                    console.log(nextDate);
                    console.log(elapsedSec);
                    console.log(elapsedMin)
                    elapsed = {
                        hour: Math.floor(elapsedMin / 60),
                        min: elapsedMin % 60
                    }
                }
            }

            response[weekend[i]] = {
                startSleep: sleepDataSecond.startSleep,
                finishSleep: sleepDataSecond.finishSleep,
                elapsed: elapsed
            }
        }
        ctx.body = response;
    } catch (e) {
        ctx.throw(500,e);
    }
};
