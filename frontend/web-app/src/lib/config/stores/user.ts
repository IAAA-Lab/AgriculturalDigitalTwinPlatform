import type { User } from '$lib/core/Domain';
import { writable } from 'svelte/store';

export const user = writable<User | null>(null);
