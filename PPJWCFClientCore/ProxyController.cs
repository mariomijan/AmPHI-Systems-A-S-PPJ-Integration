using CoreModels;
using PPJWCFClient.PPJReference;
using PPJWCFClientCore;
using System;
using System.ServiceModel;

namespace PPJWCFClient
{
    public class ProxyController
    {
        private States states;
        public ProxyController(States states)
        {
            this.states = states;
        }

        public (bool, string) UpdateIncident(Incident incident)
        {
            updateIncident updateIncident = new updateIncident
            {
                Message = GetMessage(incident),
                Incident = new IncidentType()
            };
            
            updateIncident.Incident = GetIncidentType(incident);

            updateIncident.Incident.Address = new Address
            {
                StreetName = incident.Address,
                HouseNumber = incident.Number,
                City = incident.City,
                ZipCode = incident.PostNr,
            };

            updateIncident.Incident.IncidentDescription = incident.Description;

            ppjInterfaceClient client = GetClient();

            var securityHeader = new SecurityHeaderType();
            var header = new Header();
            var response = client.updateIncident(ref securityHeader, ref header, updateIncident);

            if (response.Error != null)
            {
                //Return the code in ServiceLog in DB and message for the log
                return (response.Type == ControlType.POSITIVE, response.Error.Description);
            }
            else
            {
                //Return the code in ServiceLog in DB and message for the log
                return (response.Type == ControlType.POSITIVE, "");
            }
        }

        public (bool, string) CloseIncident(Incident incident)
        {
            closeIncident closeIncident = new closeIncident();
            closeIncident.Message = GetMessage(incident);
            closeIncident.IncidentIdentification = new IdentificationType
            {
                Identification = incident.ID.ToString(),
                IdentificationSchema = "UUID"
            };

            ppjInterfaceClient client = GetClient();

            var securityHeader = new SecurityHeaderType();
            var header = new Header();
            var response = client.closeIncident(ref securityHeader, ref header, closeIncident);

            if (response.Error != null)
            {
                return (response.Type == ControlType.POSITIVE, response.Error.Description);
            }
            else
            {
                return (response.Type == ControlType.POSITIVE, "");
            }
        }

        public ppjInterfaceClient GetClient()
        {
            var binding = new BasicHttpBinding();
            var endpoint = new EndpointAddress(new Uri(states.PPJEndpoint));
            return new ppjInterfaceClient(binding, endpoint);
        }

        public MessageType GetMessage(Incident incident)
        {
            MessageType message = new MessageType
            {
                Identification = new IdentificationType
                {
                    Identification = "2",
                    IdentificationSchema = "UUID"
                },
                IncidentIdentification = new IdentificationType
                {
                    Identification = incident.ID.ToString(),
                    IdentificationSchema = "UUID"
                },
                Receiver = "PPJ",
                ResponsibleUnit = new OrgUnitType
                {
                    Classification = "SOR-Region",
                    Code = states.RegionCode,
                    Name = states.RegionName
                },
                Sender = states.Sender,
                SentTime = DateTime.UtcNow.ToString("yyyy'-'MM'-'ddTHH':'mm':'ss':'fff"),
                UpdateTime = DateTime.UtcNow.ToString("yyyy'-'MM'-'ddTHH':'mm':'ss':'fff")
            };
            return message;
        }


        public IncidentType GetIncidentType(Incident incident)
        {
            IncidentType incidentType = new IncidentType();
            incidentType.Identification = new IdentificationType
            {
                Identification = incident.ID.ToString(),
                IdentificationSchema = "UUID"
            };
            incidentType.ResponsibleUnit = new OrgUnitType
            {
                Classification = "SOR-Region",
                Code = states.RegionCode,
                Name = states.RegionName
            };
            return incidentType;
        }

        public JournalType GetJournalType(Journal journal)
        {
            JournalType journalType = new JournalType();
            journalType.Identification = new IdentificationType
            {
                Identification = journal.ID.ToString(),
                IdentificationSchema = "UUID"
            };


            return journalType;
        }

        public TaskType GetTaskType(Preparedness preparedness)
        {
            TaskType taskType = new TaskType();
            taskType.Identification = new IdentificationType
            {
                Identification = preparedness.ID.ToString(),
                IdentificationSchema = "UUID"
            };

            taskType.PriorityToIncident = preparedness.EmergencyCode.Code;
            taskType.Vehicle = new PPJReference.VehicleType
            {
                Identification = new IdentificationType
                {
                    Identification = preparedness.Vehicle.Name,
                    IdentificationSchema = "AmPHIEmsUnitID_V1"
                },
                ResponsibleUnit = GetIncidentType(preparedness.Incident).ResponsibleUnit,
                Operator = "Falck",
                Type = new VehicleTypeValues(),
                Name = "Ambulance",
                Telephone = "8888"
            };
            //taskType.Staff = new StaffType
            //{
            //    Identification = new IdentificationType
            //    {
            //        Identification = "staff1",
            //        IdentificationSchema = "sdss"
            //    },
            //    Name = "staffNavn",
            //    Role = "Rolle"
            //};
            return taskType;
        }

