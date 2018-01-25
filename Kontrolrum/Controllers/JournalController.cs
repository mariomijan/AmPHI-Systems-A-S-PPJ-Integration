using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kontrolrum.Hubs;
using Kontrolrum.Models;
using Kontrolrum.Parser;
using CoreModels;
using PPJWCFClientCore;

namespace Kontrolrum.Controllers
{
    [Route("api/[controller]")]
    public class JournalController : Controller
    {
        private Context _context;
        private IncidentController iCtl;
        private readonly IHubContext<MessageHub> _messageHubContext;
        private IPPJParser iParser;

        public JournalController(IHubContext<MessageHub> messageHubContext, DbContextOptions<Context> dbContext, States states)
        {
            _context = new Context(dbContext);
            this._messageHubContext = messageHubContext;
            iCtl = new IncidentController(messageHubContext, dbContext, states);
            iParser = new PPJParser(states);
        }

        //Create the journal
        //Called from the service        
        [HttpPost]
        public Journal CreateJournal([FromBody]Journal journal)
        {
            journal.CreationTime = DateTimeOffset.UtcNow;
            journal.Status = "Aktiv";
            _context.Attach(journal);

            _context.SaveChanges();

            var logger = new Logger();
            logger.Journal = journal;
            logger.Time = DateTimeOffset.UtcNow;

            var createJournal = iParser.CreateJournal(journal);

            logger.LogMessage = createJournal.Item1;
            logger.Success = createJournal.Item2;

            logger.Incident = journal.Incident;
            _context.Loggers.Add(logger);

            _context.SaveChanges();

            journal.Incident = null;
            journal.Reception = null;
            journal.Loggers = null;

            _messageHubContext.Clients.All.InvokeAsync("JournalAdded", journal);

            return journal;
        }

        [HttpGet("{id}")]
        public IEnumerable<Journal> GetAllActiveJournalsByIncidentId(int id)
        {
            var journals = _context.Journals.Where(x => x.Incident.ID == id).Where(x => x.Status == "Aktiv").Include(r => r.Reception).OrderByDescending(x => x.ID).ToList();

            foreach (var item in journals)
            {
                if (item.Reception != null)
                {
                    item.Reception = _context.Receptions.FirstOrDefault(x => x.ID == item.Reception.ID);
                }
            }
            return journals;
        }

       
        [Route("GetAllInActiveJournalsByIncidentId")]
        public IEnumerable<Journal> GetInActiveJournalsByIncidentId(int id)
        {
            var journals = _context.Journals.Where(x => x.Incident.ID == id).Where(x => x.Status == "Inaktiv").Include(r => r.Reception).OrderByDescending(x => x.ID).ToList();

            foreach (var item in journals)
            {
                if (item.Reception != null)
                {
                    item.Reception = _context.Receptions.FirstOrDefault(x => x.ID == item.Reception.ID);
                }
            }
            return journals;
        }

        //Remove the selected item from the table list
        //Called from the service
        [HttpDelete("{id}")]
        public void RemoveJournal(int id)
        {
            var journal = _context.Journals.FirstOrDefault(x => x.ID == id);
            _context.Journals.Remove(journal);
            _context.SaveChanges();
        }

        public Journal GetJournal(int journalId)
        {
            var exJournal = _context.Journals.Include(r => r.Reception).FirstOrDefault(x => x.ID == journalId);

            if (exJournal.Reception != null)
            {
                exJournal.Reception = _context.Receptions.FirstOrDefault(x => x.ID == exJournal.Reception.ID);
            }
            return exJournal;
        }

        [HttpPut]
        //Update the journal
        public Journal UpdateJournal([FromBody] Journal journal)
        {
            var existingJournal = _context.Journals.FirstOrDefault(x => x.ID == journal.ID);
            existingJournal.Cpr = journal.Cpr;
            existingJournal.Name = journal.Name;
            existingJournal.MiddleName = journal.MiddleName;
            existingJournal.Lastname = journal.Lastname;
            existingJournal.Info = journal.Info;
            existingJournal.CreationTime = DateTimeOffset.UtcNow;

            var existingReception = _context.Receptions.FirstOrDefault(x => x.ID == journal.Reception.ID);

            existingJournal.Reception = existingReception;

            var updateLogger = new Logger();
            updateLogger.Time = DateTimeOffset.UtcNow;

            var createdJournal = iParser.CreateJournal(journal);

            if (createdJournal.Item2 == ErrorHandling.Positive)
            {
                createdJournal.Item1 = "Journal opdateret";
            }

            updateLogger.LogMessage = createdJournal.Item1;
            updateLogger.Success = createdJournal.Item2;

            var existingInicident = _context.Incidents.FirstOrDefault(x => x.ID == journal.Incident.ID);

            updateLogger.Incident = existingInicident;
            _context.Loggers.Add(updateLogger);

            existingJournal.Loggers = new List<Logger>();
            existingJournal.Loggers.Add(updateLogger);

            _context.SaveChanges();

            existingJournal.Loggers = null;

            _messageHubContext.Clients.All.InvokeAsync("JournalUpdated", journal);

            return existingJournal;
        }
    }
}