<script context="module">
  export async function preload(page, session) {
    const { folder } = page.params;
    const xml = await this.fetch(`/projects/${folder}.json`)
      .then(r => r.json())
      .then(x => x);
    return { folder, xml };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { projects, components } from "../../data/stores";
  import ProjectDetails from "../../components/ProjectDetails.svelte";
  import Component from "../../components/Component.svelte";
  import Button from "../../components/Button.svelte";
  import Modal from "../../components/Modal.svelte";
  import Layout from "../../components/Layout.svelte";
  import Release from "../../components/Release.svelte";

  export let xml;
  export let folder;
  let open = false;
  let deploy = false;
  onMount(() => components.update(folder));
</script>

<Layout {folder} project={folder}>
  <div class="field is-grouped is-grouped-right">
    <p class="control">
      <Button
        color="warning"
        right
        onClick={() => {
          deploy = true;
        }}>
        Deploy
      </Button>
    </p>
  </div>
  <ProjectDetails
    readonly={true}
    onSave={projects.update}
    {folder}
    name={xml.name}
    key={xml.key}
    description={xml.description}
    companyName={xml.companyName}
    companyUrl={xml.companyUrl}
    supported={xml.supported}
    supportEmail={xml.supportEmail}
    supportUrl={xml.supportUrl} />
  <div class="columns is-mobile">
    <div class="column">
      <h1 class="subtitle">Components</h1>
    </div>
    <div class="column">
      <Button
        right
        color="link"
        onClick={() => {
          open = true;
        }}>
        New Component
      </Button>
    </div>
  </div>
  {#each $components as comp}
    <Component
      {folder}
      readonly={true}
      name={comp.name}
      agents={comp.agents}
      onDelete={components.update} />
  {/each}
</Layout>

<Modal bind:open>
  <Component
    {folder}
    readonly={false}
    onSave={folder => {
      open = false;
      components.update(folder);
    }} />
</Modal>

<Modal bind:open={deploy}>
  <Release components={$components} {folder} />
</Modal>
