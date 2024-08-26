import type {
	HistoricalWeather,
	DailyWeather,
	ForecastWeather,
	NDVI,
	Activity,
	CropStats,
	DigitalTwin,
	YieldPrediction,
	SimulationInfo
} from '$lib/core/Domain';
import { ServerError } from '$lib/core/Exceptions';
import type { IParcelsRepository } from '$lib/core/ports/Repository';
import type { AxiosInstance } from 'axios';

class HttpDigitalTwinsRepository implements IParcelsRepository {
	constructor(private readonly http: AxiosInstance) {}

	async createNewDigitalTwin(digitalTwin: DigitalTwin): Promise<void> {
		this.http
			.post<void>('enclosures/new', JSON.stringify(digitalTwin), {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((response) => {
				if (response.status === 200) {
					return;
				}
				throw ServerError;
			})
			.catch((e) => {
				console.error(e);
				throw ServerError;
			});
	}

	async getDigitalTwins(enclosureIds: string[], year: number): Promise<DigitalTwin[]> {
		return this.http
			.post<DigitalTwin[]>(
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

	async getDigitalTwinNeighbors(enclosureId: string, radius: number): Promise<DigitalTwin[]> {
		return this.http
			.get<DigitalTwin[]>(`enclosures/${enclosureId}/neighbours`, {
				params: {
					radius
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
	async getActivities(
		digitalTwinId: string,
		activityType?: string,
		startDate?: Date,
		endDate?: Date,
		limit?: number
	): Promise<Activity[]> {
		return this.http
			.post<Activity[]>(
				'activities',
				{
					digitalTwinId,
					type: activityType,
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
				throw ServerError;
			})
			.catch((_) => {
				throw ServerError;
			});
	}

	async getCropStats(enclosureId: string, startDate: Date, endDate: Date): Promise<CropStats[]> {
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
		digital_twin_id: string,
		startDate: Date,
		endDate: Date,
		limit: number
	): Promise<NDVI[]> {
		return this.http
			.post<NDVI[]>(
				'ndvi',
				{
					digital_twin_id,
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
	async getYieldPredictions(
		digitalTwinId: string,
		startDate?: Date,
		endDate?: Date
	): Promise<YieldPrediction[]> {
		return this.http
			.post<YieldPrediction[]>(
				`enclosures/${digitalTwinId}/predictions`,
				{
					type: 'yield',
					digitalTwinId,
					startDate,
					endDate
				},
				{
					withCredentials: true
				}
			)
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw new ServerError('Error al obtener la predicción de rendimiento');
			})
			.catch((e) => {
				throw new ServerError(e);
			});
	}

	async createNewSimulation(
		digitalTwinId: string,
		startDate: Date,
		endDate: Date,
		numTrees: number
	): Promise<string> {
		return this.http
			.post<string>(
				`enclosures/${digitalTwinId}/simulations/start`,
				{
					startDate,
					endDate,
					numTrees
				},
				{
					withCredentials: true
				}
			)
			.then((response) => {
				if (response.status === 200) {
					return response.data['simulationId'];
				}
				throw new ServerError('Error al iniciar la simulación');
			})
			.catch((e) => {
				throw new ServerError(e);
			});
	}

	async getSimulations(digitalTwinId: string): Promise<SimulationInfo[]> {
		return this.http
			.get<SimulationInfo[]>(`enclosures/${digitalTwinId}/simulations`, {
				withCredentials: true
			})
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw new ServerError('Error al obtener las simulaciones');
			})
			.catch((e) => {
				throw new ServerError(e);
			});
	}

	async stopSimulation(digitalTwinId: string, simulationId: string): Promise<void> {
		this.http
			.post<void>(
				`enclosures/${digitalTwinId}/simulations/stop`,
				{
					simulationId
				},
				{
					withCredentials: true
				}
			)
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw new ServerError('Error al obtener la simulación');
			})
			.catch((e) => {
				throw new ServerError(e);
			});
	}
	async speedSimulation(digitalTwinId: string, simulationId: string, speed: number): Promise<void> {
		console.log({ simulationId, speed });
		this.http
			.post<void>(
				`enclosures/${digitalTwinId}/simulations/speed`,
				{
					simulationId,
					speed
				},
				{
					withCredentials: true
				}
			)
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw new ServerError('Error al obtener la simulación');
			})
			.catch((e) => {
				throw new ServerError(e);
			});
	}
	async deleteSimulation(digitalTwinId: string, simulationId: string): Promise<void> {
		this.http
			.delete<void>(`enclosures/${digitalTwinId}/simulations/${simulationId}`, {
				withCredentials: true
			})
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw new ServerError('Error al obtener la simulación');
			})
			.catch((e) => {
				throw new ServerError(e);
			});
	}
}

export default HttpDigitalTwinsRepository;
