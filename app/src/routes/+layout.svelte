<script>
	import Header from './Header.svelte';
	import { page } from '$app/state';
	import favicon from '#lib/assets/favicon.ico';
	import { onMount } from 'svelte';
	import { supabase } from '#lib/supabaseClient.js';

	import './layout.css';

	let user = $state(null);

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_event, session) => {
			user = session?.user ?? null;
		});

		supabase.auth.getUser().then(({ data, error }) => {
			if (!error) {
				user = data.user;
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if page.url.pathname != '/login'}
	<Header />
	{#if user}
		<h1>Welcome back, {user.email}</h1>
	{:else}
		<h1>Welcome to the Oasis!</h1>
	{/if}
{/if}

<main>
	{@render children()}
</main>

<style></style>
