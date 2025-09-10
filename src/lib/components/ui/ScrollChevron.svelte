<script lang="ts">

interface Props {
    target?: string;
    size?: string;
    strokeWidth?: number;
    animationDuration?: string;
}

let {
    target = '#about-tagline',
    size = 'w-7 h-7',
    strokeWidth = 2,
    animationDuration = '1.8s'
}: Props = $props();

function handleClick(): void {
    const targetElement = document.querySelector(target) as HTMLElement | null;

    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        console.warn('Target element "${target}" not found')
    }
}
</script>

<button type="button" 
    aria-label="Scroll down" 
    onclick={handleClick} 
    class="inline-flex items-center justify-center bg-transparent border-0 p-1 cursor-pointer hover:opacity-70 transition-opacity focus:outline-none focus:ring-0" >
    <svg
        class="{size} origin-center animate-bob motion-reduce:animate-none"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="red" 
        stroke-width={strokeWidth}
        stroke-linecap="round" 
        stroke-linejoin="round" 
        aria-hidden="true"
    >
        <path d="M6 9l6 6 6-6"></path>
    </svg>
</button>

<style>
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50%     { transform: translateY(-6px); }
  }

.animate-bob {
      animation: bob var(--animation-duration, 1.8s) ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
    .animate-bob {animation: none !important;}
}

</style>
