<script>
  import { fade } from "svelte/transition";
  import { params } from "../data/stores.js";
  import Button from "./Button.svelte";

  export let folder = "";
  export let component = "";
  export let name = "";
  export let category = "input-only";
  export let type = "Boolean";
  export let isList = false;
  export let onSave;
  export let onDelete;

  let old = name;
  const types = [
    "Boolean",
    "Connected System",
    "Decimal",
    "Integer",
    "Text",
    "Dictionary",
    "Variant"
  ];
  const categories = ["input-only", "input-output", "event"];

  function handleDelete() {
    fetch(`/projects/${folder}/components/${component}/params/${old}.json`, {
      method: "DELETE"
    })
      .then(r => r.json())
      .then(onDelete);
  }

  function handleSave(e) {
    e.preventDefault();
    fetch(
      `/projects/${folder}/components/${component}/params/${
        old ? old : name
      }.json`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, type, isList })
      }
    )
      .then(r => r.json())
      .then(r => {
        old = name;
        return r;
      })
      .then(onSave);
  }
</script>

<style>
  .is-flex {
    justify-content: flex-start;
    align-items: center;
  }
</style>

<form class="box">
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field">
        <label class="label">Name</label>
        <p class="control">
          <input class="input" type="text" bind:value={name} required />
        </p>
      </div>
      <div class="field">
        <label class="label">Category</label>
        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select bind:value={category} required>
              {#each categories as category}
                <option>{category}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="columns">
    <div class="column is-3">
      <div class="field">
        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select bind:value={type} required>
              {#each types as type}
                <option>{type}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
    </div>
    {#if type !== 'Connected System'}
      <div class="column is-3 is-flex" transition:fade>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" bind:checked={isList} />
              Is a list
            </label>
          </div>
        </div>
      </div>
    {/if}
    <div class="column">
      <div class="buttons is-pulled-right">
        {#if !!onDelete}
          <Button color="danger" onClick={handleDelete}>Delete</Button>
        {/if}
        <Button type="submit" onClick={handleSave} color="primary">Save</Button>
      </div>
    </div>
  </div>
</form>
