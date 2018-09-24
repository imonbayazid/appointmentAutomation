using System.Net.Http;
using System.Web.Http;
using DataBooster.DbWebApi;
using Newtonsoft.Json;
using PatientAppointmentAutomation.Helper;

namespace PatientAppointmentAutomation.Controllers
{
    public class DbWebApiController : ApiController
    {
        // http://localhost:50406/Output.Rpt_GrowthTrend/json?intprd=%5bProduct%5d.%5bInternational%20Product%5d.%5bJANUVIA%5d 


        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public DbWebApiController()
        {
        }

        /// <param name="sp">Stored Procedure's fully qualified name</param>
        /// <param name="allParameters">Auto-binding from the request body</param>
        [AcceptVerbs("GET", "POST", "PUT", "DELETE")]
        [ApiAuth]
        public HttpResponseMessage DynExecute(string sp, InputParameters allParameters)
        {
            allParameters = InputParameters.SupplementFromQueryString(allParameters, Request);  // Supplement input parameters from URI query string.

            //SetUserName(allParameters);                         // Set the conventional User Name Parameter if configured.

            logger.Info("SP:" + sp);
            logger.Info("PARAMS:" + JsonConvert.SerializeObject(allParameters.Parameters));

            return this.DynExecuteDbApi(sp, allParameters);     // The main entry point to call the DbWebApi.
        }
    }
}