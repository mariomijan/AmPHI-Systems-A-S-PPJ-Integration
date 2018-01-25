using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CoreModels
{
    public class Journal
    {
        
        public int ID { get; set; }
        public string Cpr { get; set; }
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string Lastname { get; set; }
        public string Info { get; set; }
        public Incident Incident { get; set; }
        public Reception Reception { get; set; }
        public DateTimeOffset CreationTime { get;  set; }
        public List<Logger> Loggers { get; set; }
        public string Status { get; set; }

    }
}
