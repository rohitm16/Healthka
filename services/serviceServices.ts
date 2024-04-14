import { Service } from "../class/serviceClass";
import { ServiceRepo } from "../repo/serviceRepo";

export class ServiceServices {
  repo: ServiceRepo;

  constructor() {
    this.repo = new ServiceRepo();
  }
  async CreateService(
    data: Service,
    data2: { doctor_id: string },
    data3: { clinic_id: string }
  ) {
    try {
      //will get the doctor id from cookie and the active status from mongo or cookie **
      const createNewService = new Promise((resolve, reject) => {
        this.repo.CreateService(data, data2, data3, (response: any) => {
          if (response.apiSuccess === 1) {
            return resolve(response);
          }
          return reject(response);
        });
      });
      return createNewService;
    } catch (error: any) {
      throw new Error(`Database connection error ${error.message} `);
    }
  }

  async UpdateService(data: Service) {
    try {
      const updateService = new Promise((resolve, reject) => {
        this.repo.UpdateServices(data, (response: any) => {
          if (response.apiSuccess === 1) {
            return resolve(response);
          }
          return reject(response);
        });
      });
      return updateService;
    } catch (error: any) {
      throw new Error(`Database connection error ${error.message} `);
    }
  }
  async GetServices(data: string, data2: string) {
    try {
      const getServices = new Promise((resolve, reject) => {
        this.repo.GetServices(data, data2, (response: any) => {
          if (response.apiSuccess === 1) {
            return resolve(response);
          }
          return reject(response);
        });
      });
      return getServices;
    } catch (error: any) {
      throw new Error(`Database connection error ${error.message} `);
    }
  }
  async DeleteService(data: Number) {
    try {
      const deleteServices = new Promise((resolve, reject) => {
        this.repo.DeleteService(data, (response: any) => {
          if (response.apiSuccess === 1) {
            return resolve(response);
          }
          return reject(response);
        });
      });
      return deleteServices;
    } catch (error: any) {
      throw new Error(`Database connection error ${error.message} `);
    }
  }
}
