import type {
	DailyWeather,
	NDVI,
	ForecastWeather,
	HistoricalWeather,
	Enclosure,
	Treatment,
	User,
	Activity
} from '../Domain';

interface IenclosuresService {
	getEnclosures(enclosureIds: string[], year: number): Promise<Enclosure[]>;
	getHistoricalWeather(idema: string, startDate: Date, endDate: Date): Promise<HistoricalWeather[]>;
	getDailyWeather(enclosureId: string): Promise<DailyWeather>;
	getForecastWeather(enclosureId: string): Promise<ForecastWeather>;
	getNDVI(
		enclosureIds: string[],
		startDate?: Date,
		endDate?: Date,
		limit?: number
	): Promise<NDVI[]>;
	getCropStats(enclosureId: string): Promise<any[]>;
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
