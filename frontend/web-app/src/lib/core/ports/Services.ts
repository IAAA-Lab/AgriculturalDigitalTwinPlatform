import type {
	DailyWeather,
	NDVI,
	ForecastWeather,
	HistoricalWeather,
	Enclosure,
	Treatment,
	User,
	Activity,
	CropStats
} from '../Domain';

interface IenclosuresService {
	getEnclosures(enclosureIds: string[], year: number): Promise<Enclosure[]>;
	getEnclosureNeighbors(enclosureId: string, radius: number): Promise<Enclosure[]>;
	getHistoricalWeather(
		idema: string,
		startDate: Date,
		endDate: Date,
		queryFields?: string[]
	): Promise<HistoricalWeather[]>;
	getDailyWeather(enclosureId: string): Promise<DailyWeather>;
	getForecastWeather(enclosureId: string): Promise<ForecastWeather>;
	getNDVI(
		enclosureIds: string[],
		startDate?: Date,
		endDate?: Date,
		limit?: number
	): Promise<NDVI[]>;
	getCropStats(enclosureId: string, startDate: Date, endDate: Date): Promise<CropStats[]>;
	getActivities(enclosureId: string, startDate: Date, endDate: Date): Promise<Activity[]>;
}

interface IUserService {
	logout(): Promise<void>;
	refresh(): Promise<User>;
	getUserCredentials(): Promise<User>;
	login(username: string, password: string): Promise<void>;
	getEnclosureIds(userId: string): Promise<void>;
}

export type { IenclosuresService, IUserService };
