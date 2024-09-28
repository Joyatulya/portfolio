<script lang="ts">
	import AcademicComponent from './AcademicComponent.svelte';
	import GithubRepoComponent from './GithubRepoComponent.svelte';
</script>

<main>
	<AcademicComponent />
	<GithubRepoComponent />
</main>

<style>
	#orb {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 150px;
		height: 150px;
		background: radial-gradient(
			circle,
			rgba(255, 255, 255, 1) 0%,
			rgba(0, 123, 255, 1) 60%,
			rgba(0, 123, 255, 0.7) 100%
		);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		animation: float 5s ease-in-out infinite alternate;
		box-shadow: 0px 0px 100px 10px rgba(0, 123, 255, 0.6);
		z-index: -10;
		filter: blur(60px);
	}
	/* Float Animation */
@keyframes float {
    0% {
        transform: translate(-50vw, -50vh) translateY(0);
    }
    50% {
        transform: translate(-50%, -50%) translateY(-30px);
    }
    100% {
        transform: translate(+30vw, +30vh) translateY(0);
    }
}
</style>
