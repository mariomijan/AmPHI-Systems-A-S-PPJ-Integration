using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kontrolrum.Hubs;
using Kontrolrum.Models;
using CoreModels;
using Kontrolrum.Parser;
using PPJWCFClientCore;

namespace Kontrolrum.Controllers
{
    [Route("api/[controller]")]
    public class PreparednessController
    {
        private Context _context;
        private IncidentController iCtrl;
        private VehicleController vCtrl;
        private readonly IHubContext<MessageHub> _messageHubContext;
        private IPPJParser iParser;


        public PreparednessController(IHubContext<MessageHub> messageHubContext, DbContextOptions<Context> dbContext, States states)
        {
            _context = new Context(dbContext);
            this._messageHubContext = messageHubContext;
            iCtrl = new IncidentController(messageHubContext, dbContext, states);
            vCtrl = new VehicleController(dbContext);
            iParser = new PPJParser(states);
        }

        [Route("CreatePreparedness")]
        public Preparedness CreatePreparedness([FromBody]Preparedness preparedness)
        {
            preparedness.CreationTime = DateTimeOffset.UtcNow;

            var existingVehicle = _context.Vehicles.Include(s => s.Status).FirstOrDefault(x => x.ID == preparedness.Vehicle.ID);

            var existingStatus = _context.Status.FirstOrDefault(x => x.ID == preparedness.Vehicle.Status.ID);

            existingVehicle.Status = existingStatus;

            preparedness.Incident.Journals = null;

            preparedness.Status = "Aktiv";

            preparedness.EmergencyCode = _context.EmergencyCodes.FirstOrDefault(x => x.ID == preparedness.EmergencyCode.ID);

            _context.Preparednesses.Attach(preparedness);

            _context.SaveChanges();

            var logger = new Logger();
            logger.Preparedness = preparedness;
            logger.Time = DateTimeOffset.UtcNow;


            var createdPreparedness = iParser.CreatePreparedness(preparedness);

            logger.LogMessage = createdPreparedness.Item1;
            logger.Success = createdPreparedness.Item2;
            logger.Incident = preparedness.Incident;
            _context.Loggers.Add(logger);

            _context.SaveChanges();

            preparedness.EmergencyCode = null;

            preparedness.Loggers = null;
            preparedness.Incident = null;
            preparedness.Vehicle = null;
            _messageHubContext.Clients.All.InvokeAsync("PreparednessAdded", preparedness);
            return preparedness;
        }

        [HttpPut]
        public Preparedness UpdatePreparedness([FromBody]Preparedness preparedness)
        {
            var existingPreparedness = _context.Preparednesses.Include(x => x.Vehicle).FirstOrDefault(x => x.ID == preparedness.ID);

            existingPreparedness.CreationTime = DateTimeOffset.UtcNow;

            var existingCode = _context.EmergencyCodes.FirstOrDefault(x => x.ID == preparedness.EmergencyCode.ID);

            var existingStatus = _context.Status.FirstOrDefault(x => x.ID == preparedness.Vehicle.Status.ID);

            existingPreparedness.EmergencyCode = existingCode;
            existingPreparedness.Vehicle.Status = existingStatus;

            var existingIncident = _context.Incidents.FirstOrDefault(x => x.ID == preparedness.Incident.ID);

            var logger = new Logger();
            logger.Time = DateTimeOffset.UtcNow;

            preparedness.Vehicle.Status = existingStatus;

            preparedness.EmergencyCode = _context.EmergencyCodes.FirstOrDefault(x => x.ID == preparedness.EmergencyCode.ID);

            var updatePreparedness = iParser.CreatePreparedness(preparedness);

            if (updatePreparedness.Item2 == ErrorHandling.Positive)
            {
                updatePreparedness.Item1 = "Beredskab opdateret";
            }

            logger.LogMessage = updatePreparedness.Item1;
            logger.Success = updatePreparedness.Item2;

            logger.Incident = existingIncident;
            _context.Loggers.Add(logger);

            existingPreparedness.Loggers = new List<Logger>();
            existingPreparedness.Loggers.Add(logger);

            _context.SaveChanges();

            existingPreparedness.Loggers = null;

            _messageHubContext.Clients.All.InvokeAsync("PreparednessUpdated", preparedness);

            return existingPreparedness;
        }

        [HttpGet("{id}")]
        public IEnumerable<Preparedness> GetAllActivePreparednessByIncidentId(int id)
        {
            var preparednessList = _context.Preparednesses.Where(x => x.Status == "Aktiv").OrderByDescending(x => x.ID).Where(i => i.Incident.ID == id).Include(v => v.Vehicle).Include(s => s.Vehicle.Status).
                Include(em => em.EmergencyCode).OrderByDescending(x => x.ID).ToList();

            foreach (var p in preparednessList)
            {
                if (p.Vehicle.Status != null && p.EmergencyCode != null)
                {
                    p.Vehicle = vCtrl.GetVehicle(p.Vehicle.ID);
                    p.EmergencyCode = vCtrl.GetEmergencyCode(p.EmergencyCode.ID);
                }

            }

            return preparednessList;
        }

