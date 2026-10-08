document.addEventListener("DOMContentLoaded", () => {
    const openButton = document.querySelector(".contact-open");

    if (!openButton) return;

    openButton.addEventListener("click", () => {
        openContactDialog();
    });
});

function createContactDialog() {
    const dialog = document.createElement("dialog");
    dialog.className = "contact-dialog";
    dialog.innerHTML = `
        <form>
            <div class="contact-fields">
                <h2>Kontakt</h2>
                <label for="contact-info">E-Mail oder Telefonnummer</label>
                <input type="text" id="contact-info" name="contact-info" required>

                <label for="contact-message">Nachricht</label>
                <textarea id="contact-message" name="contact-message" required></textarea>
            </div>

            <p class="contact-status" role="status" hidden></p>

            <div class="contact-dialog-actions">
                <button type="button" class="contact-cancel">Abbrechen</button>
                <button type="submit" class="contact-submit">Absenden</button>
            </div>
        </form>
    `;
    return dialog;
}

function openContactDialog() {
    const dialog = createContactDialog();
    document.body.appendChild(dialog);

    dialog.addEventListener("close", () => {
        dialog.remove();
    });

    const form = dialog.querySelector("form");
    const fieldsEl = dialog.querySelector(".contact-fields");
    const actionsEl = dialog.querySelector(".contact-dialog-actions");
    const cancelButton = dialog.querySelector(".contact-cancel");
    const statusEl = dialog.querySelector(".contact-status");
    const contactField = dialog.querySelector("#contact-info");
    const messageField = dialog.querySelector("#contact-message");

    cancelButton.addEventListener("click", () => {
        dialog.close();
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const message = `${document.title}\n${contactField.value}\n${messageField.value}`;

        try {
            await ntfy("marc-langer", message);
        } catch (error) {
            statusEl.textContent = "Senden fehlgeschlagen. Bitte versuche es erneut.";
            statusEl.hidden = false;
            return;
        }

        fieldsEl.hidden = true;
        actionsEl.hidden = true;
        statusEl.textContent = "Danke für die Nachricht";
        statusEl.hidden = false;

        setTimeout(() => {
            dialog.close();
        }, 5000);
    });

    dialog.showModal();
}
