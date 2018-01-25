using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreModels
{
    public class VehicleType
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public List<Vehicle> Vehicles { get; set; }

    }
}
