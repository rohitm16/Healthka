import { Response, response } from "express";
import {Receptionist_profile} from "../class/receptionistClass"
import { ReceptionistRepo } from "../repo/receptionistRepo";
import { reject } from "bluebird";
import { resolve } from "path";

class receptionist_profile_services{
    repo: ReceptionistRepo;

    constructor(){
        this.repo = new ReceptionistRepo();
    }

    async CreateReceptionistProfile(
        data:Receptionist_profile
    ){
        try {
            // data.receptionist_id = JSON.stringify(receptionist_id)

            const createReceptionist = await new Promise((resolve,reject)=>{
                this.repo.CreateReceptionistProfile(data, (response :any)=>{
                    if(response.apiSuccess === 1){
                        // response.status(200).json("Registered Successfully")
                        return resolve(response)

                        // console.log(response) 
                    }
                    else{
                        return reject(response)
                    }
                })
            })
            return createReceptionist;
        } catch (error) {
            console.error("Error creating receptionist profile", error);

            
        }
    }
}


export default receptionist_profile_services;