        [HttpGet]
        public IEnumerable<EmergencyCode> GetAllEmergencyCode()
        {
            try
            {
                var ecodesList = _context.EmergencyCodes.ToList();
                return ecodesList;
            }
            catch (Exception)
            {
                throw new Exception();
            }
        }

        [Route("GetAllReceptions")]
        public IEnumerable<Reception> GetAllReceptions()
        {
            try
            {
                var receptionList = _context.Receptions.ToList();
                return receptionList;
            }
            catch (Exception)
            {
                throw new Exception();
            }
            
        }

        [Route("GetAllStatuses")]
        public IEnumerable<Status> GetAllStatuses()
        {
            try
            {
                var statusList = _context.Status.ToList();
                return statusList;
            }
            catch (Exception)
            {
                throw new Exception();
            }
        }


        [HttpPut("{preparedness}")]
        public Preparedness RemovePreparedness([FromBody]Preparedness preparedness)
        {
            var exisitngPreparedness = _context.Preparednesses.Include(v => v.Vehicle).FirstOrDefault(x => x.ID == preparedness.ID);

            var existingVehicle = _context.Vehicles.FirstOrDefault(x => x.ID == preparedness.Vehicle.ID);

            var existingIncident = _context.Incidents.FirstOrDefault(x => x.ID == preparedness.Incident.ID);

            exisitngPreparedness.Status = "Inaktiv";

            var status = new Status();
            status.ID = 3;

            var existingStatus = _context.Status.FirstOrDefault(x => x.ID == status.ID);
            existingStatus.ID = 3;

            existingVehicle.Status = existingStatus;

            var fjernlogger = new Logger();
            fjernlogger.Preparedness = exisitngPreparedness;
            fjernlogger.Time = DateTimeOffset.UtcNow;

            preparedness.EmergencyCode = _context.EmergencyCodes.FirstOrDefault(x => x.ID == preparedness.EmergencyCode.ID);

            var removedPreparedness = iParser.RemovePreparedness(preparedness);

            fjernlogger.LogMessage = removedPreparedness.Item1;
            fjernlogger.Success = removedPreparedness.Item2;
            fjernlogger.Incident = existingIncident;
            _context.Loggers.Add(fjernlogger);

            exisitngPreparedness.Loggers = new List<Logger>();
            exisitngPreparedness.Loggers.Add(fjernlogger);

            _context.SaveChanges();

            preparedness.Vehicle = null;
            preparedness.Loggers = null;
            preparedness.EmergencyCode = null;

            _messageHubContext.Clients.All.InvokeAsync("PreparednessRemoved", preparedness);

            return exisitngPreparedness;
        }

        [Route("Allocation")]
        public Preparedness Allocation([FromBody]Preparedness preparedness)
        {
          
            //Create the new preparedness
            preparedness.CreationTime = DateTimeOffset.UtcNow;

            var existingVehicle = _context.Vehicles.Include(s => s.Status).FirstOrDefault(x => x.ID == preparedness.Vehicle.ID);

            var existingStatus = _context.Status.FirstOrDefault(x => x.ID == preparedness.Vehicle.Status.ID);

            var existingIncident = _context.Incidents.FirstOrDefault(x => x.ID == preparedness.Incident.ID);

            existingVehicle.Status = existingStatus;

            preparedness.Incident.Journals = null;

            preparedness.Status = "Aktiv";

            _context.Preparednesses.Attach(preparedness);

            _context.SaveChanges();

            //Remove the other preparedness
            var exisitngPreparedness = _context.Preparednesses.Include(v => v.Vehicle).FirstOrDefault(x => x.ID == preparedness.ID);

            var TheOtherPreparedness = _context.Preparednesses.Include(x => x.Incident).Where(x => x.Vehicle.ID == exisitngPreparedness.Vehicle.ID).Where(x => x.Status == "Aktiv").FirstOrDefault(x => x.CreationTime != exisitngPreparedness.CreationTime);
            TheOtherPreparedness.Status = "Inaktiv";
            TheOtherPreparedness.Vehicle = null;

            var existingOldIncident = _context.Incidents.FirstOrDefault(x => x.ID == TheOtherPreparedness.Incident.ID);

            var logger = new Logger();
            logger.Preparedness = exisitngPreparedness;
            logger.Time = DateTimeOffset.UtcNow;
            logger.LogMessage = "Vogn omdisponeret";
            logger.Incident = existingIncident;
            _context.Loggers.Add(logger);

            var logger2 = new Logger();
            logger2.Preparedness = TheOtherPreparedness;
            logger2.Time = DateTimeOffset.UtcNow;
            logger2.LogMessage = "Vognen er flyttet";
            logger2.Incident = existingOldIncident;
            _context.Loggers.Add(logger2);

            _context.SaveChanges();

            preparedness.Vehicle = null;
            preparedness.Loggers = null;
            preparedness.Incident = null;
            preparedness.EmergencyCode = null;

            _messageHubContext.Clients.All.InvokeAsync("PreparednessAllocation", preparedness);

            return exisitngPreparedness;

        }
    }
}
