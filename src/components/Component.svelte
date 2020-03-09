<script>
  import ComponentForm from "./CompForm.svelte";

  export let readonly = true;
  export let folder = "";
  export let name = "";
  export let agents = "chrome firefox ie11 edge safari mobile";
  export let onDelete;
  export let onSave;
  let old = name;

  function handleDelete() {
    fetch(`/projects/${folder}/components/${old}.json`, {
      method: "DELETE"
    })
      .then(r => r.json())
      .then(onDelete);
  }

  function handleSave() {
    fetch(`/projects/${folder}/components/${old ? old : name}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        agents
      })
    })
      .then(r => r.json())
      .then(r => {
        old = name;
        return r;
      })
      .then(onSave);
  }
</script>

<style>
  .column.is-1.is-flex {
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>

<div class="box">
  <div class="columns">
    <div class="column is-11">
      {#if readonly}
        <a href={`/projects/${folder}/components/${name}`}>
          <ComponentForm bind:name bind:agents {readonly} />
        </a>
      {:else}
        <ComponentForm bind:name bind:agents {readonly} />
      {/if}
    </div>
    <div class="column is-1 is-flex">
      <span
        class={`icon is-large ${readonly ? 'has-text-danger' : 'has-text-success'}`}
        aria-label={readonly ? 'delete' : 'save'}
        tabindex="0"
        on:click={readonly ? handleDelete : handleSave}>
        <i class={`fas fa-3x ${readonly ? 'fa-trash' : 'fa-save'}`} />
      </span>
    </div>
  </div>
</div>
