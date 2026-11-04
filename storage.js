// Capa de almacenamiento: Google Sheets (si hay URL configurada) o localStorage (modo prueba).
(function () {
  const LS_KEY = "inlotrans_asistencia_v1";

  function remote() {
    return !!(window.CONFIG && CONFIG.APPS_SCRIPT_URL);
  }

  function readLocal() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function writeLocal(list) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }

  async function post(body) {
    // text/plain evita el preflight CORS que Apps Script no soporta
    const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Error del servidor");
    return data;
  }

  window.Store = {
    isRemote: remote,

    async save(registro) {
      if (remote()) return post({ action: "save", registro });
      const list = readLocal();
      list.push(registro);
      writeLocal(list);
      return { ok: true };
    },

    async list() {
      if (remote()) {
        const res = await fetch(CONFIG.APPS_SCRIPT_URL + "?action=list");
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Error del servidor");
        return data.registros;
      }
      return readLocal();
    },

    async remove(id) {
      if (remote()) return post({ action: "delete", id });
      writeLocal(readLocal().filter((r) => r.id !== id));
      return { ok: true };
    },
  };
})();
