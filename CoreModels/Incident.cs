using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CoreModels
{
    public class Incident
    {
        public Incident()
        {
            Journals = new List<Journal>();
            Preparednesses = new List<Preparedness>();
            Loggers = new List<Logger>();
        }

        public int ID { get; set; }
       
        public string Address { get; set; }
        
        public string Number { get; set; }
        
        public string PostNr { get; set; }
        
        public string City { get; set; }
        
        public string Description { get; set; }
        
        public string Status { get; set; }
        
        public List<Journal> Journals { get; set; }
        
        public List<Preparedness> Preparednesses { get; set; }
        
        public DateTimeOffset CreationTime { get; set; }
        
        public List<Logger> Loggers { get; set; }
    }
}
