<script lang="ts">
  import { fly, scale } from 'svelte/transition';
  import { X, Menu, Facebook, Instagram, Twitter } from '@lucide/svelte';

  let drawerOpen = false;
  let logoHover = false;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/work', label: 'Our Work' },
    { href: '/contact', label: 'Contact Us' }
  ];

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && drawerOpen) drawerOpen = false;
  };
</script>

<nav class="fixed top-0 left-0 w-full z-[60] bg-transparent" on:keydown={onKeydown} tabindex="-1">
  <div class="container mx-auto px-4 relative flex items-center justify-between h-16">

    <a
      href="/"
      class="flex items-center space-x-3 group z-30"
      on:mouseenter={() => (logoHover = true)}
      on:mouseleave={() => (logoHover = false)}
      aria-label="Tait Media Solutions"
    >
      {#if !logoHover}
        <img src="/blue-logo.png" alt="Tait Media Logo" class="h-10 w-auto transition-transform duration-150 group-hover:scale-105" />
      {:else}
<div class="flex items-center h-12">
  <div class="text-left font-extrabold leading-[1] [font-size:clamp(0.5rem,1vw,0.9rem)]">
    <span class="block">Tait</span>
    <span class="block">Media</span>
    <span class="block">Solutions</span>
  </div>
</div>



      {/if}
    </a>

    <div class="absolute left-1/2 transform -translate-x-1/2 z-40">
      <button
        class="p-2 rounded-lg hover:backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
        on:click={() => (drawerOpen = !drawerOpen)}
        aria-label="Open menu"
        aria-expanded={drawerOpen}
        aria-controls="main-menu"
      >
        {#if !drawerOpen}
          <Menu class="h-6 w-6" />
        {:else}
          <X class="h-6 w-6" />
        {/if}
      </button>
    </div>

    <div class="flex items-center space-x-3 z-30">
      <a href="https://facebook.com" class="group p-2 rounded-md hover:bg-slate-100 transition" aria-label="Facebook">
        <Facebook class="h-5 w-5" />
        <span class="sr-only">Facebook</span>
      </a>
      <a href="https://instagram.com" class="group p-2 rounded-md hover:bg-slate-100 transition" aria-label="Instagram">
        <Instagram class="h-5 w-5" />
        <span class="sr-only">Instagram</span>
      </a>
      <a href="https://twitter.com" class="group p-2 rounded-md hover:bg-slate-100 transition" aria-label="Twitter">
        <Twitter class="h-5 w-5" />
        <span class="sr-only">Twitter</span>
      </a>
    </div>
  </div>

  {#if drawerOpen}
    <div
      class="fixed inset-0 z-[100] backdrop-blur-md bg-white/30"
      on:click={() => (drawerOpen = false)}
      aria-hidden="true"
    ></div>

    <div
      id="main-menu"
      class="fixed left-0 right-0 top-16 z-[200]"
      in:fly={{ y: -8, duration: 220 }}
      out:fly={{ y: -6, duration: 160 }}
      role="menu"
      aria-label="Main full-width menu"
    >
      <div class="">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <ul class="flex flex-col items-center space-y-8">
            {#each links as link}
              <li>
                <a
                  href={link.href}
                  class="block text-5xl md:text-6xl font-extrabold text-center leading-snug py-2 px-4 hover:underline hover:decoration-2 hover:decoration-slate-800/60 focus:outline-none focus:ring-2 focus:ring-slate-300 rounded"
                  on:click={() => (drawerOpen = false)}
                  role="menuitem"
                  tabindex="0"
                >
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  {/if}
</nav>

<style>
</style>
