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
		label: 'Configuración',
		path: '/panel/settings',
		icon: `<i class="fi fi-rr-settings" />`
	}
];

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export { tabs, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };
