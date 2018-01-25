using CoreModels;
using Kontrolrum.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kontrolrum.Parser
{
    public interface IPPJParser
    {
        (string, ErrorHandling) SaveIncident(Incident incident);
        (string, ErrorHandling) CloseIncident(Incident incident);
        (string, ErrorHandling) CreateJournal(Journal journal);
        (string, ErrorHandling) CreatePreparedness(Preparedness preparedness);
        (string, ErrorHandling) RemovePreparedness(Preparedness preparedness);
        string CheckIAmAlive();
    }
}
