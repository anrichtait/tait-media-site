<script lang="ts">
import ScrollChevron from "$lib/components/ui/ScrollChevron.svelte";

interface Props {
    title?: string;
    subtitle?: string;
    media?: Array<string>;
    nextSectionId?: string;
}

let {
    title = "Welcome to Tait Media Solutions",
    subtitle = "Marketing Agency",
    media,
    nextSectionId = "#about-tagline"
}: Props = $props();

</script>

<section class="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <ScrollChevron 
            target={nextSectionId}
            size="w-8 h-8"
            strokeWidth={2}
        />
    </div>
</section>

<style>
.hero {

}

</style>
