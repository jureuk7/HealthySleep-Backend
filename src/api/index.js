import Router from "koa-router";
import auth from "./auth";
import data from "./sleepData"

const api = new Router();
api.use("/auth", auth.routes());
api.use("/sleepData", data.routes());

//라우터 내보내기
export default api;
