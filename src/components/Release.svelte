<script>
  import Button from "./Button.svelte";

  export let components = [];
  export let folder;
</script>

<form method="GET" action={`/projects/${folder}.zip`} class="box">
  {#each components as c}
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Version</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <label class="radio">
              <input type="radio" name={c.name} value="0" />
              Major
            </label>
            <label class="radio">
              <input type="radio" name={c.name} value="1" />
              Minor
            </label>
            <label class="radio">
              <input type="radio" name={c.name} value="2" />
              Patch
            </label>
            <label class="radio">
              <input type="radio" name={c.name} value="3" />
              No changes
            </label>
          </div>
        </div>
      </div>
    </div>
  {/each}
  <div class="field is-grouped is-grouped-right">
    <p class="control">
      <Button color="warning" type="submit">Deploy</Button>
    </p>
  </div>
</form>
