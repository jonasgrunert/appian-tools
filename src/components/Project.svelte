<script>
  import Button from "../components/Button.svelte";

  export let title;
  export let key;
  export let version;
  export let onDel;

  function onDelete() {
    fetch(`/projects/${key}.json`, {
      method: "DELETE"
    }).then(r => {
      if (r.status === 200 && onDel) onDel();
    });
  }
</script>

<div class="column is-one-third">
  <div class="card">
    <div class="card-content">
      <a href={`/projects/${key}`}>
        <article class="media has-text-black">
          <div class="media-content">
            <h1 class="subtitle">{title}</h1>
          </div>
          <div class="media-right has-text-black">
            v
            <b>{version}</b>
          </div>
        </article>
        <div class="has-text-grey-dark">
          <slot />
        </div>
      </a>
    </div>
    <footer class="card-footer">
      <button class="button is-danger card-footer-item" on:click={onDelete}>
        Delete
      </button>
      <a href={`/projects/${key}`} class="button is-warning card-footer-item">
        Edit
      </a>
    </footer>
  </div>
</div>
