import { promises } from "fs";
import { parse, j2xParser } from "fast-xml-parser";
import rmdir from "rimraf";
import Bundler from "parcel";
import JSZip from "jszip";

const xmlOptions = {
  attributeNamePrefix: "@_",
  ignoreAttributes: false,
  allowBooleanAttributes: true
};

function restateParameter({ name, category, type, isList }) {
  if (category === "event") return { name, category };
  if (type === "Connected System")
    return { name, category, type: "ConnectedSystem" };
  return {
    name,
    category,
    type: `${type}${isList ? "?list" : ""}`
  };
}

function transformParameter({ name, category, type }) {
  if (!type) return { name, category };
  const isList = type.endsWith("?list");
  return {
    name,
    category,
    type: isList ? type.slice(0, -5) : type.replace(/ /g, ""),
    isList
  };
}

function transformComponent(component) {
  return {
    name: component["@_rule-name"],
    version: component["@_version"],
    agents: component["supported-user-agents"],
    sdk: component["sdk-version"],
    icon: component["icon-file"],
    entry: component["html-entry-point"],
    parameter: component.parameter
      ? Array.isArray(component.parameter)
        ? component.parameter.map(transformParameter)
        : [transformParameter(component.parameter)]
      : []
  };
}

function restateComponent(component) {
  const params = {
    parameter: component.parameter
      ? Array.isArray(component.parameter)
        ? component.parameter.map(restateParameter)
        : restateParameter(component.parameter)
      : {}
  };
  return {
    ["@_rule-name"]: component.name,
    ["@_version"]: component.version || "1.0.0",
    ["supported-user-agents"]: component.agents,
    ["sdk-version"]: component.sdk || 2.0,
    ["icon-file"]: component.icon || "icon.svg",
    ["html-entry-point"]: component.entry || "index.html",
    ...params
  };
}

export function getFile(folder) {
  return promises
    .readFile(`./${folder}/appian-component-plugin.xml`, { encoding: "UTF-8" })
    .then(c => parse(c, xmlOptions)["appian-component-plugin"])
    .then(c => ({
      file: folder,
      name: c["@_name"],
      key: c["@_key"],
      version: c["plugin-info"].version,
      description: c["plugin-info"].description,
      companyName: c["plugin-info"].vendor["@_name"],
      companyUrl: c["plugin-info"].vendor["@_url"],
      supported: c["plugin-info"].support["@_supported"],
      supportEmail: c["plugin-info"].support["@_email"],
      supportUrl: c["plugin-info"].support["@_url"],
      components: c.component
        ? Array.isArray(c.component)
          ? c.component.map(transformComponent)
          : [transformComponent(c.component)]
        : []
    }));
}

export async function deleteFile(folder) {
  rmdir(`./${folder}`, {}, err => {
    if (err) throw err;
  });
}

export async function writeFile(
  folder,
  {
    name,
    key,
    version,
    description,
    companyName,
    companyUrl,
    supported,
    supportEmail,
    supportUrl,
    components
  }
) {
  let current;
  try {
    current = await getFile(folder);
  } catch {
    await promises.mkdir(`./${folder}`, { recursive: true });
  }
  const data = {
    "appian-component-plugin": {
      "@_name": name ? name : current.name,
      "@_key": key ? key : current.key,
      "plugin-info": {
        description: description ? description : current.description,
        version: version ? version : current ? current.version : "1.0.0",
        vendor: {
          "@_name": companyName ? companyName : current.companyName,
          "@_url": companyUrl ? companyUrl : current.companyUrl
        },
        support: {
          "@_supported":
            supported !== undefined ? supported : current.supported,
          "@_email":
            supportEmail !== undefined ? supportEmail : current.supportEmail,
          "@_url": supportUrl !== undefined ? supportUrl : current.supportUrl
        }
      },
      ...matchAnything(components, current, "components")
    }
  };
  const parser = new j2xParser(xmlOptions);
  await promises.writeFile(
    `./${folder}/appian-component-plugin.xml`,
    parser.parse(data, {
      attributeNamePrefix: "@_",
      ignoreAttributes: false,
      allowBooleanAttributes: true
    })
  );
}

function matchAnything(components, current, key) {
  return components ? components : current[key];
}

export async function getComponent(folder, component) {
  return getFile(folder).then(({ components }) =>
    components.find(({ name }) => name === component)
  );
}

export async function deleteComponent(folder, component) {
  const { components } = await getFile(folder);
  let comps = {};
  if (components.length > 2) {
    comps = {
      component: components
        .filter(({ name }) => name !== component)
        .map(restateComponent)
    };
  }

  if ((components.length = 2)) {
    comps = {
      component: restateComponent(
        components.find(({ name }) => name !== component)
      )
    };
  }
  await writeFile(folder, { components: comps });
  return folder;
}

