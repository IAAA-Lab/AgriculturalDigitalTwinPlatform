import type {
	DailyWeather,
	NDVI,
	ForecastWeather,
	HistoricalWeather,
	DigitalTwin
} from '../Domain';
import type { IParcelsRepository } from '../ports/Repository';
import type { IDigitalTwinsService } from '../ports/Services';

class DigitalTwinsService implements IDigitalTwinsService {
	constructor(private readonly parcelsRepository: IParcelsRepository) {}

	createNewDigitalTwin(digitalTwin: DigitalTwin): Promise<void> {
		return this.parcelsRepository.createNewDigitalTwin(digitalTwin);
	}

	getDigitalTwins(digitalTwinIds: string[]): Promise<DigitalTwin[]> {
		return this.parcelsRepository.getDigitalTwins(digitalTwinIds, undefined);
	}
	getDigitalTwinNeighbors(digitalTwinId: string, radius: number): Promise<DigitalTwin[]> {
		return this.parcelsRepository.getDigitalTwinNeighbors(digitalTwinId, radius);
	}
	getHistoricalWeather(
		idema: string,
		startDate: Date,
		endDate: Date,
		queryFields?: string[]
	): Promise<HistoricalWeather[]> {
		return this.parcelsRepository.getHistoricalWeather(idema, startDate, endDate, queryFields);
	}
	getDailyWeather(digitalTwinId: string): Promise<DailyWeather> {
		// Get the current day like this: 2022-10-31T00:00:00.000Z in ISO format
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return this.parcelsRepository.getDailyWeather(digitalTwinId, date);
	}
	getForecastWeather(digitalTwinId: string): Promise<ForecastWeather> {
		return this.parcelsRepository.getForecastWeather(digitalTwinId);
	}
	getNDVI(
		digitalTwinId: string,
		startDate?: Date,
		endDate?: Date,
		limit?: number
	): Promise<NDVI[]> {
		return this.parcelsRepository.getNDVI(digitalTwinId, startDate, endDate, limit);
	}
	getActivities(
		digitalTwinId: string,
		activityType?: string,
		startDate?: Date,
		endDate?: Date,
		limit?: number
	) {
		return this.parcelsRepository.getActivities(
			digitalTwinId,
			activityType,
			startDate,
			endDate,
			limit
		);
	}
	getCropStats(digitalTwinId: string, startDate?: Date, endDate?: Date) {
		return this.parcelsRepository.getCropStats(digitalTwinId, startDate, endDate);
	}
	getYieldPredictions(digitalTwinId: string, startDate?: Date, endDate?: Date) {
		return this.parcelsRepository.getYieldPredictions(digitalTwinId, startDate, endDate);
	}
	createNewSimulation(digitalTwinId: string, startDate: Date, endDate: Date, numTrees: number) {
		return this.parcelsRepository.createNewSimulation(digitalTwinId, startDate, endDate, numTrees);
	}
	getSimulations(digitalTwinId: string) {
		return this.parcelsRepository.getSimulations(digitalTwinId);
	}
	stopSimulation(digitalTwinId: string, simulationId: string) {
		return this.parcelsRepository.stopSimulation(digitalTwinId, simulationId);
	}
	speedSimulation(digitalTwinId: string, simulationId: string, speed: number) {
		return this.parcelsRepository.speedSimulation(digitalTwinId, simulationId, speed);
	}
	deleteSimulation(digitalTwinId: string, simulationId: string) {
		return this.parcelsRepository.deleteSimulation(digitalTwinId, simulationId);
	}
}

export default DigitalTwinsService;
