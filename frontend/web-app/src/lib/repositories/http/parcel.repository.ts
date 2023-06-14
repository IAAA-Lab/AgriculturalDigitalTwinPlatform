import type {
	Enclosure,
	Summary,
	HistoricalWeather,
	Treatment,
	Fertilizer,
	UserParcels,
	DailyWeather,
	ForecastWeather,
	NDVI,
	Activity,
	CropStats
} from '$lib/core/Domain';
import { ServerError } from '$lib/core/Exceptions';
import type { IParcelsRepository } from '$lib/core/ports/Repository';
import type { AxiosInstance } from 'axios';

class HttpParcelsRepository implements IParcelsRepository {
	constructor(private readonly http: AxiosInstance) {}
	async getEnclosures(enclosureIds: string[], year: number): Promise<Enclosure[]> {
		return this.http
			.post<Enclosure[]>(
				'enclosures',
				{
					// This is because the backend expects an array of strings and it gives an error on empty array
					enclosureIds: enclosureIds.length > 0 ? enclosureIds : ['djsk'],
					year
				},
				{
					withCredentials: true
				}
			)
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw ServerError;
			})
			.catch((_) => {
				throw ServerError;
			});
	}
	async getOverviewSummary(userId: string): Promise<Summary> {
		throw new Error('Not implemented');
	}
	async getHistoricalWeather(
		idema: string,
		startDate: Date,
		endDate: Date,
		queryFields?: string[]
	): Promise<HistoricalWeather[]> {
		return this.http
			.get<HistoricalWeather[]>('weather/historical', {
				params: {
					idema,
					startDate,
					endDate,
					fields: queryFields?.join(',')
				},
				withCredentials: true
			})
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw ServerError;
			})
			.catch((_) => {
				throw ServerError;
			});
	}
	async getActivities(enclosureId: string, startDate: Date, endDate: Date): Promise<Activity[]> {
		return this.http
			.get<Activity[]>('activities', {
				params: {
					enclosureId,
					startDate,
					endDate
				},
				withCredentials: true
			})
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw ServerError;
			})
			.catch((_) => {
				throw ServerError;
			});
	}
	async getFertilizers(enclosureId: string, startDate: Date, endDate: Date): Promise<Fertilizer[]> {
		throw new Error('Not implemented');
	}
	async getCropStats(enclosureId: string, startDate: Date, endDate: Date): Promise<CropStats[]> {
		console.log('getCropStats', enclosureId, startDate, endDate);
		return this.http
			.get<CropStats[]>('crop-stats', {
				params: {
					enclosureId,
					startDate,
					endDate
				},
				withCredentials: true
			})
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw ServerError;
			});
	}

	setAuthorizationHeader(authorization: string): void {
		this.http.defaults.headers.common['Authorization'] = authorization;
	}

	async getUserParcels(userId: string): Promise<UserParcels> {
		return this.http
			.get<UserParcels>('parcels/ref', {
				params: {
					userId
				},
				withCredentials: true
			})
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw new ServerError('Error al obtener los campos del usuario');
			})
			.catch((e) => {
				throw new ServerError(e);
			});
	}

	async getDailyWeather(enclosureId: string, date: Date): Promise<DailyWeather> {
		return this.http
			.get<DailyWeather>('weather/daily', {
				params: {
					enclosureId,
					date
				},
				withCredentials: true
			})
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw new ServerError('Error al obtener el tiempo del día');
			})
			.catch((e) => {
				throw new ServerError(e);
			});
	}
	async getForecastWeather(enclosureId: string): Promise<ForecastWeather> {
		return this.http
			.get<ForecastWeather>('weather/forecast', {
				params: {
					enclosureId
				},
				withCredentials: true
			})
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw new ServerError('Error al obtener el pronóstico del tiempo');
			})
			.catch((e) => {
				throw new ServerError(e);
			});
	}
	async getNDVI(
		enclosureIds: string[],
		startDate: Date,
		endDate: Date,
		limit: number
	): Promise<NDVI[]> {
		return this.http
			.post<NDVI[]>(
				'ndvi',
				{
					enclosureIds,
					startDate,
					endDate,
					limit
				},
				{
					withCredentials: true
				}
			)
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw new ServerError('Error al obtener NDVI');
			})
			.catch((e) => {
				throw new ServerError(e);
			});
	}
}

export default HttpParcelsRepository;
