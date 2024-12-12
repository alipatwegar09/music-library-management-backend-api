import { Statuscode} from "./constants.js";

export const JsonGenerate = (Statuscode,message,data)=>{
    return { status: Statuscode, data: data!=null?data:null, message:message,error:null}
}