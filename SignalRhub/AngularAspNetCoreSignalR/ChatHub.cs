using Microsoft.AspNetCore.SignalR;

namespace AngularAspNetCoreSignalR
{
    public class ChatHub : Hub
    {
        public void SendToAll(string name, string message)
        {
            Clients.All.InvokeAsync("sendToAll", name, message);
        }

        public void SendPatientToDoctor(string patientID)
        {
            Clients.All.InvokeAsync("rcvrFnSendPatientToDoctor", patientID);
        }

        public void UpdateAppointmentData()
        {
            Clients.All.InvokeAsync("rcvrFnWhenAppoinmentUpdated", true);
        }

        public void AddPatient()
        {
            Clients.All.InvokeAsync("rcvrFnWhenPatientAdded", true);
        }
        public void AddReport()
        {
            Clients.All.InvokeAsync("rcvrFnWhenReportAdded", true);
        }

    }
}