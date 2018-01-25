export class Logger {
		id: number;
		time: Date;
		incident: {
			id: number;
			address: string;
			number: string;
			postNr: string;
			city: string;
			description: string;
			status: string;
			journals: any[];
			preparednesses: any[];
			creationTime: Date;
			loggers: any[];
		};
		journal: {
			id: number;
			cpr: string;
			name: string;
			middleName: string;
			lastname: string;
			info: string;
			incident: {
				id: number;
				address: string;
				number: string;
				postNr: string;
				city: string;
				description: string;
				status: string;
				journals: any[];
				preparednesses: any[];
				creationTime: Date;
				loggers: any[];
			};
			reception: {
				id: number;
				code: number;
				name: string;
				journals: any[];
			};
			creationTime: Date;
			loggers: any[];
		};
		preparedness: {
			id: number;
			vehicle: {
				id: number;
				name: string;
				vehicleType: {
					id: number;
					name: string;
					vehicles: any[];
				};
				status: {
					id: number;
					code: string;
					meaning: string;
					vehicles: any[];
				};
			};
			incident: {
				id: number;
				address: string;
				number: string;
				postNr: string;
				city: string;
				description: string;
				status: string;
				journals: any[];
				preparednesses: any[];
				creationTime: Date;
				loggers: any[];
			};
			emergencyCode: {
				id: number;
				code: string;
				preparednesses: any[];
			};
			creationTime: Date;
			loggers: any[];
		};
        logMessage: string;
        errorHandling: any;
	}