        public (bool, string) UpdateJournal(Journal journal)
        {
            updateJournal updateJournal = new updateJournal();

            updateJournal.Message = GetMessage(journal.Incident);

            updateJournal.Journal = new JournalType();

            updateJournal.Journal.Identification = GetJournalType(journal).Identification;
            updateJournal.Journal.Patient = new PatientType();
            updateJournal.Journal.Patient.FirstName = journal.Name;
            updateJournal.Journal.Patient.LastName = journal.Lastname;
            updateJournal.Journal.Patient.SocialSecurityNumber = journal.Cpr;
            updateJournal.Journal.IncidentIdentification = GetIncidentType(journal.Incident).Identification;

            ppjInterfaceClient client = GetClient();

            var securityHeader = new SecurityHeaderType();
            var header = new Header();
            var response = client.updateJournal(ref securityHeader, ref header, updateJournal);

            if (response.Error != null)
            {
                return (response.Type == ControlType.POSITIVE, response.Error.Description);
            }
            else
            {
                return (response.Type == ControlType.POSITIVE, "");
            }
        }

        public (bool, string) UpdateTask(Preparedness preparedness)
        {
            updateTask updateTask = new updateTask
            {
                Message = GetMessage(preparedness.Incident),
                TaskIdentification = GetTaskType(preparedness).Identification,
                Task = new TaskType
                {
                    IncidentIdentification = GetIncidentType(preparedness.Incident).Identification,
                }
            };
            updateTask.Task.Identification = GetTaskType(preparedness).Identification;

            updateTask.Task.Vehicle = GetTaskType(preparedness).Vehicle;

            updateTask.Task.PriorityToIncident = preparedness.EmergencyCode.Code;
            
            //Status for Task
            updateTaskStatus updateTaskStatus = new updateTaskStatus
            {
                TaskIdentification = GetTaskType(preparedness).Identification,
                Message = GetMessage(preparedness.Incident),
                Status = new TaskStatusType
                {
                    Code = GetConvertedEnums(preparedness),
                    Time = DateTime.UtcNow.ToString("yyyy'-'MM'-'ddTHH':'mm':'ss':'fff")
                }
            };

            ppjInterfaceClient client = GetClient(); 

            var securityHeader = new SecurityHeaderType();
            var header = new Header();

            var response = client.updateTask(ref securityHeader, ref header, updateTask);
            var tastStatusResponse = client.updateTaskStatus(ref securityHeader, ref header, updateTaskStatus);

            if (response.Error != null || tastStatusResponse.Error != null)
            {
                return (response.Type == ControlType.POSITIVE, response.Error.Description);
            }
            else
            {
                return (response.Type == ControlType.POSITIVE, "");
            }
        }

        public (bool, string) CloseTask(Preparedness preparedness)
        {
            closeTask closeTask = new closeTask
            {
                Message = GetMessage(preparedness.Incident),
                TaskIdentification = GetTaskType(preparedness).Identification
            };

            ppjInterfaceClient client = GetClient();

            var securityHeader = new SecurityHeaderType();
            var header = new Header();
            var response = client.closeTask(ref securityHeader, ref header, closeTask);

            if (response.Error != null)
            {
                return (response.Type == ControlType.POSITIVE, response.Error.Description);
            }
            else
            {
                return (response.Type == ControlType.POSITIVE, "");
            }
        }

        //Convert controlrum status codes to enum
        public TaskStatusValues GetConvertedEnums(Preparedness preparedness)
        {
            var convertedStatusCodesToEnums = Enum.Parse(typeof(TaskStatusValues), preparedness.Vehicle.Status.Code, true);
            return (TaskStatusValues)convertedStatusCodesToEnums;
        }

        public string CheckIAmAlive()
        {
            IAmAlive alive = new IAmAlive()
            {
                IAmAlive1 = new IAmAliveType()
                {
                    IAmAlive = true,
                    Reason = ""
                }
            };

            var securityHeader = new SecurityHeaderType();
            var header = new Header();

            ppjInterfaceClient client = GetClient();

            IAmAlive response = client.IAmAlive(ref securityHeader, ref header, alive);

            if (response.IAmAlive1 != null)
                //return WriteIAmAliveToListBox(response);
                return response.IAmAlive1.Reason;
            else
            {
                return "Ingen svar fra kontrolrum - IAmAlive";
            }
        }
    }
}










