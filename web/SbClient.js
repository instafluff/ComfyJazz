// Create a new client with default options
let client;

async function enableYTSounds() {
    client = new StreamerbotClient({ immediate: false });
    await client.connect();
    client.on('YouTube.Message', () => {
        comfyJazz.playNoteProgression(maxNotes);
    });
}