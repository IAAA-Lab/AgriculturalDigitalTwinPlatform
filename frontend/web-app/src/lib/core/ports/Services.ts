import type {
	DailyWeather,
	NDVI,
	Summary,
	UserParcels,
	ForecastWeather,
	HistoricalWeather,
	Enclosure,
	Treatment,
	User
} from '../Domain';

interface IenclosuresService {
	getEnclosures(enclosureIds: string[], year: number): Promise<Enclosure[]>;
	getOverviewSummary(userId: string): Promise<Summary>;
	getHistoricalWeather(idema: string, startDate: Date, endDate: Date): Promise<HistoricalWeather[]>;
	getDailyWeather(enclosureId: string): Promise<DailyWeather>;
	getForecastWeather(enclosureId: string): Promise<ForecastWeather>;
	getNDVI(enclosureIds: string[], startDate: Date, endDate: Date, limit: number): Promise<NDVI[]>;
	getCropStats(enclosureId: string): Promise<any[]>;
	getTreatments(enclosureId: string, startDate: Date, endDate: Date): Promise<Treatment[]>;
}

interface IUserService {
	logout(): Promise<void>;
	refresh(): Promise<User>;
	getUserCredentials(): Promise<User>;
	login(username: string, password: string): Promise<void>;
	getEnclosureIds(userId: string): Promise<void>;
}

export type { IenclosuresService, IUserService };
