import Router from 'koa-router';
import * as sleepDataCtrl from './sleepData.ctrl';

const sleepData = new Router();

sleepData.post('/init',sleepDataCtrl.init);
sleepData.post('/setStartSleep',sleepDataCtrl.setStartSleep);
sleepData.post('/setFinishSleep',sleepDataCtrl.setFinishSleep);
sleepData.get('/exists',sleepDataCtrl.isExists);
sleepData.get('/read',sleepDataCtrl.read)
sleepData.get('/readWeekend',sleepDataCtrl.readWeekend);

export default sleepData;