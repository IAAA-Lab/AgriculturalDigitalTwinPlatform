package fieldssrv

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
)

func CharacteristicsStateRules(characteristic domain.Characteristics) domain.StateNames {
	switch characteristic.Name {
	case domain.PlantsHealth.Name:
		switch value := characteristic.Value; {
		case value < 33:
			return domain.Bad
		case value < 66:
			return domain.Medium
		default:
			return domain.Good
		}
	default:
		return ""
	}
}
