import mongoose, { Schema } from 'mongoose';

const SleepDataSchema = new Schema({
    username: String,
    sleepDate: String,
    startSleep: {
        year:{
            type:String,
            default:null
        },
        month:{
            type:String,
            default:null
        },
        day:{
            type:String,
            default:null
        },
        hour:{
            type:String,
            default:null
        },
        min:{
            type:String,
            default:null
        },
    },
    finishSleep: {
        year:{
            type:String,
            default:null
        },
        month:{
            type:String,
            default:null
        },
        day:{
            type:String,
            default:null
        },
        hour:{
            type:String,
         default:null
        },
        min:{
            type:String,
            default:null,
        },
    },
});

const SleepData = mongoose.model('SleepData', SleepDataSchema);
export default SleepData;
