using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreModels
{
    public class Logger
    {
        public int ID { get; set; }
        public DateTimeOffset Time { get; set; }
        public Incident Incident { get; set; }
        public Journal Journal { get; set; }
        public Preparedness Preparedness { get; set; }
        public string LogMessage { get; set; }
        public ErrorHandling Success { get; set; }
    }
}
