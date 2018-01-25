using CoreModels;
using Kontrolrum.Hubs;
using Kontrolrum.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kontrolrum.Controllers
{
    [Route("api/[controller]")]
    public class LoggerController
    {
        private readonly IHubContext<MessageHub> _messageHubContext;

        private Context _context;
        public LoggerController(IHubContext<MessageHub> messageHubContext, DbContextOptions<Context> dbContext)
        {
            _context = new Context(dbContext);
            this._messageHubContext = messageHubContext;
        }

        [HttpGet("{id}")]
        public IEnumerable<Logger> GetAllLoggersByIncidentId(int id)
        {
            var loggers = _context.Loggers.Include(i => i.Incident).Include(j => j.Journal)
                .Include(p => p.Preparedness).Where(x => x.Incident.ID == id).OrderByDescending(x => x.ID).ToList();
            return loggers;
        }
    }
}
