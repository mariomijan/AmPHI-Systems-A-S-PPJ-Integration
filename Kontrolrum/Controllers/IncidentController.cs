using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using AutoMapper;
using Kontrolrum.Hubs;
using Microsoft.AspNetCore.Sockets;
using Kontrolrum.Models;
using Kontrolrum.Parser;
using CoreModels;
using PPJWCFClientCore;

namespace Kontrolrum.Controllers
{
    [Route("api/[controller]")]
    public class IncidentController : Controller
    {
        private readonly IHubContext<MessageHub> _messageHubContext;
        private Context _context;
        private LoggerController lCtrl;
        private IPPJParser iParser;

        public IncidentController(IHubContext<MessageHub> messageHubContext, DbContextOptions<Context> dbContext, States states)
        {
            _context = new Context(dbContext);
            this._messageHubContext = messageHubContext;
            lCtrl = new LoggerController(messageHubContext, dbContext);
            iParser = new PPJParser(states);
        }

        [Route("CheckIAmAlive")]
        public string CheckIAmAlive()
        {
            return iParser.CheckIAmAlive();
        }

        //Return all incidents
        //Called from the service
        [HttpGet]
        public IEnumerable<Incident> GetAllActiveIncidents()
        {
            try
            {
                var incidents = _context.Incidents.Where(x => x.Status == "Aktiv").OrderByDescending(x => x.ID).ToList();
                return incidents;
            }
            catch (Exception)
            {
                
                throw new Exception();
            }
        }

        [Route("GetAllInActiveIncidents")]
        public IEnumerable<Incident> GetAllInActiveIncidents()
        {
            var incidents = _context.Incidents.Where(x => x.Status == "Inaktiv").OrderByDescending(x => x.ID).ToList();
            return incidents;
        }

        //Return an incident
        //Called from the service
        [HttpGet("{id}")]
        public Incident GetIncident(int id)
        {
            var incident = _context.Incidents.FirstOrDefault(x => x.ID == id);
            return incident;

        }

        //Create the incident
        //Called from the service
        [HttpPost]
        public Incident SaveIncident([FromBody]Incident incident)
        {
            incident.CreationTime = DateTimeOffset.UtcNow;

            _context.Incidents.Add(incident);

            _context.SaveChanges();

            var logger = new Logger();
            logger.Incident = incident;
            logger.Time = DateTimeOffset.UtcNow;

            var createdIncident = iParser.SaveIncident(incident);

            logger.LogMessage = createdIncident.Item1;
            logger.Success = createdIncident.Item2;

            _context.Loggers.Add(logger);

            _context.SaveChanges();

            incident.Loggers = null;

            _messageHubContext.Clients.All.InvokeAsync("IncidentAdded", incident);

            return incident;
        }

        [HttpPut]
        //Update the incident
        public Incident UpdateIncident([FromBody]Incident incident)
        {
            var existingIncident = _context.Incidents.FirstOrDefault(x => x.ID == incident.ID);
            existingIncident.Address = incident.Address;
            existingIncident.Number = incident.Number;
            existingIncident.PostNr = incident.PostNr;
            existingIncident.City = incident.City;
            existingIncident.Description = incident.Description;
            existingIncident.CreationTime = DateTimeOffset.UtcNow;

            var logger = new Logger();
            logger.Time = DateTimeOffset.UtcNow;

            var createdIncident = iParser.SaveIncident(incident);

            if (createdIncident.Item2 == ErrorHandling.Positive)
            {
                createdIncident.Item1 = "Hændelse blev opdateret";
            }

            logger.LogMessage = createdIncident.Item1;
            logger.Success = createdIncident.Item2;

            logger.Incident = incident;
            _context.Loggers.Add(logger);

            _context.SaveChanges();

            incident.Loggers.Add(logger);

            incident.Loggers = null;

            _messageHubContext.Clients.All.InvokeAsync("IncidentUpdated", incident);

            return incident;
        }
        
        [HttpPut("{incident}")]
        public Incident CloseIncident([FromBody]Incident incident)
        {
            var exisitingIncident = _context.Incidents.FirstOrDefault(x => x.ID == incident.ID);
            exisitingIncident.CreationTime = DateTimeOffset.UtcNow;
            exisitingIncident.Status = "Inaktiv";

            var existingVehicles = new List<Vehicle>();

            foreach (var item in incident.Preparednesses)
            {
                var vehicle = _context.Vehicles.Include(s => s.Status).FirstOrDefault(x => x.ID == item.Vehicle.ID);
                existingVehicles.Add(vehicle);
            }

            var status = new Status();
            status.ID = 3;

            var existingStatus = _context.Status.FirstOrDefault(x => x.ID == status.ID);

            foreach (var item2 in existingVehicles)
            {
                item2.Status = existingStatus;
            }

            var existingPreparednesses = _context.Preparednesses.Where(x => x.Incident.ID == incident.ID).Where(x => x.Status == "Aktiv").ToList();
            foreach (var item3 in existingPreparednesses)
            {
                item3.Status = "Inaktiv";
            }

            var existingJournals = _context.Journals.Where(x => x.Incident.ID == incident.ID).Where(x => x.Status == "Aktiv").ToList();
            foreach (var journal in existingJournals)
            {
                journal.Status = "Inaktiv";
            }

            var logger = new Logger();
            logger.Incident = incident;
            logger.Time = DateTimeOffset.UtcNow; 

            var closedIncident = iParser.CloseIncident(incident);

            logger.LogMessage = closedIncident.Item1;
            logger.Success = closedIncident.Item2;

            _context.Loggers.Add(logger);

            _context.SaveChanges();
            
            incident.Loggers = new List<Logger>();
            incident.Loggers.Add(logger);

            incident.Loggers = null;

            _messageHubContext.Clients.All.InvokeAsync("IncidentClosed");

            _messageHubContext.Clients.All.InvokeAsync("ClearAllAfterClose");

            return incident;
        }
    }
}
