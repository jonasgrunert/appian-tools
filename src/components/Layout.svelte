<script>
  import Navbar from "./Navbar.svelte";
  export let folder = false;
  export let project = false;
  export let component = false;
</script>

<svelte:head>
  <title>
    Appian Tools {project ? `- ${project}` : ''} {component ? `- ${component}` : ''}
  </title>
</svelte:head>
<section class="section">
  <Navbar {folder} />
</section>
<section class="section">
  <div class="container">
    <slot />
  </div>
</section>
