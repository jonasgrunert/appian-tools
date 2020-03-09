<script context="module">
  export async function preload(page, session) {
    const { folder, component } = page.params;
    const xml = await this.fetch(
      `/projects/${folder}/components/${component}.json`
    )
      .then(r => r.json())
      .then(x => x);
    return { folder, xml };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { params } from "../../../../data/stores.js";
  import Component from "../../../../components/Component.svelte";
  import Param from "../../../../components/Param.svelte";
  import Button from "../../../../components/Button.svelte";
  import Modal from "../../../../components/Modal.svelte";
  import Layout from "../../../../components/Layout.svelte";

  export let folder = "";
  export let xml = "";
  let open = false;
  onMount(() => params.update({ folder, component: xml.name }));
</script>

<Layout {folder} project={folder} component={xml.name}>
  <Component {folder} name={xml.name} agents={xml.agents} readonly={false} />
  <div class="field is-grouped is-grouped-right">
    <p class="control">
      <a
        href={`/projects/${folder}/components/${xml.name}/test`}
        class="button is-info">
        Test
      </a>
    </p>
  </div>
  <div class="columns is-mobile">
    <div class="column">
      <h1 class="subtitle">Parameters</h1>
    </div>
    <div class="column">
      <Button
        right
        color="link"
        onClick={() => {
          open = true;
        }}>
        Add Parameter
      </Button>
    </div>
  </div>
  {#each $params as parameter}
    <Param
      {...parameter}
      {folder}
      component={xml.name}
      onDelete={params.update}
      onSave={r => {
        open = false;
        params.update(r);
      }} />
  {/each}
</Layout>

<Modal bind:open>
  <Param
    {folder}
    component={xml.name}
    onSave={a => {
      open = false;
      params.update(a);
    }} />
</Modal>
