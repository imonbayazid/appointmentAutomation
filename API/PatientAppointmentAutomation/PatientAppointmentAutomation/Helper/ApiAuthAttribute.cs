using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
namespace PatientAppointmentAutomation.Helper
{
    [AttributeUsageAttribute(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class ApiAuthAttribute : AuthorizeAttribute
    {
        public string message { get; set; }

        protected override bool AuthorizeCore(HttpContextBase actionContext)
        {
            // -- Check Authentication 

            return true;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext ctx)
        {
            ctx.Result = new RedirectToRouteResult(
                            new RouteValueDictionary
                            {
                                { "action", this.message },
                                { "controller", "Home" }
                            });
        }
    }
}