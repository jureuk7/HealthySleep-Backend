import mongoose, { Schema } from 'mongoose';

const SleepDataSchema = new Schema({
    username: String,
    sleepDate: String,
    startSleep: {
        type:Date,
        default: null
    },
    finishSleep: {
        type:Date,
        default:null
    }
});

const SleepData = mongoose.model('SleepData', SleepDataSchema);
export default SleepData;
