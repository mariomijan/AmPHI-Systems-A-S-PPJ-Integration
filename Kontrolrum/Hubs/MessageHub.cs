using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kontrolrum.Hubs
{
    public class MessageHub : Hub
    {
        public Task SendMessage(string message)
        {
            return Clients.All.InvokeAsync("Send", message);
        }
    }
}
