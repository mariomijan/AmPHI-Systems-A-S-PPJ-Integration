using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreModels
{
    public class Reception
    {
        public int ID { get; set; }
        public int Code { get; set; }
        public string Name { get; set; }
        public List<Journal> Journals { get; set; }
    }
}
