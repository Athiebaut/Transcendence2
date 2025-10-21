import { render404 } from '../pages/404';

const main_container : HTMLElement | null = document.getElementById('app');

export const errorRenderers : { [key: number]: () => string } = {
	404: render404,
}

export function renderErrorPage(page : number) {
	if(!main_container) return;

	const tmp = errorRenderers[page]!();
	main_container.innerHTML = tmp;
	return;
}