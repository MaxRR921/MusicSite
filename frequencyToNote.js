function frequencyToNote(frequency) {
  const A4_FREQUENCY = 440;
  const NOTES = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

  // Calculate the distance from A4 in semitones
  const n = 12 * Math.log2(frequency / A4_FREQUENCY);

  // Round to the nearest integer to get the MIDI note number
  const midiNote = Math.round(n) + 69; 

  // Calculate the octave
  const octave = Math.floor(midiNote / 12) - 1;

  // Calculate the note name within the octave
  const noteName = NOTES[midiNote % 12];

  return noteName + octave;
}

// // Example: 
// console.log(frequencyToNote(440)); // Output: "A4"
// console.log(frequencyToNote(82)); // should be E2
// console.log(frequencyToNote(192)); // Output: G3
// // console.log(frequencyToNote(1000)); // Output: 1kHz test tone
// console.log(frequencyToNote(261)); // Output: "piano middle c" C4

// console.log(frequencyToNote(246)); // Output: "piano B below middle C" B3