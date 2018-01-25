using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kontrolrum.Models;
using PPJWCFClient;
using Kontrolrum.ErrorLogging;
using CoreModels;
using PPJWCFClientCore;

namespace Kontrolrum.Parser
{
    public class PPJParser : IPPJParser
    {
        private Errorlog el;
        private States states;

        public PPJParser(States states)
        {
            el = new Errorlog();
            this.states = states;
        }

        public string CheckIAmAlive()
        {
            var proxy = new ProxyController(states);
            var proxyCall = proxy.CheckIAmAlive();
            return proxyCall;
        }

        public (string, ErrorHandling) CloseIncident(Incident incident)
        {
            var proxy = new ProxyController(states);
            var proxyCall = proxy.CloseIncident(incident);

            if (proxyCall.Item2 != "")
            {
                el.Error(proxyCall.Item2);
                ErrorHandling e = ErrorHandling.Negative;
                return (proxyCall.Item2, e);
            }
            else
            {
                ErrorHandling e = ErrorHandling.Positive;
                return ("Hændelse lukket", e);
            }
        }

        public (string, ErrorHandling) CreateJournal(Journal journal)
        {
            var proxy = new ProxyController(states);
            var proxyCall = proxy.UpdateJournal(journal);

            if (proxyCall.Item2 != "")
            {
                //Write error message to file
                el.Error(proxyCall.Item2);
                ErrorHandling e = ErrorHandling.Negative;
                return (proxyCall.Item2, e);
            }
            else
            {
                ErrorHandling e = ErrorHandling.Positive;
                return ("Journal oprettet", e);
            }
        }

        public (string, ErrorHandling) CreatePreparedness(Preparedness preparedness)
        {
            var proxy = new ProxyController(states);
            var proxyCall = proxy.UpdateTask(preparedness);

            if (proxyCall.Item2 != "")
            {
                //Write error message to file
                el.Error(proxyCall.Item2);
                ErrorHandling e = ErrorHandling.Negative;
                return (proxyCall.Item2, e);
            }
            else
            {
                ErrorHandling e = ErrorHandling.Positive;
                return ("Beredskab tilføjet", e);
            }
        }

        public (string, ErrorHandling) RemovePreparedness(Preparedness preparedness)
        {
            var proxy = new ProxyController(states);
            var proxyCall = proxy.CloseTask(preparedness);

            if (proxyCall.Item2 != "")
            {
                el.Error(proxyCall.Item2);
                ErrorHandling e = ErrorHandling.Negative;
                return (proxyCall.Item2, e);
            }
            else
            {
                ErrorHandling e = ErrorHandling.Positive;
                return ("Beredskab fjernet", e);
            }
        }

        public (string, ErrorHandling) SaveIncident(Incident incident)
        {
            var proxy = new ProxyController(states);
            var proxyCall = proxy.UpdateIncident(incident);

            if (proxyCall.Item2 != "")
            {
                //Write error message to file
                el.Error(proxyCall.Item2);
                ErrorHandling e = ErrorHandling.Negative;
                return (proxyCall.Item2, e);
            }
            else
            {
                ErrorHandling e = ErrorHandling.Positive;
                return ("Hændelsen blev oprettet", e);
            }
        }
    }
}
