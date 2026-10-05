const { setTimeout: delay } = require('node:timers/promises');
const { contracts } = require('../checkout-workspace/repositories.json');

/**
 * La fecha no identifica un dispatch: jobs concurrentes elegian el mismo run.
 * La API devuelve su id con return_run_details; solo se espera ese id y todo
 * rechazo corta. No hay fallback a una corrida vieja ni a main. El workflow
 * sale de la version de esta accion, y el candidato viaja como input JSON.
 * La espera usa Actions read, compatible con tokens fine-grained; gh run watch
 * pide checks read y no admite esos tokens. El corte de 27 minutos deja margen
 * al job de 30; el sondeo cada 20 segundos no consume el rate limit por frame.
 */
async function dispatchSsot(options, { request = fetch, pause = delay, now = Date.now } = {}) {
  const { token, auditRef, workflowRef } = options;
  if (!token || !auditRef || !/^v\d+\.\d+\.\d+$/.test(workflowRef || '')) throw new Error('Faltan token, audit-ref o ref versionada de la accion');
  const deadline = now() + 27 * 60 * 1000;
  const api = async (path, body) => {
    const remaining = deadline - now();
    if (remaining <= 0) throw new Error('SSOT agoto la espera');
    const response = await request(`https://api.github.com/repos/${contracts.repository}/actions/${path}`, {
      method: body ? 'POST' : 'GET', redirect: 'error',
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2026-03-10' },
      body: body && JSON.stringify(body), signal: AbortSignal.timeout(Math.min(60000, remaining)),
    });
    if (response.status !== 200) throw new Error(`SSOT rechazo la solicitud (HTTP ${response.status})`);
    return response.json();
  };
  const { workflow_run_id: runId } = await api('workflows/ssot.yml/dispatches', { ref: workflowRef, inputs: { audit_ref: auditRef }, return_run_details: true });
  if (!Number.isSafeInteger(runId) || runId <= 0) throw new Error('El dispatch de SSOT no devolvio un id valido');
  console.log(`SSOT run: https://github.com/${contracts.repository}/actions/runs/${runId}`);
  let previousStatus;
  while (now() < deadline) {
    const run = await api(`runs/${runId}`);
    if (run.id !== runId) throw new Error('SSOT devolvio una corrida distinta');
    if (run.status === 'completed') {
      if (run.conclusion !== 'success') throw new Error('La corrida exacta de SSOT no termino en success');
      return;
    }
    if (!['queued', 'in_progress', 'waiting', 'pending', 'requested'].includes(run.status)) throw new Error('SSOT devolvio un estado desconocido');
    if (run.status !== previousStatus) console.log(`SSOT: ${run.status}`);
    previousStatus = run.status;
    await pause(Math.min(20000, Math.max(0, deadline - now())));
  }
  throw new Error('SSOT agoto la espera');
}

if (require.main === module) {
  dispatchSsot({ token: process.env.GH_TOKEN, auditRef: process.env.AUDIT_REF, workflowRef: process.env.WORKFLOW_REF }).catch(() => {
    console.error('::error::No se pudo completar la corrida exacta de SSOT');
    process.exitCode = 1;
  });
}

module.exports = { dispatchSsot };
