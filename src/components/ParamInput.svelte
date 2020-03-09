<script>
  export let type;
  export let value;
  export let name;
</script>

<div class="field">
  <div class="control">
    {#if type === 'Boolean'}
      <label class="radio">
        <input type="radio" {name} bind:group={value} value={true} />
        True
      </label>
      <label class="radio">
        <input type="radio" {name} bind:group={value} value={false} />
        False
      </label>
    {:else if type === 'Connected System'}
      <div class="notification is-danger">
        Currently Connected Systems are unsupported
      </div>
    {:else if type === 'Decimal' || type === 'Integer'}
      <input type="number" class="input" bind:value />
    {:else if type === 'Text'}
      <input type="text" class="input" bind:value />
    {:else if type === 'Dictionary'}
      <textarea class="textarea" bind:value />
    {:else if type === 'Variant'}
      <div class="notification is-danger">
        Currently Variant Type is unsupported
      </div>
    {:else}
      <div class="notification is-warning">
        {value ? value : `No recognized type given. If this is an event the result upon change
        will be chosen.`}
      </div>
    {/if}
  </div>
</div>
