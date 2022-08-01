import DataTable from "react-data-table-component";

type Props = {};

export const CharsTable = () => {
  const columns = [
    {
      name: "Nombre",
      selector: "name",
      sortable: true,
      grow: 2,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
      hide: "sm",
    },
    {
      name: "Website",
      selector: "website",
      sortable: true,
    },
    {
      name: "Company",
      selector: "company.name",
      sortable: true,
      hide: "md",
    },
    {
      name: "City",
      selector: "address.city",
      sortable: true,
      hide: "md",
    },
    {
      name: "Buttons",
      button: true,
    },
  ];

  const data = [
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Lebsackbury",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496",
        },
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "Romaguera-Crona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets",
      },
      showButtons: true,
    },
    {
      id: 2,
      name: "Ervin Howell",
      username: "Antonette",
      email: "Shanna@melissa.tv",
      address: {
        street: "Victor Plains",
        suite: "Suite 879",
        city: "Wisokyburgh",
        zipcode: "90566-7771",
        geo: {
          lat: "-43.9509",
          lng: "-34.4618",
        },
      },
      phone: "010-692-6593 x09125",
      website: "anastasia.net",
      company: {
        name: "Deckow-Crist",
        catchPhrase: "Proactive didactic contingency",
        bs: "synergize scalable supply-chains",
      },
      showButtons: true,
    },
    {
      id: 3,
      name: "Clementine Bauch",
      username: "Samantha",
      email: "Nathan@yesenia.net",
      address: {
        street: "Douglas Extension",
        suite: "Suite 847",
        city: "McKenziehaven",
        zipcode: "59590-4157",
        geo: {
          lat: "-68.6102",
          lng: "-47.0653",
        },
      },
      phone: "1-463-123-4447",
      website: "ramiro.info",
      company: {
        name: "Romaguera-Jacobson",
        catchPhrase: "Face to face bifurcated interface",
        bs: "e-enable strategic applications",
      },
      showButtons: false,
    },
    {
      id: 4,
      name: "Patricia Lebsack",
      username: "Karianne",
      email: "Julianne.OConner@kory.org",
      address: {
        street: "Hoeger Mall",
        suite: "Apt. 692",
        city: "South Elvis",
        zipcode: "53919-4257",
        geo: {
          lat: "29.4572",
          lng: "-164.2990",
        },
      },
      phone: "493-170-9623 x156",
      website: "kale.biz",
      company: {
        name: "Robel-Corkery",
        catchPhrase: "Multi-tiered zero tolerance productivity",
        bs: "transition cutting-edge web services",
      },
      showButtons: true,
    },
  ];

  return (
    <div className="reveal-from-right mb-16">
      <DataTable
        customStyles={{
          tableWrapper: {
            style: {
              opacity: 0.7,
            },
          },
          responsiveWrapper: {
            style: {
              borderRadius: 8,
            },
          },
        }}
        columns={columns as any}
        data={data}
      />
    </div>
  );
};
