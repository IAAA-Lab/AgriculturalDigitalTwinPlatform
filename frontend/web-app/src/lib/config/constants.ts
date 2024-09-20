const tabs = [
	{
		path: '/panel',
		icon: `<i class="fi fi-rr-map" />`
	},
	{
		path: '/panel/monitoring',
		icon: `<i class="fi fi-rr-eye" />`
	},
	{
		path: '/panel/analysis',
		icon: `<i class="fi fi-rr-chart-pie-alt" />`
	},
	{
		label: 'Simulaciones',
		path: '/panel/simulations',
		icon: `<i class="fi fi-rr-chart-network" />`
	},
	{	
		label: "Actividades",
		path: '/panel/activities',
		icon: `<i class="fi fi-rr-clock" />`
	},
	{
		label: 'Configuración',
		path: '/panel/settings',
		icon: `<i class="fi fi-rr-settings" />`
	},
	{
		label: 'Añadir nuevo gemelo digital',
		path: '/panel/add-digital-twin',
		icon: `<i class="fi fi-rr-plus" />`
	}
];

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export { tabs, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };
