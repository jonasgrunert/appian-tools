<script>
  export let open = false;
</script>

<div class="modal" class:is-active={open}>
  <div
    class="modal-background"
    on:click={() => {
      open = false;
    }} />
  <div class="modal-content">
    <slot />
  </div>
  <button
    class="modal-close is-large"
    aria-label="close"
    on:click={() => {
      open = false;
    }} />
</div>