export async function saveComponent(
  folder,
  component,
  { name, agents, parameter }
) {
  const { components } = await getFile(folder);
  let comps = {};
  if (components.length === 0) {
    comps = {
      component: restateComponent({
        name,
        agents
      })
    };
  }
  const comp = components.find(({ name }) => name === component);
  if (comp) {
    comps = {
      component: components.map(c =>
        c.name === component
          ? restateComponent({
              agents: matchAnything(agents, c, "agents"),
              name: matchAnything(name, c, "name"),
              parameter: matchAnything(parameter, c, "parameter")
            })
          : restateComponent(c)
      )
    };
  } else {
    comps = {
      component: [...components, { name, agents }].map(restateComponent)
    };
  }
  await writeFile(folder, { components: comps });
  return folder;
}

export async function deleteParameter(folder, component, param) {
  const { parameter, ...comp } = await getComponent(folder, component);
  let params = {};
  if (parameter.length > 2) {
    params = {
      parameter: parameter
        .filter(({ name }) => name !== param)
        .map(restateParameter)
    };
  }
  if (parameter.length === 2) {
    params = {
      parameter: restateParameter(parameter.find(({ name }) => name === param))
    };
  }
  await saveComponent(folder, component, { ...comp, ...params });
  return { folder, component };
}

export async function saveParameter(folder, component, param, config) {
  const { parameter, ...comp } = await getComponent(folder, component);
  let params = {};
  if (parameter.length === 0) {
    params = { parameter: restateComponent(config) };
  }
  const p = parameter.find(({ name }) => name === param);
  if (p) {
    params = {
      parameter: parameter.map(m =>
        m.name === param ? restateParameter(config) : restateParameter(m)
      )
    };
  } else {
    params = { parameter: [...parameter, config].map(restateParameter) };
  }
  await saveComponent(folder, component, { ...comp, ...params });
  return { folder, component };
}

export async function getHTML(folder, component) {
  const bundler = new Bundler(`./${folder}/${component}/src/index.html`, {
    outDir: "./static",
    cacheDir: `./${folder}/${component}/.cache`,
    watch: true
  });
  return bundler.bundle().catch(console.error);
}

function bumpVerison(old, bump) {
  const [major, minor, patch] = old.split(".").map(s => +s.replace(".", ""));
  switch (+bump) {
    case 2:
      return `${major}.${minor}.${patch + 1}`;
    case 1:
      return `${major}.${minor + 1}.0`;
    case 0:
      return `${major + 1}.0.0`;
    default:
      return old;
  }
}
function getMajor(v) {
  const [major, minor, patch] = v.split(".").map(s => +s.replace(".", ""));
  return major;
}

export async function getZip(folder, config) {
  let file = await getFile(folder);
  const versionbump = config.reduce(
    (prev, curr) => (prev < curr.version ? prev : curr.version),
    4
  );
  const components = file.components.map(c => {
    const v = config.find(({ name }) => name === c.name).version;
    return { ...c, version: bumpVerison(c.version, v) };
  });
  const newVersion = bumpVerison(file.version, versionbump);
  console.log(newVersion);
  file = {
    ...file,
    version: newVersion,
    components: { component: components.map(restateComponent) }
  };
  await writeFile(folder, file);
  await Promise.all(
    components.map(({ name, version }) =>
      new Bundler(`./${folder}/${name}/src/index.html`, {
        watch: false,
        outDir: `./${folder}/${name}/dist${getMajor(version)}`,
        minify: true,
        cache: false
      }).bundle()
    )
  );
  const zip = new JSZip();
  const xml = await promises.readFile(
    `./${folder}/appian-component-plugin.xml`,
    { encoding: "UTF-8" }
  );
  zip.file("appian-component-plugin.xml", xml);
  async function addDirectory(path, z, name) {
    const f = z.folder(name);
    const contents = await promises.readdir(path);
    await Promise.all(
      contents.map(c =>
        promises
          .stat(`${path}/${c}`)
          .then(s =>
            s.isDirectory()
              ? addDirectory(`${path}/${c}`, f, c)
              : promises
                  .readFile(`${path}/${c}`, { encoding: "UTF-8" })
                  .then(t => f.file(c, t))
          )
      )
    );
    return z;
  }
  await Promise.all(
    components.map(async c => {
      const f = zip.folder(c.name);
      const dirs = await promises
        .readdir(`./${folder}/${c.name}`)
        .then(s => s.filter(n => n.startsWith("dist")));
      return await Promise.all(
        dirs.map(d =>
          addDirectory(
            `./${folder}/${c.name}/${d}`,
            f,
            `v${getMajor(c.version)}`
          )
        )
      );
    })
  );
  return await zip.generateAsync({ type: "nodebuffer" });
}
