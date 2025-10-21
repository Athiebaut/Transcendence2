export default function renderLogin(): string {
return `
<div class="flex flex-col h-full w-1/2 justify-center items-center  text-center text-secondary text-4xl font-secondary p-10">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-60">
  	<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17
	.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
	</svg>
	<div class="flex text-6xl justify-center">LOGIN</div>
	<form id="formLogin" class="flex flex-col w-full space-y-4 mt-10">
		<div class="flex flex-col text-xl justify-start items-start space-y-2">
			<label for="username" class="text-secondary">Username</label>
			<input name="username" type="text" placeholder="Username" class="w-full p-2 border border-gray" required>
		</div>
		<div class="flex flex-col text-xl justify-start items-start space-y-2">
			<label for="password" class="text-secondary">Password</label>
			<input name="password" type="password" placeholder="Password" class="w-full p-2 border border-gray" required>
		</div>
		<button type="submit" class="bg-secondary text-black rounded-lg p-2 hover:scale-105 transition-transform duration-300 ease-in-out">Login</button>
	</form>
	<div class="flex text-xl mt-10 cursor-pointer text-secondary">
		Don't have an account?
		<div id="toRegister" class="flex ml-2 underline hover:text-primary"	> Register here.</div>
	</div>
	</div>
</div>`;
}