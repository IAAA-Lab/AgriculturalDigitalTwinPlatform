import type {
	Activity,
	Command,
	CropStats,
	DailyWeather,
	DigitalTwin,
	Fertilizer,
	ForecastWeather,
	HistoricalWeather,
	NDVI,
	SimulationInfo,
	YieldPrediction
} from '../Domain';

interface IDigitalTwinsRepository {
	createNewDigitalTwin(digitalTwin: DigitalTwin): Promise<void>;
	getDigitalTwins(digitalTwinIds: string[], year?: number): Promise<DigitalTwin[]>;
	getDigitalTwinNeighbors(digitalTwinId: string, radius: number): Promise<DigitalTwin[]>;
	// getOverviewSummary(userId: string): Promise<Summary>;
	getHistoricalWeather(
		idema: string,
		startDate: Date,
		endDate: Date,
		queryFields?: string[]
	): Promise<HistoricalWeather[]>;
	getDailyWeather(digitalTwinId: string, date: Date): Promise<DailyWeather>;
	getForecastWeather(digitalTwinId: string): Promise<ForecastWeather>;
	getNDVI(digitalTwinId: string, startDate?: Date, endDate?: Date, limit?: number): Promise<NDVI[]>;
	getActivities(
		digitalTwinIds: string,
		activityType?: string,
		startDate?: Date,
		endDate?: Date,
		limit?: number
	): Promise<Activity[]>;
	getCropStats(digitalTwinId: string, startDate?: Date, endDate?: Date): Promise<CropStats[]>;
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
interface IUserRepository {
	validateLogin(): Promise<string | null>;
	logout(): Promise<void>;
	refresh(): Promise<string>;
	login(body: string): Promise<string>;
	getDigitalTwinIds(userId: string): Promise<string[]>;
	setAuthorizationHeader(authorization: string): void;
}
interface IInternalStorageRepository {
	get(key: string): string | null;
	set(key: string, value: string): void;
	remove(key: string): void;
}

export type {
	IDigitalTwinsRepository as IParcelsRepository,
	IInternalStorageRepository,
	IUserRepository
};
