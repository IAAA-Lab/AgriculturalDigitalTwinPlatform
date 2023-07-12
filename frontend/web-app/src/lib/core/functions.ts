import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import leaflet from 'leaflet';

// Fixes default icons of markers in leaflet
const fixDefaultLeafletIcons = () => {
	delete leaflet.Icon.Default.prototype._getIconUrl;
	leaflet.Icon.Default.mergeOptions({
		iconUrl: markerIcon,
		iconRetinaUrl: markerIcon2x,
		shadowUrl: markerShadow
	});
};

// Formats a number to a string with a fixed number of decimals
const numberWithCommas = (num?: number | string) => {
	// If number is an string, return it
	if (typeof num === 'string') {
		return num;
	}
	// if num is an integer, return it
	if (Number.isInteger(num)) {
		return num;
	}
	// Also negative numbers and substitue the dot for a comma and the comma for a dot
	return Number(num)
		.toFixed(3)
		.replace('.', ',')
		.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

const markerMapIconByColor = (color: string) => {
	const iconSvg = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="30.000000pt" height="30.000000pt" viewBox="0 0 30.000000 30.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)"
fill="${color}" stroke="#000000" stroke-width="3">
<path d="M98 264 c-30 -16 -58 -61 -58 -94 0 -31 18 -61 60 -100 20 -19 40
-42 43 -50 6 -13 8 -13 14 0 3 8 23 31 43 50 62 58 73 96 45 150 -28 54 -94
74 -147 44z m92 -54 c25 -25 25 -55 0 -80 -11 -11 -29 -20 -40 -20 -26 0 -60
34 -60 60 0 26 34 60 60 60 11 0 29 -9 40 -20z"/>
<path d="M124 185 c-10 -25 4 -47 28 -43 25 4 37 28 14 28 -9 0 -16 7 -16 15
0 8 -5 15 -10 15 -6 0 -13 -7 -16 -15z"/>
</g>
</svg>`;

	return leaflet.icon({
		iconUrl: `data:image/svg+xml,${encodeURIComponent(iconSvg)}`,
		shadowUrl: markerShadow,
		iconSize: [50, 50],
		shadowAnchor: [20, 35],
		shadowSize: [70, 60]
	});
};

const Colors: any = {};
Colors.names = [
	'#FF1102',
	'#288cde',
	'#ffb81f',
	'#D902FF',
	'#000000',
	'#FFFFFF',
	'#02FF9A',
	'#FF0271',
	'#FF9F02',
	'#02FFB1',
	'#FF0202',
	'#96BF6A',
	'#5485A3',
	'#903A7D',
	'#A0A0A0',
	'#FFE26E',
	'#EE9D51'
];

const COLORS_SIZE = Colors.names.length;

const getColor = (index: number): string => {
	return Colors.names[index % COLORS_SIZE];
};

const getIconByCharacteristic = (characteristic: any) => {
	switch (characteristic.name) {
		case 'Lluvia':
			return `<i class="fi fi-rr-raindrops" />`;
		case 'Viento':
			return `<i class="fi fi-rr-wind" />`;
		case 'Temperatura':
			return `<i class="fi fi-rr-temperature-low" />`;
		case 'Humedad':
			return `<i class="fi fi-rr-humidity" />`;
		case 'Regadío':
			return `<i class="fi fi-rr-water" />`;
		case 'Altitud':
			return `<i class="fi fi-rr-elevation" />`;
		case 'Coef. de regadío':
			return `<i class="fi fi-rr-water" />`;
		case 'NDVI medio':
			return `<i class="fi fi-rr-leaf" />`;
		case 'Pendiente':
			return `<i class="fi fi-rr-mountains"></i>`;
		default:
			return `<i class="fi fi-rr-map-marker" />`;
	}
};

const getRangeBarColor = (value: number) => {
	if (value < 0.25) {
		return 'red';
	} else if (value >= 0.25 && value < 0.75) {
		return 'yellow';
	} else {
		return 'green';
	}
};

const getWeatherIcon = (description: string) => {
	//aemet icons
	switch (description) {
		case 'Despejado':
			return `<i class="fi fi-rr-sun" />`;
		case 'Poco nuboso':
		case 'Intervalos nubosos':
			return `<i class="fi fi-rr-cloud-sun" />`;
		case 'Nuboso':
		case 'Cubierto':
		case 'Nubes altas':
		case 'Muy nuboso':
		case 'Nubes bajas':
		case 'Nubes medias':
		case 'Nubes muy bajas':
		case 'Nubes muy medias':
		case 'Nubes muy altas':
		case 'Nubes':
			return `<i class="fi fi-rr-cloud" />`;
		case 'Intervalos nubosos con lluvia':
			return `<i class="fi fi-rr-cloud-rain" />`;
		case 'Intervalos nubosos con lluvia escasa':
			return `<i class="fi fi-rr-cloud-rain" />`;
		case 'Intervalos nubosos con nieve':
			return `<i class="fi fi-rr-cloud-snow" />`;
		case 'Intervalos nubosos con nieve escasa':
			return `<i class="fi fi-rr-cloud-snow" />`;
		case 'Intervalos nubosos con tormenta':
			return `<i class="fi fi-rr-cloud-lightning" />`;
		case 'Intervalos nubosos con tormenta escasa':
			return `<i class="fi fi-rr-cloud-lightning" />`;
		case 'Intervalos nubosos con aguanieve':
			return `<i class="fi fi-rr-cloud-hail" />`;
		case 'Intervalos nubosos con aguanieve escasa':
			return `<i class="fi fi-rr-cloud-hail" />`;
		case 'Intervalos nubosos con lluvia y tormenta':
			return `<i class="fi fi-rr-cloud-lightning" />`;
		case 'Intervalos nubosos con nieve y tormenta':
			return `<i class="fi fi-rr-cloud-lightning" />`;
		case 'Nuboso con lluvia':
			return `<i class="fi fi-rr-cloud-rain" />`;
		case 'Nuboso con lluvia escasa':
			return `<i class="fi fi-rr-cloud-rain" />`;
		case 'Nuboso con tormenta':
		case 'Nuboso con tormenta escasa':
			return `<i class="fi fi-rr-cloud-lightning" />`;
		case 'Nuboso con aguanieve':
		case 'Nuboso con aguanieve escasa':
			return `<i class="fi fi-rr-cloud-hail" />`;
		case 'Nuboso con lluvia y tormenta':
			return `<i class="fi fi-rr-cloud-lightning" />`;
		case 'Nuboso con nieve y tormenta':
			return `<i class="fi fi-rr-cloud-lightning" />`;
		case 'Cubierto con lluvia':
			return `<i class="fi fi-rr-cloud-rain" />`;
		case 'Cubierto con lluvia escasa':
			return `<i class="fi fi-rr-cloud-rain" />`;
		case 'Nuboso con nieve':
		case 'Nuboso con nieve escasa':
		case 'Cubierto con nieve':
		case 'Cubierto con nieve escasa':
			return `<i class="fi fi-rr-cloud-snow" />`;
		case 'Cubierto con aguanieve':
			return `<i class="fi fi-rr-cloud-hail" />`;
		case 'Cubierto con aguanieve escasa':
			return `<i class="fi fi-rr-cloud-hail" />`;
		case 'Cubierto con tormenta':
		case 'Cubierto con tormenta escasa':
		case 'Cubierto con lluvia y tormenta':
		case 'Cubierto con nieve y tormenta':
			return `<i class="fi fi-rr-cloud-lightning" />`;
		case 'Despejado y viento':
			return `<i class="fi fi-rr-sun" />`;
		case 'Despejado y poco viento':
			return `<i class="fi fi-rr-sun" />`;
		case 'Despejado y mucho viento':
			return `<i class="fi fi-rr-sun" />`;
		case 'Niebla ':
		case 'Bruma':
		case 'Calima':
			return `<i class="fi fi-rr-fog" />`;
		default:
			return `<i class="fi fi-rr-cloud" />`;
	}
};

const formattedTime = (time: string) => {
	return time.split('T')[0];
};

const formattedDate = (time: Date) => {
	return time.getDate() + '' + (time.getMonth() + 1) + '/' + time.getFullYear();
};

const onCropImageError = (ev: any) => {
	ev.target.src = 'https://www.iconpacks.net/icons/2/free-plant-icon-1573-thumb.png';
};

export {
	fixDefaultLeafletIcons,
	numberWithCommas,
	markerMapIconByColor,
	getColor,
	getIconByCharacteristic,
	getRangeBarColor,
	formattedDate,
	getWeatherIcon,
	formattedTime,
	onCropImageError
};
