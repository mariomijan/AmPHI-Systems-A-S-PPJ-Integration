using System;
using System.Collections.Generic;

namespace CoreModels
{
    public class Preparedness
    {

        public Preparedness()
        {
            Loggers = new List<Logger>();
        }
        public int ID { get; set; }
        public Vehicle Vehicle { get; set; }
        public Incident Incident { get; set; }
        public EmergencyCode EmergencyCode { get; set; }
        public DateTimeOffset CreationTime { get; set; }
        public List<Logger> Loggers { get; set; }
        public string Status { get; set; }
    }
}
