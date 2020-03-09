<script>
  import { fade } from "svelte/transition";
  import Button from "./Button.svelte";

  export let readonly = true;
  export let folder = false;
  export let name = "";
  export let description = "";
  export let key = "";
  export let companyName = "";
  export let companyUrl = "";
  export let supported = false;
  export let supportEmail = "";
  export let supportUrl = "";
  export let onSave;

  function sanitizeName(name) {
    return name.replace(/(-| |_)/g, "");
  }

  function handleClick(e) {
    e.preventDefault();
    if (readonly) return;
    fetch(`/projects/${folder ? folder : sanitizeName(name)}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        key,
        companyName,
        companyUrl,
        supported,
        supportEmail,
        supportUrl
      })
    }).then(r => {
      if (r.status === 200) readonly = true;
      if (r.status === 200 && onSave) onSave(sanitizeName(name));
    });
  }
</script>

<form class="box">
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field">
        <label class="label">Name</label>
        <p class="control">
          <input
            class="input"
            type="text"
            bind:value={name}
            {readonly}
            required />
        </p>
      </div>
      <div class="field">
        <label class="label">Key</label>
        <p class="control">
          <input
            class="input"
            type="text"
            {readonly}
            bind:value={key}
            required />
        </p>
      </div>
    </div>
  </div>
  <div class="field">
    <label class="label">Description</label>
    <p class="control">
      <textarea
        class="textarea"
        type="text"
        bind:value={description}
        {readonly}
        required />
    </p>
  </div>
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field">
        <label class="label">Company Name</label>
        <p class="control">
          <input
            class="input"
            type="text"
            bind:value={companyName}
            {readonly}
            required />
        </p>
      </div>
      <div class="field">
        <label class="label">Company URL</label>
        <p class="control">
          <input
            class="input"
            type="text"
            {readonly}
            bind:value={companyUrl}
            required />
        </p>
      </div>
    </div>
  </div>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" bind:checked={supported} />
      Supported
    </label>
  </div>
  {#if supported}
    <div transition:fade class="field is-horizontal">
      <div class="field-body">
        <div class="field">
          <label class="label">Support Email</label>
          <p class="control">
            <input
              class="input"
              type="email"
              bind:value={supportEmail}
              {readonly} />
          </p>
        </div>
        <div class="field">
          <label class="label">Support URL</label>
          <p class="control">
            <input
              class="input"
              type="text"
              {readonly}
              bind:value={supportUrl} />
          </p>
        </div>
      </div>
    </div>
  {/if}
  <Button
    onClick={() => {
      readonly = !readonly;
    }}
    color="primary">
    Edit
  </Button>
  <Button type="submit" color="link" right onClick={handleClick}>Save</Button>
</form>
