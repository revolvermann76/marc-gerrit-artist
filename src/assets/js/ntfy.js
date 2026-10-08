/**
 * Sendet eine Nachricht an einen ntfy.sh-Kanal.
 *
 * @param {string} channel Name des Kanals (Topic)
 * @param {string} message Nachrichtentext
 * @returns {Promise<Response>}
 */
async function ntfy(channel, message) {
  const response = await fetch(`https://ntfy.sh/${encodeURIComponent(channel)}`, {
    method: "POST",
    body: message,
  });

  if (!response.ok) {
    throw new Error(`ntfy: Senden fehlgeschlagen (HTTP ${response.status})`);
  }

  return response;
}
