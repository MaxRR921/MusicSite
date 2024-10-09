
const midi_script = {
    midi: null, // Now a member variable
    pressedNotes: [], // Now a member variable
    vf: null, // Now a member variable
    score: null, // Now a member variable
    system: null, // Now a member variable
    note: 0, // Initialize as a member variable

    onMIDISuccess(midiAccess) {
        console.log("MIDI ready!");
        this.midi = midiAccess; // Accessing the midi member variable
        this.listInputsAndOutputs(); // Corrected call
        this.startLoggingMIDIInput(); // Corrected call
    },

    onMIDIFailure(msg) {
        console.error(`Failed to get MIDI access - ${msg}`);
    },

    init() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
            this.note = 0; // Setting the note as a member variable
        } else {
            console.error("Web MIDI API is not supported in this browser.");
        }
    },

    listInputsAndOutputs() { // Removed the argument
        for (const entry of this.midi.inputs) {
            const input = entry[1];
            console.log(input);
        }

        for (const entry of this.midi.outputs) {
            const output = entry[1];
            console.log(output);
        }
    },

    startLoggingMIDIInput() { // Removed the argument
        this.midi.inputs.forEach((entry) => {
            entry.onmidimessage = this.handleMidiMessage.bind(this);
        });
    },

    parseMidiMessage(message) {
        return {
            command: message.data[0] >> 4,
            channel: message.data[0] & 0xf,
            note: message.data[1],
            velocity: message.data[2] / 127
        };
    },

    handleMidiMessage(message) {
        const { command, channel, note, velocity } = this.parseMidiMessage(message);

        if (command === 8 || (command === 9 && velocity === 0)) {
            this.onNoteOff(note);
        } else if (command === 9 && velocity > 0) {
            this.onNote(note, velocity);
        }
    },

    onNote(note, velocity) {
        this.note = note; // Storing the current note in the member variable
        console.log(`NOTE #: ${note}`);
        const noteName = Tonal.Note.fromMidi(note);
        this.pressedNotes.push(noteName); // Using the pressedNotes member variable
        console.log(`Note: ${noteName}, Velocity: ${velocity}`);
        this.detectChord();
    },

    onNoteOff(note) {
        const noteName = Tonal.Note.fromMidi(note);
        const index = this.pressedNotes.indexOf(noteName); // Using the pressedNotes member variable
        if (index > -1) {
            this.pressedNotes.splice(index, 1); // Modifying the pressedNotes array
        }
        this.detectChord();
    },

    detectChord() {
        if (this.pressedNotes.length > 1) { // Using the pressedNotes member variable
            const sortedNotes = Tonal.Note.sortedNames(this.pressedNotes);
            console.log(`Notes: ${sortedNotes}`);
            const detectedChords = Tonal.Chord.detect(sortedNotes);
            console.log(`Detected Chord(s): ${detectedChords.length ? detectedChords : "No chord detected"}`);
        } else {
            console.log('Not enough notes to form a chord');
        }
    }
};

// Initialize midi_script