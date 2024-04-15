import mysqlPool from "../config/mysqlConfig";
import { Receptionist_profile } from "../class/receptionistClass";

export class ReceptionistRepo {
  createReceptionistProfile(data: Receptionist_profile, callback: Function) {
    const query = `INSERT INTO receptionist (receptionist_id, receptionist_name, phone_number, gender, age, dob, admin_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      data.receptionist_id,
      data.receptionist_name,
      data.phone_number,
      data.gender,
      data.age,
      data.dob,
      data.admin_id,
    ];

    mysqlPool.query(query, values, (error, result) => {
      if (error) {
        callback({
          apiSuccess: 0,
          error: error,
          message: error.sqlMessage,
        });
      } else {
        callback({
          apiSuccess: 1,
          result: result,
        });
      }
    });
  }
}
