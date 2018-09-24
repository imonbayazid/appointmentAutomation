using DataBooster.DbWebApi;
using System.Web.Http;
using System.Linq;
using System.Net.Http.Headers;
using System.Web.Http;
using DataBooster.DbWebApi;
namespace PatientAppointmentAutomation
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/octet-stream"));
            config.Routes.MapHttpRoute(
                name: "DbWebApi",
                routeTemplate: "{sp}/{ext}",
                defaults: new
                {
                    controller = "DbWebApi",
                    action = "DynExecute",
                    ext = RouteParameter.Optional

                },
                constraints: new { ext = @"|json|bson|xml|csv|xlsx|jsonp|razor|docx|pdf" }
            );

            /* config.Routes.MapHttpRoute(
                 name: "MiscApi",
                 routeTemplate: "api/{controller}/{action}"
             ); */

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.RegisterDbWebApi();
        }
    }
}
