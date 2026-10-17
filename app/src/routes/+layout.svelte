<script>
	import Header from './Header.svelte';
	import { page } from '$app/state';
	import favicon from '#lib/assets/favicon.ico';

	import './layout.css';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if page.url.pathname != '/login'}
	<Header />
{/if}

<main>
	{@render children()}
</main>

<style></style>
