
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreModels
{
    public class Vehicle
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public VehicleType VehicleType { get; set; }
        public Status Status { get; set; }

    }
}
