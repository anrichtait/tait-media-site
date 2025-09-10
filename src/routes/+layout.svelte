<script lang="ts">
    import '../app.css';
    import { page } from '$app/stores';
    import type { LayoutData } from './$types';
    import Header from '$lib/components/Header.svelte';
    
    let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<a class="skip-link" href="#main-content">Skip to content</a>

<Header />

<main class="pt-16 min-h-screen">
    {@render children?.()}
</main>
