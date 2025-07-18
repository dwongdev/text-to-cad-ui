<script lang="ts">
	import { page } from '$app/stores'
	import { paths } from '$lib/paths'
	import { Canvas } from '@threlte/core'
	import LogoMLephant from 'components/LogoMLephant.svelte'
	import ModelViewer from 'components/ModelViewer.svelte'

	const examples = [
		{
			prompt: 'a spur gear with 13 teeth',
			model: '/models/spur-gear.gltf'
		}
	]
</script>

<main class="mx-2 md:mx-5 lg:mx-auto min-h-screen flex items-center" style="min-height: 100dvh">
	<section class="mx-auto max-w-5xl flex-1">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch min-h-[33vh]">
			<h1 class="md:col-span-2 text-5xl md:text-7xl py-6 md:py-12 self-center px-2 md:px-4">
				Text-to-CAD <span class="text-green">Generator</span>
			</h1>
			<div
				class="z-10 relative border md:border-b-0 md:col-span-1 min-h-[25vh] flex items-center justify-center"
			>
				<div
					class="animate-reveal opacity-80 md:opacity-100 w-full h-full flex items-center justify-center"
					style={`--delay-steps: ${examples[0].prompt.length}`}
				>
					<Canvas>
						<ModelViewer dataUrl={examples[0].model} pausable={false} />
					</Canvas>
				</div>
			</div>
			<div
				class="w-full flex items-center justify-start md:col-span-3 text-lg md:text-4xl font-mono border py-4 px-2 md:px-6"
			>
				<div
					class="typing-animation block text-chalkboard-70 dark:text-chalkboard-50"
					style={`--steps: ${examples[0].prompt.length}`}
				>
					<div class="block w-fit">{examples[0].prompt}&nbsp;</div>
				</div>
			</div>
			<div class="md:col-span-3 flex flex-col md:flex-row items-center border border-t-0">
				<p
					class="flex-1 pl-2 md:pl-4 py-2 text-chalkboard-80 dark:text-chalkboard-30 tracking-wider"
				>
					Create B-Rep CAD files and meshes from natural language prompts.{' '}<br />Powered by the
					<a
						href="https://zoo.dev/machine-learning-api"
						target="_blank"
						rel="noopener noreferrer"
						class="bg-chalkboard-120 rounded-sm dark:bg-transparent pt-0.5"
						><LogoMLephant
							className="h-[0.8em] text-green mx-[0.5ch] inline-block align-baseline"
						/><span class="sr-only">ML-ephant</span></a
					>
					API from <a href="https://zoo.dev" target="_blank" rel="noopener noreferrer">Zoo</a>.
				</p>
				<a
					href={paths.SIGN_IN($page.url.origin.concat(paths.SUCCESS))}
					class="self-stretch uppercase tracking-[1px] flex items-center justify-center text-center bg-green px-2 md:px-4 py-2 dark:bg-green dark:text-chalkboard-120 border-0 border-t md:border-t-0 md:border-l font-mono hover:hue-rotate-15"
					>Sign in to get started</a
				>
			</div>
		</div>
	</section>
</main>

<style lang="postcss">
	section {
		--step-timing: 0.08s;
	}

	.typing-animation {
		position: relative;
		overflow: hidden; /* Ensures the content is not revealed until the animation */
		white-space: nowrap; /* Keeps the content on a single line */
		width: max-content;
	}

	.typing-animation::before {
		content: '';
		position: absolute;
		@apply bg-white dark:bg-chalkboard-120;
		@apply absolute inset-0;
		--_final-width: 100%;
		animation: typewriter calc(var(--step-timing) * calc(var(--steps, 20) - 1))
			steps(var(--steps, 20), end) forwards;
	}

	.typing-animation::after {
		content: '';
		@apply absolute inset-y-0;
		right: -1ch;
		left: 1ch;
		border-left: solid 1ch;
		@apply border-l-green dark:border-l-green;
		--_final-width: calc(100% - 1ch);
		animation: typewriter calc(var(--step-timing) * calc(var(--steps, 20) - 1))
				steps(var(--steps, 20), end) forwards,
			blink-caret 0.85s step-end infinite;
	}

	@keyframes typewriter {
		to {
			left: var(--_final-width, 0px);
		}
	}

	@keyframes blink-caret {
		50% {
			border-color: transparent;
		}
	}

	.animate-reveal {
		translate: 0 12px;
		opacity: 0;
		animation: reveal 0.8s calc(var(--step-timing) * calc(var(--steps, 20) + 8)) ease-out forwards;
	}

	@keyframes reveal {
		to {
			translate: 0 0;
			opacity: 1;
		}
	}
</style>
