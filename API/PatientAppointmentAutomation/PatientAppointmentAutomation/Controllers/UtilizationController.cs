using DataBooster.DbWebApi;
using DataBooster.DbWebApi.DataAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using RestSharp;
using Newtonsoft.Json.Linq;

namespace PatientAppointmentAutomation.Controllers
{
    [RoutePrefix("api/Utilization")]
    public class UtilizationController : ApiController
    {

        DateTime nowTime;
        public UtilizationController()
        {
            nowTime = DateTime.Now;
        }

        [HttpGet]
        [Route("testCall")]
        public void testMethod(String a,String b)
        {

        }

        /*[HttpGet]
        [Route("addPrescription")]
        public void addPrescriptionToDB(Int64 drID, Int64 patientID,
            String location="", String age="",
            String weight="", String height="", String pressure="",
            String history="", String prescription="", String report="", String nextVisit="")
        {

            DalCenter dlc2 = new DalCenter(this.Request.GetQueryStringDictionary());
            var dic = new Dictionary<string, object>();
            dic.Add("@drID", drID);
            dic.Add("@patientID", patientID);
            dic.Add("@location", location);
            dic.Add("@age", age);
            dic.Add("@weight", weight);
            dic.Add("@height", height);
            dic.Add("@pressure", pressure);
            dic.Add("@history", history);
            dic.Add("@prescription", prescription);
            dic.Add("@report", report);
            dic.Add("@nextVisit", nextVisit);
            try
            {
                InputParameters inparams = new InputParameters(dic);
                dlc2.ExecuteDbApi("AddPrescription", inparams.Parameters);
            }
            catch (Exception ex)
            {

            }
        }

        */

        [HttpGet]
        [Route("SendSMSToUser")]
        public IRestResponse SendSMSToUser(string destination,string msg)
        {
            string sender = "infobip";
            //var sender = "infobip";
            string[] destinations = new string[1]; 
            destinations[0] = destination;

            if (msg == String.Empty || destinations.Length < 1) return null;

            var client = new RestClient(Helper.Constants.SENDING_SMS_URL);

            var request = new RestRequest(Method.POST);
            request.AddHeader("accept", "application/json");
            request.AddHeader("content-type", "application/json");
            request.AddHeader("authorization", Helper.Constants.INFOBIP_AUTHORIZATION_KEY);

            var from = "{\"from\":\"" + sender + "\",";
            var to = " \"to\":[  \"";
            var message = "\"text\":\"" + msg + "\"}";

            foreach (string no in destinations)
            {
                if (destinations.Length < 2) to = to + no;
                else to = to + no + "\",\"";
            }
            to = to + "\"],";

            var body = from + to + message;

            request.AddParameter("application/json", body, ParameterType.RequestBody);

            IRestResponse response;
            try
            {
                response = client.Execute(request);
            }
            catch (Exception)
            {

                response = null;
            }

            return response;
        }


