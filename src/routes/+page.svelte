<script lang="ts">
    import type { PageData } from './$types';
    import Hero from '$lib/components/Hero.svelte';

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Tait Media Solutions - Marketing Agency</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- nav and header included in +layout.svelte. -->
<!-- skip link included in +layout.svelte. -->

<main class="site-main" id="main-content" tabindex="-1">

    <Hero />

    <section class="about-tagline section" aria-label="Short tagline about Tait Media Solutions">
        <h1 class="b-about-tagline"> Tagline </h1>
    </section>

    <section class="Core Services section" aria-labelledby="h-core-services">
        <h1 id="h-core-services"> Core Services</h1>
        <p class="b-core-services"> Web Design </p>
        <p class="b-core-services"> Social Media </p>
        <p class="b-core-services"> Brand Strategy </p>
    </section>

    <section class="our-work section" aria-labelledby="h-our-work">
        <h1 id="h-our-work"> Our Work </h1>
        <p class="b-our-work"> Showcase 1 </p>
        <p class="b-our-work"> Showcase 2 </p>
        <p class="b-our-work"> Showcase 3 </p>
        <p class="b-our-work"> Showcase 4 </p>
    </section>

    <section class="our-process section" aria-labelledby="h-our-process">
        <h1 id="h-our-process"> Our Process </h1>
        <p class="b-our-process"> Phase 1 </p>
        <p class="b-our-process"> Phase 2 </p>
        <p class="b-our-process"> Phase 3 </p>
    </section>

    <section class="our-brands section" aria-labelledby="h-our-brands">
        <h1 id="h-our-brands "> Brands We Work With </h1>
        <p class="b-our-brands"> Brand 1 Logo </p>
        <p class="b-our-brands"> Brand 2 Logo </p>
        <p class="b-our-brands"> Brand 3 Logo </p>
        <p class="b-our-brands"> Brand 4 Logo </p>
    </section>

    <section class="testimonials section" aria-labelledby="h-testimonials">
        <h1 id="h-testimonials"> Testimonials </h1>
        <p class="b-our-brands"> Testimonial 1 </p>
        <p class="b-our-brands"> Testimonial 2 </p>
        <p class="b-our-brands"> Testimonial 3 </p>
    </section>

    <section class="lead-gen section" aria-labelledby="h-lead-gen">
        <h1 id="h-testimonials"> Ready to build something that lasts? </h1>
        <button class="lead-gen-cta"> PROVE IT </button>
    </section>

</main>

<style>
@reference 'tailwindcss';

:root {
    --space-sm: 0.75rem;
    --space-md: 1.5rem;
    --space-lg: 2.5rem;
    --max-width: min(90%, 1200px);
    --wire-color: rgba(59,130,246,0.9);
    --accent: #0ea5e9;
    --text: #0f172a;

    --font-size-base: clamp(1rem, 2.5vw, 1.25rem);
    --font-size-lg: clamp(1.25rem, 4vw, 2rem);
}

:global(html, body){height: 100%}

.site-main {
    @apply flex flex-col gap-8 mx-auto px-4 max-w-7xl box-border;
}

.section {
    @apply grow-1 shrink-1 basis-auto;
}

.section {
    padding-block: var(--space-md);
    box-sizing: border-box;
}
</style>
