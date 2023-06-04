<script lang="ts">
	import { goto } from '$app/navigation';
	import { userService } from '$lib/config/config';

	const login = ({ target }: any) => {
		const { username, password } = target;
		userService
			.login(username.value, password.value)
			.then((res) => {
				goto('/panel');
			})
			.catch((err) => {
				alert('Usuario o contraseña incorrectos');
			});
	};
</script>

<div class="background">
	<div class="shape" />
	<div class="shape" />
</div>
<section>
	<form id="login-form" on:submit|preventDefault={login}>
		<h1>Iniciar sesión</h1>
		<h3>Panel • GEDEFEC</h3>

		<label for="username">Usuario</label>
		<input class="text-xs" type="text" id="username" required />

		<label for="password">Contraseña</label>
		<input class="text-xs" type="password" id="password" required />

		<button class="button button-primary" type="submit">Acceder</button>
	</form>
</section>

<style lang="scss">
	section {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100%;
	}

	.background {
		width: 30%;
		height: 520px;
		position: absolute;
		transform: translate(-50%, -50%);
		left: 50%;
		top: 50%;
		z-index: -1;
	}

	.background .shape {
		height: 200px;
		width: 200px;
		position: absolute;
		border-radius: 50%;
	}

	.shape:first-child {
		background: linear-gradient(#35d592, #1845ad);
		left: -80px;
		top: -80px;
	}

	.shape:last-child {
		background: linear-gradient(to right, #e7ff2f, #19f093);
		right: -30px;
		bottom: -80px;
	}

	form {
		margin: 1rem;
		max-height: 520px;
		max-width: 400px;
		min-width: 200px;
		width: 100%;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 10px;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 2px solid rgba(255, 255, 255, 0.1);
		box-shadow: color-bg(shadow);
		padding: 2rem 35px;
	}

	label {
		display: block;
		margin-top: 30px;
	}

	input {
		display: block;
		height: 40px;
		width: 100%;
		margin-top: 8px;
	}

	button {
		margin-top: 40px;
		width: 100%;
	}
</style>
