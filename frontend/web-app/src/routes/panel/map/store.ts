import { writable } from 'svelte/store';

type mapStoreType = {
	flyToCoords: (coords: number[][]) => void;
	centerMap: () => void;
};

const mapStore = writable<mapStoreType>({
	flyToCoords: (coords: number[][]) => {
		throw new Error('flyToCoords not implemented');
	},
	centerMap: () => {
		throw new Error('centerMap not implemented');
	}
});

export default mapStore;
