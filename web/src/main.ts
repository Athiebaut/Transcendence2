import { renderPublic } from './renderers/render_public';

export function addToHistory(page: string) {
	if (page !== history.state?.page) {
		const currentPath = window.location.pathname.substring(1) || 'home';
		if (page !== currentPath) {
			history.pushState({ page }, '', `/${page}`);
		}
	}
	// history.pushState({page}, '', `/${page}`);
}

window.addEventListener('DOMContentLoaded', () => {
	const page = window.location.pathname === '/' ? 'home' : window.location.pathname.slice(1);
	//Modifier a l'avenir pour gerer les sessions
	renderPublic(page);
	// history.pushState({page}, '', `/${page}`);
});

window.addEventListener('popstate', (event) => {
	const page = event.state?.page || 'home'
	renderPublic(page);
});