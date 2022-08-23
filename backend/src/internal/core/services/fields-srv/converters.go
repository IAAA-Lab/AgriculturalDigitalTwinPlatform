package fieldssrv

import (
	"fmt"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"time"
)

func parseEnclosures(srv *service, anyo int, remoteEnclosures domain.EnclosureResponse, parcel *domain.Parcel) {
	for _, x := range remoteEnclosures.Response {
		ndvi := getAvgNDVI(srv, anyo, parcel.Id)
		parcelId := fmt.Sprintf("%d-%d-%d-%d-%d-%d", x.Characteristics.Province, x.Characteristics.County, x.Characteristics.Aggregate, x.Characteristics.Zone, x.Characteristics.Polygon, x.Characteristics.Parcel)
		if parcel.Id != parcelId {
			continue
		}
		var coordinates []domain.Coordinates
		for _, x := range x.Geometry.Coordinates[0] {
			coordinates = append(coordinates, domain.Coordinates{
				Lat: x[1],
				Lng: x[0],
			})
		}
		(*parcel).Historic.Enclosures = append((*parcel).Historic.Enclosures, domain.Enclosure{
			Info: domain.EnclosureInfo{
				Characteristics: []domain.Characteristics{
					{
						Name:  domain.AreaChar.Name,
						Value: x.Characteristics.Area,
						Unit:  domain.AreaChar.Unit,
					},
					{
						Name:  domain.SlopeAvgChar.Name,
						Value: x.Characteristics.SlopeAvg,
						Unit:  domain.SlopeAvgChar.Unit,
					},
					{
						Name:  domain.IrrigationCoefChar.Name,
						Value: x.Characteristics.IrrigationCoef,
						Unit:  domain.IrrigationCoefChar.Unit,
					},
					{
						Name:  domain.PlantsHealth.Name,
						Value: ndvi.Avg * 100,
						Unit:  domain.PlantsHealth.Unit,
					},
				},
				NDVI:        ndvi,
				Coordinates: coordinates,
			},
			ImageUri: "https://images.unsplash.com/photo-1558871585-4c3574a1b7cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmllbGRzfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
			Id:       fmt.Sprintf("%d-%d-%d-%d-%d-%d-%d", x.Characteristics.Province, x.Characteristics.County, x.Characteristics.Aggregate, x.Characteristics.Zone, x.Characteristics.Polygon, x.Characteristics.Parcel, x.Characteristics.Enclosure),
		})
	}

	// Calculate characteristic states
	for j, y := range parcel.Historic.Enclosures {
		for k, z := range y.Info.Characteristics {
			(*parcel).Historic.Enclosures[j].Info.Characteristics[k].State = CharacteristicsStateRules(z)
		}
	}
}

func parseParcels(remoteParcel domain.ParcelResponse, parcels *[]domain.Parcel) {
	for _, x := range remoteParcel.Response {
		*parcels = append(*parcels, domain.Parcel{
			Ts: time.Now(),
			Historic: struct {
				Ts   time.Time "json:\"ts\""
				Info struct {
					Coordinates domain.Coordinates "json:\"coordinates\""
				} "json:\"info\""
				Enclosures []domain.Enclosure "json:\"enclosures\""
			}{
				// Ts: nil,
				Info: struct {
					Coordinates domain.Coordinates "json:\"coordinates\""
				}{
					Coordinates: domain.Coordinates{
						Lat: x.Geometry.Coordinates[1],
						Lng: x.Geometry.Coordinates[0],
					},
				},
			},
			Id: fmt.Sprintf("%d-%d-%d-%d-%d-%d", x.Ids.Province, x.Ids.County, x.Ids.Aggregate, x.Ids.Zone, x.Ids.Polygon, x.Ids.Parcel),
		})

	}
}
