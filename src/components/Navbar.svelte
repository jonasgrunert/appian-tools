<script>
  import { projects, components } from "../data/stores";
  export let folder;
  let open;
</script>

<nav
  class="navbar is-fixed-top is-info"
  role="navigation"
  aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">Home</a>
    <span
      role="button"
      class="navbar-burger burger"
      aria-label="menu"
      aria-expanded="false"
      tabindex="0"
      on:click={() => {
        console.log('hi');
        open = !open;
      }}>
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </span>
  </div>
  <div class:is-active={open} class="navbar-menu">
    <div class="navbar-start">
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link" href="/">Projects</a>
        <div class="navbar-dropdown">
          {#each $projects as project}
            <a class="navbar-item" href={`/projects/${project.file.slice(2)}`}>
              {project.name}
            </a>
          {/each}
        </div>
      </div>
    </div>
    {#if folder}
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link has-text-white" href={`/projects/${folder}`}>
          Components
        </a>
        <div class="navbar-dropdown">
          {#each $components as component}
            <a
              class="navbar-item"
              href={`/projects/${folder}/components/${component.name}`}>
              {component.name}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</nav>
