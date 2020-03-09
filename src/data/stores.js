import { writable } from "svelte/store";

function createProjects() {
  const { set, subscribe } = writable([]);
  return {
    subscribe,
    update: () => {
      fetch("/projects.json")
        .then(r => r.json())
        .then(set);
    }
  };
}

function createComponents() {
  const { subscribe, set } = writable([]);

  return {
    subscribe,
    update: folder => {
      fetch(`/projects/${folder}/components.json`)
        .then(r => r.json())
        .then(set);
    }
  };
}

function createParams() {
  const { subscribe, set } = writable([]);
  return {
    subscribe,
    update: ({ folder, component }) => {
      fetch(`/projects/${folder}/components/${component}/params.json`)
        .then(r => r.json())
        .then(set);
    }
  };
}

export const projects = createProjects();

export const components = createComponents();

export const params = createParams();
