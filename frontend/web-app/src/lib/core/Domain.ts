enum Role {
	ADMIN = 'admin',
	PRIVATE_FILES = 'private_access',
	PLAIN = 'user',
	AGRARIAN = 'agrarian'
}

type User = {
	id?: string;
	name: string;
	role: string;
};

type DigitalTwin = {
	id: string;
	year: number;
	type: string;
	geometry: {
		type: string;
		coordinates: number[][];
	};
	properties: {
		userId: string;
		meteoStation: {
			idema: string;
			name: string;
			'distance(km)': number;
		};
		location: {
			ccaa: string;
			province: string;
			city: string;
			geographicSpot: string;
		};
		ndvi: NDVI | undefined;
		irrigationCoef: number;
		admisibility: number;
		crop: {
			id: string;
			name: string;
			varietyId: string;
			variety: string;
		};
		areaSIGPAC: number;
		area: number;
		rainfedOrIrrigated: string;
		// tenureRegimeId: string;
		// plantationDensity: number;
		vulnerableArea: boolean;
		// specificZones: boolean;
		parcelUse: string;
		slope: number;
		// uhc: number;
		// uhcDescription: string;
		// zepaZone: boolean;
		// sieZone: boolean;
	};
};

type CropStats = {
	enclosureId: string;
	date: Date;
	area: number;
	production: number;
	performance: number;
	harvest: number;
};

type Fertilizer = {
	enclosureId: string;
	name: string;
	startDate: Date;
	quantity: number;
};

type Treatment = {
	id: string;
	date: Date;
	broth: number;
	doseKind: number;
	doseMovement: number;
	quantity: number;
	doseUnit: string;
	healthAgent: {
		id: number;
		name: string;
	};
	phytosanitary: {
		id: number;
		name: string;
		formula: string;
	};
	plague: {
		id: number;
		name: string;
	};
};

type Activity = {
	date: Date;
	activity: string;
	yield?: number;
};

type NDVI = {
	enclosureId: string;
	ndvi: {
		date: string;
		value: number;
	}[];
};

type FarmHolder = {
	name: string;
	id: FarmHolderId;
	address: {
		zip: string;
		municipality: string;
		province: string;
		ccaa: string;
	};
	phones: string[];
	email: string;
};

type FarmHolderId = {
	type: string;
	code: string;
};

type HistoricalWeather = {
	type: string;
	parcelId: string;
	tmed: number;
	prec: number;
	tmin: number;
	tminTime: string;
	tmax: number;
	tmaxTime: string;
	windSpeed: number;
	windGust: number;
	windGustTime: string;
	date: string;
};

type ForecastWeather = {
	origin: origin;
	type: string;
	parcelId: string;
	elaboratedAt: Date;
	municipality: string;
	province: string;
	prediction: {
		day: Day[];
	};
};

type Day = {
	probPrec: ProbPrec[];
	snowQuote: SkyState[];
	skyState: SkyState[];
	wind: Wind[];
	ta: Ta;
	hr: Hr;
	uvMax: number;
	date: Date;
};

type Hr = {
	hrmax: number;
	hrmin: number;
};

type ProbPrec = {
	value: number;
	period: string;
};

type SkyState = {
	value: string;
	period: string;
	description?: string;
};

type Ta = {
	tamax: number;
	tamin: number;
};

type Wind = {
	direction: string;
	speed: number;
	period: string;
};

type DailyWeather = {
	type: string;
	parcelId: string;
	origin: origin;
	elaboratedAt: string;
	municipality: string;
	province: string;
	prediction: Prediction[];
};

type origin = {
	producer: string;
	web: string;
	language: string;
	copyright: string;
	legalNote: string;
};

type Prediction = {
	skyState: skyState[];
	prec: genericState[];
	probPrec: genericState[];
	probStorm: genericState[];
	snow: genericState[];
	probSnow: genericState[];
	ta: genericState[];
	hr: genericState[];
	wind: windState[];
	date: Date;
	dawn: string;
	sunset: string;
};

type skyState = {
	value: string;
	period: string;
	description?: string;
};

type genericState = {
	value: number;
	period: string;
};

type windState = {
	direction: string;
	speed: any;
	period: string;
	value?: number;
};

type YieldPrediction = {
	date: Date;
	yield: number;
};

type SimulationInfo = {
	simulationId: string;
	timestamp: Date;
	startDate: Date;
	endDate: Date;
	numTrees: number;
};

type Notifications = {
	type: string;
	value: any;
	timestamp: Date;
	digitalTwinId: string;
	importance: string;
};

export type {
	Activity,
	CropStats,
	DailyWeather,
	DigitalTwin,
	FarmHolder,
	FarmHolderId,
	Fertilizer,
	ForecastWeather,
	HistoricalWeather,
	NDVI,
	Prediction,
	Treatment,
	User,
	YieldPrediction,
	SimulationInfo
};

export { Role };
