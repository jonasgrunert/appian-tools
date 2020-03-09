<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";

  import { projects } from "../data/stores";
  import Button from "../components/Button.svelte";
  import Project from "../components/Project.svelte";
  import ProjectDetails from "../components/ProjectDetails.svelte";
  import Modal from "../components/Modal.svelte";
  import Layout from "../components/Layout.svelte";

  let open = false;
  onMount(projects.update);
</script>

<Layout>
  <div class="columns is-mobile">
    <div class="column">
      <h1 class="title">Appian Tools</h1>
    </div>
    <div class="column">
      <Button
        color="link"
        onClick={() => {
          open = true;
        }}
        right>
        New Project
      </Button>
    </div>
  </div>

  <div class="columns is-multiline">
    {#each $projects as p}
      <Project
        key={p.file}
        title={p.name}
        version={p.version}
        onDel={projects.update}>
        {p.description}
      </Project>
    {/each}
  </div>
</Layout>

<Modal bind:open>
  <ProjectDetails
    readonly={false}
    onSave={name => {
      open = false;
      projects.update();
    }} />
</Modal>
