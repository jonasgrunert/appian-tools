<script>
  export let readonly = true;
  export let name = "";
  export let agents = "chrome firefox ie11 edge safari mobile";
</script>

<form>
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
        <label class="label">Useragents</label>
        <p class="control">
          <input
            class="input"
            type="text"
            {readonly}
            bind:value={agents}
            required />
        </p>
      </div>
    </div>
  </div>
</form>
