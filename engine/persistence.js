// Save and load the world state as a JSON file the user owns.
// No backend, no telemetry, no accounts.

import { SCHEMA_VERSION } from "./state.js";

export function serialize(state) {
  return JSON.stringify(state, null, 2);
}

export function deserialize(jsonString) {
  let parsed;
  try { parsed = JSON.parse(jsonString); }
  catch (e) { throw new Error("Save file is not valid JSON: " + e.message); }
  return migrate(parsed);
}

function migrate(state) {
  if (!state.schema_version) {
    throw new Error("Save file has no schema_version. Cannot load.");
  }
  if (state.schema_version === SCHEMA_VERSION) return state;
  // Future migrations land here. For now, only one version exists.
  throw new Error(`Save file schema_version ${state.schema_version} is not compatible with engine ${SCHEMA_VERSION}.`);
}

export function downloadStateFile(state, filename = "copath-state.json") {
  const blob = new Blob([serialize(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function uploadStateFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try { resolve(deserialize(reader.result)); }
      catch (e) { reject(e); }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
