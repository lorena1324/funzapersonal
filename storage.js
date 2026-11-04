// Almacenamiento dentro del aplicativo (memoria del navegador / localStorage).
// No usa ninguna base de datos externa.
(function () {
  const LS_KEY = "inlotrans_asistencia_v1";

  function leer() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function escribir(list) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }

  window.Store = {
    async save(registro) {
      const list = leer();
      list.push(registro);
      escribir(list);
      return { ok: true };
    },

    async list() {
      return leer();
    },

    async remove(id) {
      escribir(leer().filter((r) => r.id !== id));
      return { ok: true };
    },

    // Une registros de una copia de seguridad sin duplicar (por id)
    async importar(registros) {
      const list = leer();
      const ids = new Set(list.map((r) => r.id));
      let nuevos = 0;
      for (const r of registros) {
        if (r && r.id && r.fecha && r.turno && Array.isArray(r.personas) && !ids.has(r.id)) {
          list.push(r);
          ids.add(r.id);
          nuevos++;
        }
      }
      escribir(list);
      return nuevos;
    },
  };
})();
