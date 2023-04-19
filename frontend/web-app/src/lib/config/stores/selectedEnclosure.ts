//Svelte store for the selected enclosure
import { writable } from 'svelte/store';

export const selectedEnclosure = writable<string>('---');
export const listOfEnclosures = writable<string[]>([]);
