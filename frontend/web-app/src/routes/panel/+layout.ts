import { listOfEnclosures } from '$lib/config/stores/selectedEnclosure';

// Because the panel is an SPA application, we need to disable SSR for it
export const ssr = false;

listOfEnclosures.set([
	'50-68-0-0-6-54-2',
	'50-99-0-0-1-43-2',
	'50-99-0-0-2-190-1',
	'50-230-0-0-10-447-2',
	'50-99-0-0-20-1182-1'
]);
