import { renderPublic } from "../renderers/render_public";	

export function loginUser (form : HTMLFormElement) {
	console.log('Form submitted:', form);
	const formData = new FormData(form);
	const username = formData.get('username');
	const password = formData.get('password');

	console.log('Logging in with', { username, password });
	if (username !== 'ael' || password !== 'coucou') {
		console.error('Username or password is incorrect');
		return;
	}
	localStorage.setItem('username', username as string);
	sessionStorage.setItem('isLoggedIn', 'true');

	const isLoggedIn = sessionStorage.getItem('isLoggedIn');
	if (isLoggedIn === 'true') {
		console.log(`Utilisateur connecté: ${username}`);
		renderPublic('dashboard');
		// Afficher le dashboard
	}

	// Perform login logic here
}

// dashboard a faire afficher l'username etc