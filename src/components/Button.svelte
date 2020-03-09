<script>
  export let onClick;
  export let color = "";
  export let right = false;
  export let type = "button";
</script>

<button
  {type}
  class={`button is-${color}`}
  class:is-pulled-right={right}
  on:click={onClick}>
  <slot />
</button>
