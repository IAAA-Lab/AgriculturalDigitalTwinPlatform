import type { Enclosure } from '$lib/core/Domain';
import { writable } from 'svelte/store';

type mapStoreType = {
	flyToCoords: (coords: number[][]) => void;
	centerMap: () => void;
	selectedEnclosure: Enclosure | undefined;
};

const mapStore = writable<mapStoreType>({
	flyToCoords: (coords: number[][]) => {
		throw new Error('flyToCoords not implemented');
	},
	centerMap: () => {
		throw new Error('centerMap not implemented');
	},
	selectedEnclosure: undefined
});

export default mapStore;
