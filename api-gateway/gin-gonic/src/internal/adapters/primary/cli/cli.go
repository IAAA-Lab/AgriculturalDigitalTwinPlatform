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
					Name:    "asign",
					Usage:   "Asign a enclosure to a user",
					Aliases: []string{"a"},
					Flags: []cli.Flag{
						cli.StringFlag{
							Name:  "email",
							Usage: "Email of the user",
						},
						cli.StringFlag{
							Name:  "enclosure-list",
							Usage: "List of enclosures to asign separated by commas",
						},
					},
					Action: func(c *cli.Context) error {
						email := c.String("email")
						enclosureList := c.String("enclosure-list")
						if email == "" || enclosureList == "" {
							return fmt.Errorf("email and enclosure-list are required")
						}
						exists := regexp.MustCompile(`^([0-9]{1,5}-[0-9]{1,5}-[0-9]{1,5}-[0-9]{1,5}-[0-9]{1,5}-[0-9]{1,5}-[0-9]{1,5},?)+$`).MatchString(enclosureList)
						if !exists {
							return fmt.Errorf("enclosure-list must be in format: 120-93-72-0-0-2324-1, 120-93-72-0-0-2324-2, 120-93-72-0-0-2324-3")
						}
						enclosureListSplitted := strings.Split(enclosureList, ",")
						return userssrv.PostEnclosure(email, enclosureListSplitted)
					},
				},
				{
					Name:    "unasign",
					Usage:   "Unasign a enclosure to a user",
					Aliases: []string{"u"},
					Flags: []cli.Flag{
						cli.StringFlag{
							Name:  "email",
							Usage: "Email of the user",
						},
						cli.StringFlag{
							Name:  "enclosure-list",
							Usage: "List of enclosures to unasign",
						},
					},
					Action: func(c *cli.Context) error {
						email := c.String("email")
						enclosureList := c.String("enclosure-list")
						if email == "" || enclosureList == "" {
							return fmt.Errorf("email and enclosure-list are required")
						}
						return nil
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
