<script lang="ts">
	import { onMount } from 'svelte';
	import * as FilePond from 'filepond';
	import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
	import { API_URL, axiosInstance } from '$lib/config/config';

	export let title = 'Suba sus documentos';
	export let url = '/internal/files/upload';

	$: {
		FilePond.registerPlugin(FilePondPluginFileValidateType);

		const pond = FilePond.create(document.querySelector('input[type="file"]') as HTMLInputElement, {
			allowMultiple: true,
			instantUpload: false,
			allowRevert: false,
			server: {
				url: API_URL,
				process: {
					url: url,
					withCredentials: true
				},
				headers: {
					Authorization: `${axiosInstance.defaults.headers.common['Authorization']}`
				}
			},
			acceptedFileTypes: [
				'application/pdf',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'application/vnd.ms-excel',
				'.csv',
				'application/json'
			],
			fileValidateTypeLabelExpectedTypes: 'Sólo se permiten .xlsx, .csv, .pdf o .json',
			labelFileTypeNotAllowed: 'No se permite este tipo de archivo',
			labelIdle:
				"Arrastra y suelta tus archivos o <span class='filepond--label-action'> Busca archivos </span>",
			labelFileLoading: 'Cargando...',
			labelFileLoadError: 'Error al cargar',
			labelFileProcessing: 'Subiendo...',
			labelFileProcessingComplete: 'Subido',
			labelTapToCancel: 'Pulsa para cancelar'
		});
		// // Check if the filepond element is already in the DOM
		// if (document?.body?.contains(pond.element)) {
		// 	// If so, remove it
		// 	document?.body?.removeChild(pond.element as Node);
		// }
		// document?.body?.appendChild(pond.element as Node);
	}
</script>

<section>
	<div class="container-xs">
		<h3 style="margin: 0;">{title}</h3>
		<br />
		<input
			id="files"
			type="file"
			class="filepond"
			name="files"
			accept="application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/json"
			multiple
			data-allow-reorder="true"
			data-max-file-size="5MB"
			data-max-files="3"
		/>
		<p>Los archivos subidos tienen que estar en formato: .xlsx, .csv, .pdf o .json</p>
	</div>
</section>

<style lang="scss">
	section {
		display: grid;
		place-items: center;
	}

	h3,
	p {
		word-break: normal;
		text-align: center;
	}

	:global {
		.filepond--drop-label {
			color: #262728 !important;
		}

		.filepond--label-action {
			text-decoration-color: #222323;
		}

		.filepond--panel-root {
			border-radius: 2em;
			background-color: #edf0f4;
			height: 1em;
		}

		.filepond--item-panel {
			background-color: #595e68;
		}

		.filepond--drip-blob {
			background-color: #7f8a9a;
		}

		.filepond--item * {
			color: #edf0f4 !important;
		}
	}
</style>
