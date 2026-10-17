<script>
	import { onMount } from 'svelte';

	let loading = $state(true);

	/** @type {any} */
	let games = $state([]);

	onMount(async () => {
		const response = await fetch('/api/games');
		games = await response.json();
		loading = false;
	});

	const handleMouseMove = (/** @type {any} */ event) => {
		const card = event.currentTarget;
		const rect = card.getBoundingClientRect();

		const x = (event.clientX - rect.left) / rect.width;
		const y = (event.clientY - rect.top) / rect.height;

		const rotateY = (x - 0.5) * 30;
		const rotateX = (0.5 - y) * 30;

		card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;
	};

	const handleMouseLeave = (/** @type {any} */ event) => {
		event.currentTarget.style.transform = '';
	};
</script>

{#if loading}
	<h2 class="loading-text">Loading games...</h2>
{/if}

<ul>
	{#each games as game (game.id)}
		<li class="game-card" onmousemove={handleMouseMove} onmouseleave={handleMouseLeave}>
			<img src="/images/placeholder.webp" alt="placeholder" />
			<div class="game-info">
				<h2>{game.title}</h2>
				<p class="game-dev">{game.developer} | {game.publisher}</p>
				<p class="release-year">Released: {game.year}</p>
				<p class="game-genre">{game.genres[0]}</p>
			</div>
		</li>
	{/each}
</ul>

<style>
	.loading-text {
		color: var(--eggshell);
		font-size: 2rem;
		padding: 20px;
		text-align: center;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		list-style-type: none;
		gap: 40px;
		justify-content: center;

		li {
			padding: 15px;
			width: 204px;
			height: 350px;
			color: var(--eggshell);
			background-color: var(--smoke);
			border-radius: 10px;
			border: 8px solid var(--amber);
			cursor: pointer;
			transition: transform 0.15s ease-out;
			will-change: transform;

			img {
				width: 100%;
				height: auto;
			}

			.game-info {
				h2 {
					text-align: center;
				}
			}
		}
	}
</style>
