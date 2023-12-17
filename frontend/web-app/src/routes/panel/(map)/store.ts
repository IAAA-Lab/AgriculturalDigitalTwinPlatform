import type { Enclosure } from '$lib/core/Domain';
import { writable } from 'svelte/store';

type mapStoreType = {
	flyToCoords: (coords: number[][]) => void;
	selectedEnclosure: Enclosure | undefined;
};

const mapStore = writable<mapStoreType>({
	flyToCoords: (coords: number[][]) => {
		throw new Error('flyToCoords not implemented');
	},
	selectedEnclosure: undefined
});

export default mapStore;
