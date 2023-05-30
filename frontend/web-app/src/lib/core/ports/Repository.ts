import type {
	Activity,
	DailyWeather,
	Enclosure,
	Fertilizer,
	ForecastWeather,
	HistoricalWeather,
	NDVI,
	Summary,
	Treatment
} from '../Domain';

interface IParcelsRepository {
	getEnclosures(enclosureIds: string[], year: number): Promise<Enclosure[]>;
	getOverviewSummary(userId: string): Promise<Summary>;
	getHistoricalWeather(idema: string, startDate: Date, endDate: Date): Promise<HistoricalWeather[]>;
	getDailyWeather(enclosureId: string, date: Date): Promise<DailyWeather>;
	getForecastWeather(enclosureId: string): Promise<ForecastWeather>;
	getNDVI(
		enclosureIds: string[],
		startDate?: Date,
		endDate?: Date,
		limit?: number
	): Promise<NDVI[]>;
	getActivities(enclosureId: string, startDate: Date, endDate: Date): Promise<Activity[]>;
	getFertilizers(enclosureId: string, startDate: Date, endDate: Date): Promise<Fertilizer[]>;
	getCropStats(enclosureId: string): Promise<any[]>;
}
interface IUserRepository {
	validateLogin(): Promise<string | null>;
	logout(): Promise<void>;
	refresh(): Promise<string>;
	login(body: string): Promise<string>;
	getEnclosureIds(userId: string): Promise<string[]>;
	setAuthorizationHeader(authorization: string): void;
}
interface IInternalStorageRepository {
	get(key: string): string | null;
	set(key: string, value: string): void;
	remove(key: string): void;
}

export type { IParcelsRepository, IInternalStorageRepository, IUserRepository };
