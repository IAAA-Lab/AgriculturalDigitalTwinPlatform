//Svelte store for the selected enclosure
import { writable } from "svelte/store";

export const selectedEnclosure = writable<string>(null);
export const listOfEnclosures = writable<string[]>(null);
