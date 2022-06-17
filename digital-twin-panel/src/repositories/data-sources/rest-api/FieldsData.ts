class FieldRestAPI {
  async getFieldsInArea(areaId: string): Promise<FieldsPerArea> {
    return {
      fields: [
        {
          fieldProfile: {
            id: "1",
            name: "Campos verdes",
            description: "Field 1 description",
            plantType: "Strawberry",
            geoBoundaries: [
              {
                lat: 41.403505,
                lng: -0.52192,
              },
              {
                lat: 41.406801,
                lng: -0.51757,
              },
              {
                lat: 41.405775,
                lng: -0.516451,
              },
              {
                lat: 41.400206,
                lng: -0.517149,
              },
              {
                lat: 41.403505,
                lng: -0.52192,
              },
            ],
            imageUrl:
              "https://images.unsplash.com/photo-1558871585-4c3574a1b7cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmllbGRzfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
          },
          characteristics: [
            {
              name: "Campos activos",
              value: 2,
            },
            {
              name: "Área total",
              value: 734,
              unit: "Ha",
            },
            {
              name: "Temperatura",
              value: 29,
              unit: "°C",
              state: "MAL" as CharacteristicState,
            },
            {
              name: "Plantas en buen estado",
              value: 80,
              unit: "%",
              state: "BIEN" as CharacteristicState,
            },
          ],
          diseases: [],
        },
        {
          fieldProfile: {
            id: "2",
            name: "Campos azules",
            description: "Field 2 description",
            plantType: "Pineapple",
            geoBoundaries: [
              {
                lat: 41.402969,
                lng: -0.516391,
              },
              {
                lat: 41.404265,
                lng: -0.509131,
              },
              {
                lat: 41.402474,
                lng: -0.508525,
              },
              {
                lat: 41.401122,
                lng: -0.516666,
              },
              {
                lat: 41.402969,
                lng: -0.516391,
              },
            ],
            imageUrl:
              "https://previews.123rf.com/images/naramit/naramit1705/naramit170500290/78984435-hermosa-mañana-salida-del-sol-sobre-el-campo-de-ma%C3%ADz.jpg",
          },
          characteristics: [
            {
              name: "Área total",
              value: 234,
              unit: "Ha",
            },
            {
              name: "Presión",
              value: 1003,
              unit: "Pa",
            },
            {
              name: "Temperatura",
              value: 25,
              unit: "°C",
              state: "NA" as CharacteristicState,
            },
            {
              name: "Plantas en buen estado",
              value: 34,
              unit: "%",
              state: "MAL" as CharacteristicState,
            },
          ],
          diseases: [],
        },
      ],
      features: {
        characteristics: [
          {
            name: "Campos activos",
            value: 2,
          },
          {
            name: "Área total",
            value: 734,
            unit: "Ha",
          },
          {
            name: "Temperatura media",
            value: 31,
            unit: "°C",
            state: "MAL" as CharacteristicState,
          },
          {
            name: "Plantas en buen estado",
            value: 80,
            unit: "%",
            state: "BIEN" as CharacteristicState,
          },
        ],
        distinctCharacteristics: [
          "Área total",
          "Presión",
          "Temperatura",
          "Plantas en buen estado",
        ],
      },
    };
  }

  async getField(fieldId: string): Promise<Field> {
    return {
      fieldProfile: {
        id: "1",
        name: "Field 1",
        description: "Field 1 description",
        plantType: "Strawberry",
        geoBoundaries: [
          {
            lat: 41.403505,
            lng: -0.52192,
          },
          {
            lat: 41.406801,
            lng: -0.51757,
          },
          {
            lat: 41.405775,
            lng: -0.516451,
          },
          {
            lat: 41.400206,
            lng: -0.517149,
          },
          {
            lat: 41.403505,
            lng: -0.52192,
          },
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1558871585-4c3574a1b7cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmllbGRzfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
      },
      characteristics: [
        {
          name: "Zonas activas",
          value: 4,
        },
        {
          name: "Campos activos",
          value: 23,
        },
        {
          name: "Área total",
          value: 12344,
          unit: "Ha",
        },
        {
          name: "Plantas en buen estado",
          value: 80,
          unit: "%",
          state: "BIEN" as CharacteristicState,
        },
      ],
      diseases: [
        {
          id: "1",
          name: "Disease 1",
          description: "Disease 1 description",
          startDate: "2020-01-01",
          endDate: "2020-01-01",
        },
        {
          id: "2",
          name: "Disease 2",
          description: "Disease 2 description",
          startDate: "2020-01-01",
          endDate: "2020-01-01",
        },
      ],
    };
  }

  async getAreasByUser(userId: string): Promise<AreasPerUser> {
    return {
      areas: [
        {
          id: "1",
          name: "Area 1",
          geoLocation: {
            lat: 41.403505,
            lng: -0.52192,
          },
          characteristics: [
            {
              name: "Campos activos",
              value: 23,
            },
            {
              name: "Área total",
              value: 10234,
              unit: "Ha",
            },
            {
              name: "Plantas en buen estado",
              value: 72,
              unit: "%",
              state: "MEDIO" as CharacteristicState,
            },
          ],
        },
        {
          id: "2",
          name: "Area 2",
          geoLocation: {
            lat: 41.503505,
            lng: -0.52192,
          },
          characteristics: [
            {
              name: "Área total",
              value: 1234,
              unit: "Ha",
            },
            {
              name: "Plantas en buen estado",
              value: 59,
              unit: "%",
              state: "MAL" as CharacteristicState,
            },
          ],
        },
      ],

      features: {
        characteristics: [
          {
            name: "Zonas activas",
            value: 6,
          },
          {
            name: "Campos activos",
            value: 33,
          },
          {
            name: "Área total",
            value: 12344,
            unit: "Ha",
          },
          {
            name: "Plantas en buen estado",
            value: 58,
            unit: "%",
            state: "MAL" as CharacteristicState,
          },
        ],
        distinctCharacteristics: [
          "Área total",
          "Campos activos",
          "Plantas en buen estado",
        ],
      },
    };
  }
}

export default FieldRestAPI;
