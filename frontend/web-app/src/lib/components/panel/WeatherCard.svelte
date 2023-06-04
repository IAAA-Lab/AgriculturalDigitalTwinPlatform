<div class={`card ${$$props.class}`}>
	<slot name="header" />
	<slot name="body" />
</div>

<style>
	div {
		background: #ccdbf0;
		border: 2px solid #ffffff;
		border-radius: 10px;
		padding: 15px;
	}
</style>
