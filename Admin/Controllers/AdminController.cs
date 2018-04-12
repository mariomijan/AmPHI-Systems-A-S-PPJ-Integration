using Kontrolrum.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.Controllers
{
    [Route("api/[controller]")]
    public class AdminController : Controller
    {
        private Context context;
        public AdminController()
        {
            context = new Context();
        }

        [Route("CreateType")]
        public void CreateType([FromBody]VehicleType type)
        {
            context.VehicleTypes.Add(type);
            context.SaveChanges();
        }

        [Route("UpdateType")]
        public void UpdateType([FromBody]VehicleType type)
        {
            VehicleType t = context.VehicleTypes.FirstOrDefault(x => x.ID == type.ID);
            t.Name = type.Name;

            context.SaveChanges();

        }

        [Route("GetAllVehicleTypes")]
        public List<VehicleType> GetAllVehicleTypes()
        {
            List<VehicleType> tList = context.VehicleTypes.ToList();
            return tList;
        }

        [Route("CreateVehicle")]
        public void AddVehicle([FromBody]Vehicle vehicle)
        {
            VehicleType type = context.VehicleTypes.FirstOrDefault(x => x.ID == vehicle.VehicleType.ID);
            Status status = context.Status.FirstOrDefault(x => x.ID == 3);

            vehicle.VehicleType = type;
            vehicle.Status = status;

            context.Vehicles.Add(vehicle);
            context.SaveChanges();
        }

        [Route("CreateEmergencyCode")]
        public void CreateEmergencyCode([FromBody]EmergencyCode code)
        {
            context.EmergencyCodes.Add(code);
            context.SaveChanges();
        }

        [Route("RemoveType")]
        public void RemoveType([FromBody]VehicleType type)
        {
            context.VehicleTypes.Remove(type);
            context.SaveChanges();
        }

        [Route("GetAllVehicles")]
        public List<Vehicle> GetAllVehicles()
        {
            List<Vehicle> vehicles = context.Vehicles.ToList();
            return vehicles;
        }

        [Route("UpdateVehicle")]
        public void UpdateVehicle([FromBody]Vehicle vehicle)
        {
            Vehicle v = context.Vehicles.FirstOrDefault(x => x.ID == vehicle.ID);
            v.Name = vehicle.Name;

            context.SaveChanges();
        }

        [Route("RemoveVehicle")]
        public void RemoveVehicle([FromBody]Vehicle vehicle)
        {
            context.Vehicles.Remove(vehicle);
            context.SaveChanges();
        }

        [Route("GetAllEmergencyCodes")]
        public List<EmergencyCode> GetAllEmergencyCodes()
        {
            List<EmergencyCode> codes = context.EmergencyCodes.ToList();
            return codes;
        }

        [Route("UpdateEmergencyCode")]
        public void UpdateEmergencyCode([FromBody]EmergencyCode code)
        {
            EmergencyCode c = context.EmergencyCodes.FirstOrDefault(x => x.ID == code.ID);
            c.Code = code.Code;
            context.SaveChanges();
        }

        [Route("RemoveEmergencyCode")]
        public void RemoveEmergencyCode([FromBody]EmergencyCode code)
        {
            context.EmergencyCodes.Remove(code);
            context.SaveChanges();
        }

        [Route("CreateStatus")]
        public void CreateStatus([FromBody]Status status)
        {
            context.Status.Add(status);
            context.SaveChanges();
        }

        [Route("GetAllStatuses")]
        public List<Status> GetAllStatuses()
        {
            List<Status> statuses = context.Status.ToList();
            return statuses;
        }

        [Route("UpdateStatus")]
        public void UpdateStatus([FromBody]Status status)
        {
            Status s = context.Status.FirstOrDefault(x => x.ID == status.ID);
            s.Code = status.Code;
            s.Meaning = status.Meaning;
            context.SaveChanges();
        }

        [Route("RemoveStatus")]
        public void RemoveStatus([FromBody]Status status)
        {
            context.Status.Remove(status);
            context.SaveChanges();
        }
    }
}
