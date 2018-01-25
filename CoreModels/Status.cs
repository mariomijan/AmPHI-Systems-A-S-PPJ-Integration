using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreModels
{
    public class Status
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Meaning { get; set; }
        public List<Vehicle> Vehicles { get; set; }
    }
}
