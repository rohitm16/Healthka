import { Service } from "../class/serviceClass";
import mysql_pool from "../config/mysqlConfig";

export class ServiceRepo {
  async CreateService(
    data: Service,
    data2: { doctor_id: string },
    data3: { clinic_id: string },
    callBack: any
  ) {
    const query = `INSERT INTO services(doctor_id, clinic_id, service_name, service_charges) VALUES (?, ?, ?, ?)`;

    console.log(data2);
    console.log(data3);

    try {
      const values = [data2, data3, data.service_name, data.service_charges];
      mysql_pool.query(query, values, (error, result) => {
        if (error) {
          return callBack({
            apiSuccess: 0,
            resSuccess: 0,
            error: error,
            message: error.sqlMessage,
          });
        }
        if (result) {
          return callBack({
            apiSuccess: 1,
            resSuccess: 1,
            message: "Data added successfully",
            result: result,
          });
        }
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async UpdateServices(data: Service, callBack: any) {
    const query = `UPDATE services
    SET service_name = ?, service_charges = ?
    WHERE doctor_id = ? AND clinic_id = ?`;
    const Values = [
      data.service_name, // Update value for service_name
      data.service_charges, // Update value for service_charges
      // Where clause value for clinic_id
    ];

    try {
      mysql_pool.query(query, Values, (error, result) => {
        if (error) {
          return callBack({
            apiSuccess: 0,
            resSuccess: 0,
            error: error,
            message: error.sqlMessage,
          });
        }
        if (result.affectedRows === 0) {
          return callBack({
            apiSuccess: 1,
            resSuccess: 0,
            message: "unable to update",
            result: result,
          });
        }
        if (result) {
          return callBack({
            apiSuccess: 1,
            resSuccess: 1,
            message: "Data updated successfully",
            result: result,
          });
        }
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async GetServices(data: string, data2: string, callBack: any) {
    const query = `SELECT service_name, service_charges, service_id FROM services WHERE doctor_id=? AND clinic_id=?`;
    try {
      mysql_pool.query(query, [data, data2], (error, result) => {
        if (error) {
          return callBack({
            apiSuccess: 0,
            resSuccess: 0,
            error: error,
            message: error.sqlMessage,
          });
        }
        console.log("====================================");
        console.log(data, data2);
        console.log("====================================");
        if (result.length === 0) {
          return callBack({
            apiSuccess: 1,
            resSuccess: 0,
            message: "No data found",
            result: result,
          });
        } else {
          return callBack({
            apiSuccess: 1,
            resSuccess: 1,
            message: "Data retrieved successfully",
            result: result,
          });
        }
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async DeleteService(data: Number, callBack: any) {
    const query = `DELETE FROM services WHERE service_id = ?`;
    try {
      mysql_pool.query(query, [data], (error, result) => {
        if (error) {
          return callBack({
            apiSuccess: 0,
            resSuccess: 0,
            error: error,
            message: error.sqlMessage,
          });
        }
        return callBack({
          apiSuccess: 1,
          resSuccess: 1,
          message: "Service deleted successfully",
          result: result,
        });
      });
    } catch (error: any) {
      console.error("Error deleting service:", error);
      return callBack({
        apiSuccess: 0,
        resSuccess: 0,
        message: "An error occurred while deleting service",
        error: error.message,
      });
    }
  }
}
