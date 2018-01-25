using CoreModels;
using Kontrolrum.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kontrolrum.Models
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> connection)
            : base (connection)
        { 
        }

        public DbSet<Incident> Incidents { get; set; }
        public DbSet<Journal> Journals { get; set; }
        public DbSet<Preparedness> Preparednesses { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<EmergencyCode> EmergencyCodes { get; set; }
        public DbSet<VehicleType> VehicleTypes { get; set; }
        public DbSet<Status> Status { get; set; }
        public DbSet<Reception> Receptions { get; set; }
        public DbSet<Logger> Loggers { get; set; }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    //optionsBuilder.UseSqlServer(@"Data Source=kraka.ucn.dk;Initial Catalog=dmab0915_2Sem_4;Persist Security Info=True;User ID=dmab0915_2Sem_4;Password=IsAllowed");
        //    //optionsBuilder.UseSqlServer(@"Data Source=192.168.0.198\SQLEXPRESS;Initial Catalog=Kontrolrum2;Persist Security Info=True;User ID=sa;Password=G4uMenX4");

        //    //optionsBuilder.UseSqlServer(ConnectionString.Connection);
        //}
    }
}