        /*RECEIVE SMS*/
        // run every 5 min
        private bool isReceiveSMSLock = false;
        [HttpGet]
        [Route("receiveSMS")]
        public String receiveSMS()
        {
            if (isReceiveSMSLock == true) return "receiveSMS locked";
            isReceiveSMSLock = true;

            var client = new RestClient(Helper.Constants.RECEVING_SMS_URL + Helper.Constants.RECEVING_SMS_LIMIT);

            var request = new RestRequest(Method.GET);
            request.AddHeader("accept", "application/json");
            request.AddHeader("authorization", Helper.Constants.INFOBIP_AUTHORIZATION_KEY);

            IRestResponse serverResponse = client.Execute(request);

            // String k = "{ \"results\": [ { \"messageId\": \"817790313235066447\", \"from\": \"385916242493\", \"to\": \"385921004026\", \"text\": \"QUIZ Correct answer is Paris UPDATED\", \"cleanText\": \"Correct answer is Paris\", \"keyword\": \"QUIZ\", \"receivedAt\": \"2016-10-06T09:28:39.220+0000\", \"smsCount\": 1, \"price\": { \"pricePerMessage\": 0, \"currency\": \"EUR\" }, \"callbackData\": \"callbackData\" }, { \"messageId\": \"8177903132350664472\", \"from\": \"756767686\", \"to\": \"98989080800\", \"text\": \"QUIZ Correct answer is Paris2 UPDATED\", \"cleanText\": \"Correct answer is Paris2\", \"keyword\": \"QUIZ2\", \"receivedAt\": \"2016-10-06T09:28:39.220+0000\", \"smsCount\": 1, \"price\": { \"pricePerMessage\": 0, \"currency\": \"EUR\" }, \"callbackData\": \"callbackData\" } ], \"messageCount\": 1, \"pendingMessageCount\": 0 }";
            try
            {
                JObject resObj = JObject.Parse(serverResponse.Content);
                // JObject resObj = JObject.Parse(k);
                if (resObj != null)
                {
                    var receivedSMSCount = resObj["messageCount"];
                    var receivedSMS = resObj["results"];

                    if (receivedSMSCount != null && Int32.Parse(receivedSMSCount.ToString()) > 0 && receivedSMS != null)
                    {

                        var recvdmsgCount = receivedSMS.Count();
                        if (recvdmsgCount < 1) return "recvdmsgCount<1 from receiveSMS";
                        // loop through each received message 
                        for (int msgIndex = 0; msgIndex < recvdmsgCount; msgIndex++)
                        {
                            /*
                             *message format for booking appoinment
                             New SMS-> DrID PatientName new 
                             Old Patient-> DrID PatientID old
                             Report-> DrID PatientID report
                            */
                            ReceivedSMSresponseModel rcvdSmsModel = new ReceivedSMSresponseModel();
  
                            rcvdSmsModel.patientNumber = receivedSMS[msgIndex]["from"] != null ? receivedSMS[msgIndex]["from"].ToString() : "";
                            //rcvdSmsModel.serverNumber = receivedSMS[msgIndex]["to"] != null ? receivedSMS[msgIndex]["to"].ToString() : "";
                            // SMS from user mobile 
                            rcvdSmsModel.patientMessage = receivedSMS[msgIndex]["text"] != null ? receivedSMS[msgIndex]["text"].ToString().Trim() : "";
                           // rcvdSmsModel.messageReceivedAt = receivedSMS[msgIndex]["receivedAt"] != null ? receivedSMS[msgIndex]["receivedAt"].ToString() : "";

 
                            if (rcvdSmsModel.patientMessage.Contains(' '))
                            {
                                String[] msgTextArr = receivedSMS[msgIndex]["text"] != null ? receivedSMS[msgIndex]["text"].ToString().Split(' ') : null;
                                if (msgTextArr != null && msgTextArr.Length==3)
                                {
                                    var drID = msgTextArr[0].Trim();
                                    var patientType =msgTextArr[2].Trim();
                                    rcvdSmsModel.drID = Int64.Parse(drID);
                                    if (patientType.ToLower() == "new") {
                                        rcvdSmsModel.patientType = "patient";
                                        rcvdSmsModel.patientName= msgTextArr[1].Trim();
                                        // call add new patient
                                        if (rcvdSmsModel.drID > -1 && rcvdSmsModel.patientName != null && rcvdSmsModel.patientNumber != null)
                                            AddNewPatient(rcvdSmsModel.drID, rcvdSmsModel.patientName, rcvdSmsModel.patientNumber);
                                    }
                                    else if (patientType.ToLower() == "old") {
                                        rcvdSmsModel.patientType = "patient";
                                        var patientID = msgTextArr[2].Trim();
                                        rcvdSmsModel.patientID = Int64.Parse(patientID);
                                        //call add old patient
                                        if (rcvdSmsModel.drID > -1 && rcvdSmsModel.patientID >-1 && rcvdSmsModel.patientType != null)
                                            AddOldPatient(rcvdSmsModel.drID, rcvdSmsModel.patientID, rcvdSmsModel.patientType);
                                    }
                                    else if (patientType.ToLower() == "report")
                                    {
                                        rcvdSmsModel.patientType = "report";
                                        var patientID = msgTextArr[2].Trim();
                                        rcvdSmsModel.patientID = Int64.Parse(patientID);
                                        //call add report
                                        if (rcvdSmsModel.drID > -1 && rcvdSmsModel.patientID > -1 && rcvdSmsModel.patientType != null)
                                            AddOldPatient(rcvdSmsModel.drID, rcvdSmsModel.patientID, rcvdSmsModel.patientType);
                                    }


                                }

                            }

                        }//loop
                    }

                }
            }
            catch (Exception ex)
            {
                return "receiveSMS exception " + ex.ToString();
            }
            isReceiveSMSLock = false;

            return "receiveSMS call finished at " + nowTime.ToString();
        }



       public string AddNewPatient(Int64 drID, string patientName, string patientNumber)
        {
            string errorMsg = "";
            DalCenter dlc2 = new DalCenter(this.Request.GetQueryStringDictionary());
            var dic = new Dictionary<string, object>();
            dic.Add("@drID", drID);
            dic.Add("@patientName", patientName);
            dic.Add("@patientMobile", patientNumber);
            try
            {
                InputParameters inparams = new InputParameters(dic);
                dlc2.ExecuteDbApi("AddAppoinmentNewPatient", inparams.Parameters);
            }
            catch (Exception ex)
            {
                errorMsg = ex.ToString();
            }
            return errorMsg;

        }


        public string AddOldPatient(Int64 drID, Int64 patientID, string patientType)
        {

            string errorMsg = "";
            DalCenter dlc2 = new DalCenter(this.Request.GetQueryStringDictionary());
            var dic = new Dictionary<string, object>();
            dic.Add("@drID", drID);
            dic.Add("@patientID", patientID);
            dic.Add("@patientType", patientType);
            try
            {
                InputParameters inparams = new InputParameters(dic);
                dlc2.ExecuteDbApi("AddAppoinmentOldPatient", inparams.Parameters);
            }
            catch (Exception ex)
            {
                errorMsg = ex.ToString();
            }
            return errorMsg;
        }


    }


    public class ReceivedSMSresponseModel
    {
        public string messageId { get; set; }
        public string patientNumber { get; set; }
        public string patientName { get; set; }
        public string patientType { get; set; }
        public Int64 drID { get; set; }
        public Int64 patientID { get; set; }
        public string patientMessage { get; set; }
        //public string serverNumber { get; set; }
        //public string messageReceivedAt { get; set; }
        //public string smsCount { get; set; }
        // public string msgPrice { get; set; }
    }
}
