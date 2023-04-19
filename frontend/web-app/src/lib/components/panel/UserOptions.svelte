<script>
	import { userService } from '$lib/config/config';
	import { user } from '$lib/config/stores/user';
	import Dropdown from '../misc/Dropdown.svelte';
</script>

<Dropdown
	items={[
		{
			text: 'Salir',
			action: () => {
				userService.logout().finally(() => {
					window.location.href = '/';
				});
			}
		}
	]}
>
	<i class="fi fi-rr-portrait user-menu" />
	<p class="user-options text-sm m-0">{$user?.name}</p>
</Dropdown>

<style lang="scss">
	.user-options {
		color: color(secondary);
		padding: 5px 10px 5px 10px;
		border-radius: 10px;
		background-color: rgb(255, 225, 215);

		cursor: pointer;
		transition: all 0.2s ease-out;

		&:hover {
			color: grey;
		}
	}

	.user-menu {
		cursor: pointer;
		margin-top: 8px;
		display: none;
	}
</style>
