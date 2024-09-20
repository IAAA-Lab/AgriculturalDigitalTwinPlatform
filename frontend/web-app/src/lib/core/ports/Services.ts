import type {
	DailyWeather,
	NDVI,
	ForecastWeather,
	HistoricalWeather,
	DigitalTwin,
	User,
	Activity,
	CropStats,
	YieldPrediction,
	SimulationInfo,
	Command
} from '../Domain';

interface IDigitalTwinsService {
	createNewDigitalTwin(digitalTwin: DigitalTwin): Promise<void>;
	getDigitalTwins(digitalTwinIds: string[], year: number): Promise<DigitalTwin[]>;
	getDigitalTwinNeighbors(digitalTwinId: string, radius: number): Promise<DigitalTwin[]>;
	getHistoricalWeather(
		idema: string,
		startDate: Date,
		endDate: Date,
		queryFields?: string[]
	): Promise<HistoricalWeather[]>;
	getDailyWeather(digitalTwinId: string): Promise<DailyWeather>;
	getForecastWeather(digitalTwinId: string): Promise<ForecastWeather>;
	getNDVI(digitalTwinId: string, startDate?: Date, endDate?: Date, limit?: number): Promise<NDVI[]>;
	getCropStats(digitalTwinId: string, startDate?: Date, endDate?: Date): Promise<CropStats[]>;
	getActivities(
		digitalTwinId: string,
		activityType?: string,
		startDate?: Date,
		endDate?: Date,
		limit?: number
	): Promise<Activity[]>;
	getYieldPredictions(
		digitalTwinId: string,
		startDate?: Date,
		endDate?: Date
	): Promise<YieldPrediction[]>;
	createNewSimulation(
		digitalTwinId: string,
		startDate: Date,
		endDate: Date,
		numTrees: number
	): Promise<string>;
	getSimulations(digitalTwinId: string): Promise<SimulationInfo[]>;
	stopSimulation(digitalTwinId: string, simulationId: string): Promise<void>;
	speedSimulation(digitalTwinId: string, simulationId: string, speed: number): Promise<void>;
	deleteSimulation(digitalTwinId: string, simulationId: string): Promise<void>;
	getCommands(digitalTwinId: string): Promise<Command[]>;
}

interface IUserService {
	logout(): Promise<void>;
	refresh(): Promise<User>;
	getUserCredentials(): Promise<User>;
	login(username: string, password: string): Promise<void>;
	getdigitalTwinIds(userId: string): Promise<string[]>;
}

export type { IDigitalTwinsService, IUserService };
