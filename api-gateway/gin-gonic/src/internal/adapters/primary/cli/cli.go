package main

import (
	"digital-twin/main-server/src/internal/adapters/secondary/mongodb"
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/services"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"

	"github.com/urfave/cli"
)

type Role string

func (role Role) IsRoleValid() error {
	switch role {
	case domain.ROLE_ADMIN, domain.ROLE_PRIVATE_ACCESS, domain.ROLE_AGRARIAN:
		return nil
	}
	return fmt.Errorf("role %s is not valid - valid roles are: %s, %s, %s", role, domain.ROLE_ADMIN, domain.ROLE_PRIVATE_ACCESS, domain.ROLE_AGRARIAN)
}

func main() {

	mongoUri := os.Getenv("MONGO_URI")
	mongoDb := os.Getenv("MONGO_DB")
	mongodbRepository := mongodb.NewMongodbConn(mongoUri, mongoDb, 10)
	userssrv := services.NewUsersService(mongodbRepository)
	enclosuresrv := services.NewEnclosuresService(mongodbRepository, nil)

	app := cli.NewApp()
	app.Name = "Cli commands for the project"
	app.Usage = "Some useful cli commands to manage the project"
	app.Commands = []cli.Command{
		// -------- Users --------
		{
			Name:    "users",
			Aliases: []string{"u"},
			Usage:   "Manage users",
			Subcommands: []cli.Command{
				{
					Name:    "create",
					Usage:   "Create a new user",
					Aliases: []string{"c"},
					Flags: []cli.Flag{
						cli.StringFlag{
							Name:  "email",
							Usage: "Email of the user",
						},
						cli.StringFlag{
							Name:  "password",
							Usage: "Password of the user",
						},
						cli.StringFlag{
							Name:  "role",
							Usage: fmt.Sprintf("Role of the user. Valid roles are: %s, %s, %s", domain.ROLE_ADMIN, domain.ROLE_PRIVATE_ACCESS, domain.ROLE_AGRARIAN),
						},
					},
					Action: func(c *cli.Context) error {
						email := c.String("email")
						password := c.String("password")
						role := c.String("role")
						if email == "" || password == "" || role == "" {
							return fmt.Errorf("email, password and role are required")
						}
						roleType := Role(role)
						if err := roleType.IsRoleValid(); err != nil {
							return err
						}
						return userssrv.PostNewUser(domain.User{
							Email:    email,
							Password: password,
							Role:     role,
						})
					},
				},
				{
					Name:    "delete",
					Usage:   "Delete a user",
					Aliases: []string{"d"},
					Flags: []cli.Flag{
						cli.StringFlag{
							Name:  "email",
							Usage: "Email of the user",
						},
					},
					Action: func(c *cli.Context) error {
						email := c.String("email")
						if email == "" {
							return fmt.Errorf("email is required")
						}
						user, err := userssrv.FetchUserByEmail(email)
						if err != nil {
							return err
						}
						return userssrv.DeleteUser(user.ID.Hex())
					},
				},
				{
					Name:    "list",
					Usage:   "List all users",
					Aliases: []string{"l"},
					Action: func(c *cli.Context) error {
						users, err := userssrv.FetchAllUsers()
						if err != nil {
							return err
						}
						fmt.Println("-----------------------")
						for _, user := range users {
							fmt.Println("Email: ", user.Email)
							fmt.Println("Password: ", user.Password)
							fmt.Println("Role: ", user.Role)
							if user.EnclosureIds != nil {
								fmt.Println("Enclosures: ", strings.Join(user.EnclosureIds, ", "))
							}
							fmt.Println("----------------------")
						}
						return nil
					},
				},
				{
					Name:    "add-twin",
					Usage:   "create a digital twin for a user",
					Aliases: []string{"at"},
					Flags: []cli.Flag{
						cli.StringFlag{
							Name:     "email",
							Usage:    "Email of the user",
							Required: true,
						},
						cli.StringFlag{
							Name:     "enclosure-id",
							Usage:    "Enclosure id",
							Required: true,
						},
						cli.StringFlag{
							Name:     "city-id",
							Usage:    "City id",
							Required: true,
						},
						cli.StringFlag{
							Name:     "province-id",
							Usage:    "Province id",
							Required: true,
						},
						cli.StringFlag{
							Name:     "municipality-id",
							Usage:    "Municipality id",
							Required: true,
						},
						cli.StringFlag{
							Name:     "coordinates",
							Usage:    "Coordinates in the format '[[lat, long], ..., [lat, long]]'",
							Required: true,
						},
						cli.StringFlag{
							Name:  "crs",
							Usage: "Coordinate reference system",
						},
						cli.StringFlag{
							Name:     "irrigation-system",
							Usage:    "Irrigation system. Valid values are: 'irrigation', 'rainfed'",
							Required: true,
						},
						cli.StringFlag{
							Name:     "crop",
							Usage:    "Crop name",
							Required: true,
						},
						cli.StringFlag{
							Name:     "crop-id",
							Usage:    "Crop id",
							Required: true,
						},
						cli.StringFlag{
							Name:  "crop-variety",
							Usage: "Crop variety name",
						},
						cli.StringFlag{
							Name:  "area",
							Usage: "Area in hectares",
						},
						cli.StringFlag{
							Name:  "slope",
							Usage: "Slope",
						},
						cli.StringFlag{
							Name:  "number-of-trees",
							Usage: "Number of trees",
						},
						cli.StringFlag{
							Name:  "plantation-date",
							Usage: "Date when the plantation was done. Example: 2021-01-01",
						},
						cli.StringFlag{
							Name:  "parcel-use",
							Usage: "Parcel use. Example: FS, TA, VI, etc.",
						},
					},
					Action: func(c *cli.Context) error {
						email := c.String("email")
						enclosureId := c.String("enclosure-id")
						cityId := c.String("city-id")
						provinceId := c.String("province-id")
						municipalityId := c.String("municipality-id")
						coordinates := c.String("coordinates")
						crs := c.String("crs")
						irrigationSystem := c.String("irrigation-system")
						crop := c.String("crop")
						cropId := c.String("crop-id")
						cropVariety := c.String("crop-variety")
						area := c.String("area")
						slope := c.String("slope")
						numberOfTrees := c.String("number-of-trees")
						plantationDate := c.String("plantation-date")
						parcelUse := c.String("parcel-use")

						// check if the user exists
						user, err := userssrv.FetchUserByEmail(email)
						if err != nil {
							return err
						}

						// if crs is provided, check if it is valid
						if crs != "" {
							// urn:ogc:def:crs:EPSG::4326
							if !strings.HasPrefix(crs, "urn:ogc:def:crs:EPSG::") {
								return fmt.Errorf("crs %s is not valid. Valid crs is urn:ogc:def:crs:EPSG::4326", crs)
							}
						}

						// check if the coordinates are valid
						// Regex: ^\[\[-?\d+(\.\d+)?, -?\d+(\.\d+)?\](, \[-?\d+(\.\d+)?, -?\d+(\.\d+)?\])*\]$
						regex := regexp.MustCompile(`^\[\[-?\d+(\.\d+)?, -?\d+(\.\d+)?\](, \[-?\d+(\.\d+)?, -?\d+(\.\d+)?\])*\]$`)
						if !regex.MatchString(coordinates) {
							return fmt.Errorf("coordinates %s are not valid. Coordinates should be in the format '[[lat, long], ..., [lat, long]]'", coordinates)
						}

						// Check if date is valid
						if plantationDate != "" {
							_, err := domain.ParseDate(plantationDate)
							if err != nil {
								return fmt.Errorf("plantation date %s is not valid. Date should be in the format 'YYYY-MM-DD'", plantationDate)
							}
						}

						// check if the irrigation system is valid
						if irrigationSystem != "irrigation" && irrigationSystem != "rainfed" {
							return fmt.Errorf("irrigation system %s is not valid. Valid values are: 'irrigation', 'rainfed'", irrigationSystem)
						}

						// create the digital twin
						return enclosuresrv.PostNewEnclosure(
							map[string]interface{}{
								"type": "Feature",
								"geometry": map[string]interface{}{
									"type":        "Polygon",
									"coordinates": coordinates,
								},
								"crs": map[string]interface{}{
									"type":       "name",
									"properties": map[string]interface{}{"name": crs},
								},
								"properties": map[string]interface{}{
									"userId":           user.ID.Hex(),
									"enclosureId":      enclosureId,
									"cityId":           cityId,
									"provinceId":       provinceId,
									"municipalityId":   municipalityId,
									"irrigationSystem": irrigationSystem,
									"area":             area,
									"slope":            slope,
									"numberOfTrees":    numberOfTrees,
									"plantationDate":   plantationDate,
									"parcelUse":        parcelUse,
									"crop":             crop,
									"cropId":           cropId,
									"cropVariety":      cropVariety,
								},
							},
						)
					},
				},
			},
		},
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}

	// how to execute the command
	// go run cli.go users create --email="email" --password="password" --role="role"
	// go run cli.go users delete --email="email"
	// go run cli.go users list
}
