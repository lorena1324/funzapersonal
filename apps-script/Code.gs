/**
 * Backend en Google Sheets para el registro de asistencia INLOTRANS · PEPSICO MP.
 * Cada persona queda como una fila en la hoja "Asistencia".
 * Instrucciones de instalación en README.md.
 */
const HOJA = "Asistencia";
const COLUMNAS = ["ID", "Fecha", "Turno", "Responsable", "Nombre", "Cedula", "Cargo", "Observaciones", "Registrado"];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) {
    sh = ss.insertSheet(HOJA);
    sh.appendRow(COLUMNAS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold");
    // Fecha y cédula como texto para que Sheets no las transforme
    sh.getRange("B:B").setNumberFormat("@");
    sh.getRange("F:F").setNumberFormat("@");
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || "list";
    if (action !== "list") return json_({ ok: false, error: "Acción no válida" });

    const datos = hoja_().getDataRange().getValues().slice(1);
    const porId = {};
    const orden = [];
    datos.forEach(function (f) {
      const id = String(f[0]);
      if (!id) return;
      if (!porId[id]) {
        porId[id] = {
          id: id,
          fecha: fmtFecha_(f[1]),
          turno: String(f[2]),
          responsable: String(f[3]),
          observaciones: String(f[7]),
          creado: f[8] instanceof Date ? f[8].toISOString() : String(f[8]),
          personas: [],
        };
        orden.push(id);
      }
      porId[id].personas.push({ nombre: String(f[4]), documento: String(f[5]), cargo: String(f[6]) });
    });
    return json_({ ok: true, registros: orden.map(function (id) { return porId[id]; }) });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const body = JSON.parse(e.postData.contents);
    const sh = hoja_();

    if (body.action === "save") {
      const r = body.registro;
      if (!r || !r.id || !r.fecha || ["T1", "T2", "T3"].indexOf(r.turno) < 0 || !r.personas || !r.personas.length) {
        return json_({ ok: false, error: "Datos incompletos" });
      }
      const filas = r.personas.map(function (p) {
        return [r.id, r.fecha, r.turno, r.responsable, p.nombre, String(p.documento), p.cargo || "", r.observaciones || "", new Date()];
      });
      sh.getRange(sh.getLastRow() + 1, 1, filas.length, COLUMNAS.length).setValues(filas);
      return json_({ ok: true, guardadas: filas.length });
    }

    if (body.action === "delete") {
      const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues();
      for (let i = ids.length - 1; i >= 1; i--) {
        if (String(ids[i][0]) === String(body.id)) sh.deleteRow(i + 1);
      }
      return json_({ ok: true });
    }

    return json_({ ok: false, error: "Acción no válida" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function fmtFecha_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  return String(v);
}
