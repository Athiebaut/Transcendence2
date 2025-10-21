export default function renderRegister(): string {
	return `
<div class="flex flex-col h-full space-y-10 w-1/2 justify-center items-center text-center text-secondary text-4xl font-secondary p-10">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-60">
  	<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
	</svg>
	<div class="flex text-6xl justify-center">REGISTER</div>
	<form class="flex flex-col w-full space-y-4 mt-10">
		<div class="flex flex-col text-xl justify-start items-start space-y-2">
			<label for="username" class="text-secondary">Username</label>
			<input type="text" placeholder="Username" class="w-full p-2 border border-gray">
		</div>
		<div class="flex flex-col text-xl justify-start items-start space-y-2">
			<label for="email" class="text-secondary">Email</label>
			<input type="email" placeholder="Email" class="w-full p-2 border border-gray">
		</div>
		<div class="flex flex-col text-xl justify-start items-start space-y-2">
			<label for="password" class="text-secondary">Password</label>
			<input type="password" placeholder="Password" class="w-full p-2 border border-gray">
		</div>
		<button type="submit" class="bg-secondary text-black rounded-lg p-2 hover:scale-105 transition-transform duration-300 ease-in-out">Register</button>
	</form>
	<div class="flex text-xl mt-10 cursor-pointer text-secondary">
		Already have an account?
		<div id="toLogin" class="flex ml-2 underline hover:text-primary"> Login here.</div>
	</div>
</div>`;
}