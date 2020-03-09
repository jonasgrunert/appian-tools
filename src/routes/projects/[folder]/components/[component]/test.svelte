<script context="module">
  export async function preload(page, session) {
    const { folder, component } = page.params;
    const xml = await this.fetch(
      `/projects/${folder}/components/${component}/params.json`
    )
      .then(r => r.json())
      .then(x => x);
    return { folder, component, xml };
  }
</script>

<script>
  import { onMount } from "svelte";
  import Button from "../../../../../components/Button.svelte";
  import Input from "../../../../../components/ParamInput.svelte";
  import Layout from "../../../../../components/Layout.svelte";
  import Appian from "../../../../../data/appianMock";

  export let xml;
  export let folder;
  export let component;
  let loaded = false;
  let params = xml.map(x => ({ ...x, value: x.isList ? [] : "" }));
  let onNewValue;
  let validations = [];
  onMount(() => {
    fetch(`/projects/${folder}/components/${component}/test.json`).then(() => {
      loaded = true;
    });
    window.Appian = {
      ...Appian,
      Component: {
        onNewValue: cb => {
          onNewValue = cb;
        },
        saveValue: (param, value) => {
          params = params.map(p => (p.name === param ? { ...p, value } : p));
        },
        setValidations: messages => {
          validations = messages;
        }
      }
    };
  });
  function getValues() {
    const values = params.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.name]:
          curr.type === "Dictionary" ? JSON.parse(curr.value) : curr.value
      };
    }, {});
    onNewValue(values);
  }
</script>

<style>
  .is-flex {
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>

<Layout {folder} project={folder} {component}>
  <div class="columns">
    <div class="column is-3 box">
      <h1 class="title">Parameters</h1>
      {#each params as param, x}
        <h3 class="subtitle">{param.name}</h3>
        {#if param.isList}
          <Button
            color="link"
            onClick={() => {
              params = params.map((p, idx) =>
                idx === x ? { ...p, value: [...p.value, ''] } : p
              );
            }}>
            Add Item
          </Button>
          {#each param.value as v, i}
            <div class="columns">
              <div class="column is-8">
                <Input
                  bind:value={v}
                  type={param.type}
                  name={`${param.name}${i}`} />
              </div>
              <div class="column is-flex">
                <span
                  class="icon has-text-danger"
                  aria-label="remove"
                  tabindex="0"
                  on:click={() => {
                    params = params.map((p, idx) =>
                      idx === x
                        ? { ...p, value: p.value.filter((_, ix) => ix !== i) }
                        : p
                    );
                  }}>
                  <i class="fas fa-times" />
                </span>
              </div>
            </div>
          {/each}
        {:else}
          <Input bind:value={param.value} type={param.type} name={param.name} />
        {/if}
      {/each}
      <Button color="info" onClick={getValues}>Save Values</Button>
    </div>
    <div class="column">
      <div class="notification is-warning">
        {#if validations.length === 0}
          Currently no validations. Setting them will make them appear here!
        {:else}
          {#each validations as val}
            <p>{val}</p>
          {/each}
        {/if}
      </div>
      {#if loaded}
        <iframe src="/index.html" title="Appian Component" />
      {:else}Init....{/if}
    </div>
  </div>
</Layout>
