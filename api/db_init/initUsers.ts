/* eslint-disable @typescript-eslint/no-explicit-any */
// import { DynamoDB ,PutItemInput,ScanInput } from "@aws-sdk/client-dynamodb";
// const region = "us-west-2";
// const client = new DynamoDB({
//   region: "us-east-1",
//   endpoint: "http://localhost:8000",
//   credentials: { accessKeyId: "ASDFASDFASDFA", secretAccessKey: "ASDFASDFASDFA" },
// });
// const user1 : PutItemInput = {
//   TableName : "Users",
//   Item: {
//     userId: { S: "2" },
//     fbId :  { S: "fbId1" },
//     nick :  { S: "Tavo" },
//     fbData : { M : {
//       name : { S: "JuanFb" },
//       lastN : { S: "AppellidoFb" },
//       email: { S: "emailFB" }
//       //otros campos a definir segun lo que facebook provea
//     }},
//     gooData : { M : {
//       name : { S: "JuanGoogle" },
//       lastN : { S: "AppellidoGoogle" },
//       email: { S: "emailGoogle" }
//       //otros campos a definir segun lo que google provea
//     }},
//     planId: { S: "planId1" },
//     config : { M : {
//       language : { S: "es" },
//       dateFormat : { S: "YYYY-MM-DD" },
//       hourFormat: { S: "MM:NN:SS" },
//       evtDur : { N : "300" }, //En minutos
//       notifAlert : { BOOL : false }, 
//       notifEmail : { BOOL : false }, 
//       notifSound : { BOOL : false }, 
//       showWeekEnd : { BOOL : false }, 
//       showRejected : { BOOL : false }, 
//       weekStarts : { S : "SU" } //MO:Lunes, SU: Domingo, SA: Sabado
//     }},
//   }
// };

// const user2 : PutItemInput = {
//   TableName : "Users",
//   Item: {
//     userId: { S: "3" },
//     fbId :  { S: "fbId1" },
//     nick :  { S: "ElOgro" },
//     fbData : { M : {
//       name : { S: "JuanFb" },
//       lastN : { S: "AppellidoFb" },
//       email: { S: "emailFB" }
//       //otros campos a definir segun lo que facebook provea
//     }},
//     gooData : { M : {
//       name : { S: "JuanGoogle" },
//       lastN : { S: "AppellidoGoogle" },
//       email: { S: "emailGoogle" }
//       //otros campos a definir segun lo que google provea
//     }},
//     planId: { S: "planId1" },
//     config : { M : {
//       language : { S: "es" },
//       dateFormat : { S: "YYYY-MM-DD" },
//       hourFormat: { S: "MM:NN:SS" },
//       evtDur : { N : "300" }, //En minutos
//       notifAlert : { BOOL : false }, 
//       notifEmail : { BOOL : false }, 
//       notifSound : { BOOL : false }, 
//       showWeekEnd : { BOOL : false }, 
//       showRejected : { BOOL : false }, 
//       weekStarts : { S : "SU" } //MO:Lunes, SU: Domingo, SA: Sabado
//     }},
//   }
// };

// client.putItem(user1 , (err: any, data: any) => {
//   console.log(err);
//   console.log(data);
// });
  
// client.putItem(user2 , (err: any, data: any) => {
//   console.log(err);
//   console.log(data);
// });

// const query : ScanInput = { TableName : "Users"};

// client.scan(query, (err: any, data: any) => {
//   console.log(err);
//   console.log(data);
// });