export const typeDefs = `#graphql
type DoctorProfile {
  doctor_id: String!
  first_name: String!
  last_name: String!
  DOB: String!
  gender: String!
  phone_number: String!
  email: String!
  qualification: String!
  # specialization: String!
  personal_clinic: Boolean!
    clinic_profile: [ClinicProfileResponse!]
}

type ClinicProfile {
  id: String
  timing: String
  working_days: [String]
}

    type ClinicProfileResponse{
      apiSuccess: Int
      resSuccess: Int
      result: [ClinicProfile]  
      message: String
    }
    
    type DoctorProfileResponse {
      apiSuccess: Int
      resSuccess: Int
      result: [DoctorProfile!]!  
      message: String
    }
    type Query {
  getDoctorById(doctor_Id: String!): DoctorProfileResponse   
  clinic_profile:(doctor_Id: String!): [ClinicProfileResponse]
}

`;

// const server = new ApolloServer({
//   typeDefs,
//   resolvers: {
//     Query: {
//       getDoctorById: (parent, doctor_Id) => {
//         return service.GetDoctorDataById(doctor_Id.doctor_Id);
//       },
//       clinic_profile: (_, parent) => {
//         return service.GetClinicDoctor(parent.doctor_id);
//       },
//     },
//     // DoctorProfile: {
//     //   clinic_profile: (parent) => {
//     //     try {
//     //       console.log(parent.doctor_id);
//     //       const clinicProfiles = service.GetClinicDoctor(parent.doctor_id);
//     //       return clinicProfiles || []; // Ensure to return an empty array if no clinic profiles are found
//     //     } catch (error) {
//     //       console.error("Error fetching clinic profiles:", error);
//     //       return []; // Return an empty array in case of an error
//     //     }
//     //   },
//     // },
//   },
// });

// (async () => {
//   await server.start(); // Start the Apollo Server
// app.use("/graphql", expressMiddleware(server)); // Apply expressMiddleware
