<script>
	import { onMount } from 'svelte';

	/** @type {{ id: number, name: string }[]} */
	let games = $state([]);

	onMount(async () => {
		const response = await fetch('/api/games');
		games = await response.json();
	});
</script>

<ul>
	{#each games as game (game.id)}
		<li>{game.name}</li>
	{/each}
</ul>

<style></style>
