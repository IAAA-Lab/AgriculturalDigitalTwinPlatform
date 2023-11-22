const tabs = [
	{
		label: 'Overview',
		path: '/panel',
		icon: `<i class="fi fi-rr-layout-fluid" />`
	},
	{
		label: 'Mapa',
		path: '/panel/map',
		icon: `<i class="fi fi-rr-map" />`
	},
	{
		label: 'Análisis',
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

const tabsInner = [
	{
		label: 'Overview',
		path: '/panel/enclosure',
		icon: `<i class="fi fi-rr-location-alt" />`,
		regex: /\panel\/enclosure\/[^/]+$/
	},
	{
		label: 'Mapa',
		path: '/panel/enclosure/map',
		icon: `<i class="fi fi-rr-map" />`,
		regex: /\panel\/enclosure\/.+\/map/
	},
	{
		label: 'Cultivos',
		path: '/panel/enclosure/crops',
		icon: `<i class="fi fi-rr-wheat" />`,
		regex: /\panel\/enclosure\/.+\/crops/
	},
	{
		label: 'Clima',
		path: '/panel/enclosure/weather',
		icon: `<i class="fi fi-rr-clouds-sun" />`,
		regex: /\panel\/enclosure\/.+\/weather/
	}
];

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const MOBILE_WIDTH = 480;
const TABLET_WIDTH = 640;
const DESKTOP_WIDTH = 820;

export {
	tabs,
	tabsInner,
	MOBILE_WIDTH,
	TABLET_WIDTH,
	DESKTOP_WIDTH,
	ACCESS_TOKEN_KEY,
	REFRESH_TOKEN_KEY
};
