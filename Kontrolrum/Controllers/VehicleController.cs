using CoreModels;
using Kontrolrum.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Kontrolrum.Controllers
{

    [Route("api/[controller]")]
    public class VehicleController : Controller
    {
        private Context _context;
        private VehicleTypeController vtCtrl;


        public VehicleController(DbContextOptions<Context> dbContext)
        {
            _context = new Context(dbContext);
            vtCtrl = new VehicleTypeController(dbContext);

        }

        public Vehicle GetVehicle(int id)
        {
            var vehicle = _context.Vehicles.Include(s => s.Status).FirstOrDefault(x => x.ID == id);
            return vehicle;
        }

        //MUST BE IN THIS CONTOLLER, ELSE ERROR WILL APPEAR
        public EmergencyCode GetEmergencyCode(int id)
        {
            var emergencycode = _context.EmergencyCodes.FirstOrDefault(x => x.ID == id);
            return emergencycode;
        }

        //MUST BE IN THIS CONTOLLER, ELSE ERROR WILL APPEAR
        public Status GetStatus(int id)
        {
            var existingStatus = _context.Status.FirstOrDefault(x => x.ID == id);
            return existingStatus;
        }

        [HttpGet("{id}")]
        public IEnumerable<Vehicle> GetVehiclesByTypeId(int id)
        {
            var vehicleList = _context.Vehicles.Where(x => x.VehicleType.ID == id).Include(s => s.Status).ToList();
            return vehicleList;
        }

        [HttpGet]
        public IEnumerable<Vehicle> GetAllVehicles()
        {
            var vehicleList = _context.Vehicles.Include(s => s.Status).ToList();
            return vehicleList;
        }
    }
}
 