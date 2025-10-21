import renderHome from '../pages/Home';
import renderLogin from '../pages/Login';
import renderRegister from '../pages/Register';
import renderDashboard from '../pages/Dashboard';
import renderPong from '../pages/Pong';

import { renderErrorPage } from './render_error';

import { addAllEventListeners } from '../events/add_all_events';
import { addToHistory } from '../main';

const main_container: HTMLElement | null = document.getElementById('app');

export const publicRenderers : { [key: string]: () => string } = {
	'home': renderHome,
	'login': renderLogin,
	'register': renderRegister,
	'dashboard': renderDashboard,
	'pong' : renderPong,
};

export function renderPublic(page : string) {
	if(!main_container) return;
	const tmp = publicRenderers[page];
	if(!tmp)
		return renderErrorPage(404);

	addToHistory(page);
	main_container.innerHTML = tmp();
	addAllEventListeners(main_container as HTMLDivElement);
	return;
}