using CoreModels;
using Kontrolrum.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Kontrolrum.Controllers
{
    [Route("api/[controller]")]
    public class VehicleTypeController
    {
        private Context _context;
        public VehicleTypeController(DbContextOptions<Context> dbContext)
        {
            _context = new Context(dbContext);
        }

        [HttpGet("{id}")]
        public VehicleType GetVehicleType(int id)
        {
            var vehicleType = _context.VehicleTypes.FirstOrDefault(x => x.ID == id);
            return vehicleType;
        }

        [HttpGet]

        public IEnumerable<VehicleType> GetAllVehicleTypes()
        {
            try
            {
                var vehicleTypes = _context.VehicleTypes.ToList();
                return vehicleTypes;
            }
            catch (Exception)
            {
                throw new Exception();
            }
        }
    }
}
