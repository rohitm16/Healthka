import { Receptionist_profile } from "../class/receptionistClass";
import mysqlPool from "../config/mysqlConfig";
// import mysql_pool from "../config/mysqlConfig";


export class ReceptionistRepo{
    async CreateReceptionistProfile(data:Receptionist_profile,callBack:any){
        const query = `INSERT INTO receptionist(receptionist_id,receptionist_name,phone_number,gender,age,dob,admin_id) VALUES (?,?,?,?,?,?,?)`;

        try {
            const value = [data.receptionist_id,data.admin_id,data.age,data.dob,data.gender,data.phone_number,data.receptionist_name];
            mysqlPool.query(query,value,(error,result)=>{
                if(error){
                    return callBack({
                        apiSuccess: 0,
                        resSuccess: 0,
                        error: error,
                        message: error.sqlMessage,

                    })
                }
                if(result){
                    return callBack({
                        apiSuccess: 1,
                        resSuccess: 1,
                        result: result,
                        message: result.sqlMessage,
                    })
                }
            })
        } catch (error:any) {
            throw new Error(error.message)
        }

    }
   
}