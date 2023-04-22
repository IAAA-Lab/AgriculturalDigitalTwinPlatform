<script lang="ts">
	import { landingService } from '$lib/core/services/landing.service';
	const sendEmail = (e: any) => {
		landingService.emailSender(e.target.name.value, e.target.email.value, e.target.message.value);
	};
</script>

<section id="contact">
	<div class="container-xs">
		<h2 class="mb-16 reveal-from-bottom" data-reveal-delay="100">Contacta con nosotros</h2>
		<p class="m-0">
			El grupo IAAA Lab está detrás del proyecto GEDEFEC con el objetivo de ayudar a la
			digitalización del sector agropecuario.
		</p>
	</div>
	<div class="contact-card reveal-from-bottom" data-reveal-delay="50">
		<div class="contact-card-info">
			<img src={'/logo.svg'} alt="GEDEFEC" width={90} />
			<br />
			<p class="text-sm m-0">gedefec@unizar.es</p>
		</div>
		<div class="contact-card-mail">
			<h4>Envíanos un mensaje</h4>
			<form class="form-group" on:submit|preventDefault={sendEmail}>
				<input class="text-xs" required name="name" placeholder="Nombre" />
				<input class="text-xs" required name="email" type="email" placeholder="Email" />
				<textarea class="text-xs" required name="message" placeholder="Mensaje..." />
				<button type="submit"> Enviar </button>
			</form>
		</div>
	</div>
</section>

<style lang="scss">
	section {
		display: grid;
		place-items: center;
		margin-bottom: 7rem;
		margin-top: 3rem;
		padding: 0 0.5rem;
		text-align: center;
	}

	.contact-card {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		border-radius: 6px;
		background-color: color-bg(body);
		border: 2px solid rgb(192, 192, 192);
		box-shadow: color-bg(shadow-light);
		padding: 0.5rem;
		max-width: 800px;
		margin-top: 2rem;

		.contact-card-info {
			flex: 1;
			border-radius: 6px;
			border: 2px solid color(primary);
			background-color: white;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 1rem;
			width: 100%;
		}

		.contact-card-mail {
			flex: 2;
			min-width: 200px;
			form {
				input,
				textarea {
					width: 100%;
					margin-bottom: 1rem;
				}
				textarea {
					height: 150px;
				}
				button {
					float: right;
				}
			}
		}
	}
</style>
