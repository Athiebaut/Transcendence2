import { renderPublic } from '../renderers/render_public';
import { loginUser } from '../user/login';

export const clickEvent : { [key: string]: (event: MouseEvent) => void } = {
	'toLogin': () => { renderPublic('login'); },
	'toRegister': () => { renderPublic('register'); },
	'toPong': () => { renderPublic('pong'); }
};

export const submitEvent : { [key: string]: (target: HTMLFormElement) => void } = {
	'formLogin': (target) => { loginUser(target); },
};


export function addAllEventListeners(container: HTMLDivElement) {

	container.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;

		if (target.id in clickEvent) {
			clickEvent[target.id](event);
		}

	});
	container.addEventListener('submit', (event) => {
		const div = event.target as HTMLFormElement;

		if (div.id in submitEvent) {
			submitEvent[div.id](div);
		}

	});

	const gameCanvas = container.querySelector('#gameCanvas');
		if (gameCanvas) {
		setTimeout(() => {
			import('../pages/Pong').then(module => {
				module.initPongGame();
			});
		}, 100);
	}
}