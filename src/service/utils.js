export function getJSON(json, defaultJson = {}) {
    return json ? JSON.parse(json) : defaultJson
}