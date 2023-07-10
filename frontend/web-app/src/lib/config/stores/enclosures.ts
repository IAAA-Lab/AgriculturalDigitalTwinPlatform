//Svelte store for the selected enclosure
import type { Enclosure } from '$lib/core/Domain';
import { writable } from 'svelte/store';

export const selectedEnclosure = writable<string>('---');
export const userEnclosures = writable<Enclosure[]>([]);
