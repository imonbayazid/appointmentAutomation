using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PatientAppointmentAutomation.Helper
{
    public class Constants
    {
        public static string INFOBIP_AUTHORIZATION_KEY = "Basic bW5oaW5mbzppbXMyMDE3";
        public static string SENDING_SMS_URL = "https://api.infobip.com/sms/1/text/single";
        public static string RECEVING_SMS_URL = "https://api.infobip.com/sms/1/inbox/reports?limit=";
        public static string SENT_SMS_STATUS_URL = "https://api.infobip.com/sms/1/logs?messageId=";
        public static string RECEVING_SMS_LIMIT = "100";

    }
}