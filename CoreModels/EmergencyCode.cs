using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreModels
{
    public class EmergencyCode
    {
        public EmergencyCode()
        {
            Preparednesses = new List<Preparedness>();
        }
        public int ID { get; set; }
        public string Code { get; set; }
        public List<Preparedness> Preparednesses { get; set; }
    }
}
