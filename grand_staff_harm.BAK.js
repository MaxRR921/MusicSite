grand_staff_harm = {
    fundamental_note_name: "C2"
    , init: function () {


        const scale = Tonal.Scale.get("C lydian dominant").notes; // Get notes in the C lydian dominant scale
        var degrees = [-15 + (1 + 15), -8 + (1 + 15), -4 + (1 + 15), 1 + 14, 3 + 14, 5 + 14, 7 + 14, 8 + 14, 9 + 14, 10 + 14, 11 + 14]; // Scale degrees

        // Map degrees to notes and transpose down by a major sixth (-6M)
        const harmonic_series_notes = degrees.map(degree => {
            const index = (degree - 1) % scale.length; // Use modulo to cycle through the scale
            const octaveShift = Math.floor((degree - 1) / scale.length); // Shift octave if necessary
            const note = scale[index] + (4 + octaveShift); // Starting in octave 4, adjust as needed

            // Transpose the note down by an interval
            const transposedNote = Tonal.Note.transpose(note, Tonal.Interval.distance("C4", grand_staff_harm.fundamental_note_name)); // Transpose down 

            return transposedNote; // Return transposed note with correct octave
        });

        // put notes lower than C4 into bass clef
        // AND format string for vexflow
        var bass_notes_tonal_objs = [];
        var bass_notes_for_vexflow = [];
        var treble_notes_tonal_objs = [];
        var treble_notes_for_vexflow = [];
        for (const partial of harmonic_series_notes) {
           const this_note_tonal_obj = Tonal.Note.get(partial);
           const this_note_in_vexflow_format = this_note_tonal_obj.pc + "/" + this_note_tonal_obj.oct;
            if(this_note_tonal_obj.oct < 4 ){
                bass_notes_tonal_objs.push(this_note_tonal_obj);
                bass_notes_for_vexflow.push(this_note_in_vexflow_format);
            } else {
                treble_notes_tonal_objs.push(this_note_tonal_obj);
                treble_notes_for_vexflow.push(this_note_in_vexflow_format);
            }
        }
        
       console.log(harmonic_series_notes,bass_notes_for_vexflow,treble_notes_for_vexflow);


        // Initialize VexFlow renderer
        const VF = Vex.Flow;
        const div = document.getElementById('staff');
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        // Configure rendering context
        renderer.resize(360, 360);
        const context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

        // Create grand staff (treble and bass clef)
        const staveTreble = new VF.Stave(10, 40, 400);
        staveTreble.addClef("treble");//.addTimeSignature("4/4");
        staveTreble.setContext(context).draw();

        const staveBass = new VF.Stave(10, 130, 400);
        staveBass.addClef("bass");//.addTimeSignature("4/4");
        staveBass.setContext(context).draw();

        // Create a C7 chord starting from C2 (bass clef)
        const notesBass = [
            new VF.StaveNote({ clef: "bass", keys: bass_notes_for_vexflow, duration: "w" })
            // .addAccidental(3, new VF.Accidental("b")) // Adding flat to Bb (index 3 in the chord)
        ];

        // Create corresponding treble notes for the grand staff
        const notesTreble = [
            new VF.StaveNote({ clef: "treble", keys: treble_notes_for_vexflow, duration: "w" })
            // .addAccidental(2, new VF.Accidental("b")) // Adding flat to Bb (index 2 in the chord)
        ];


        // Loop through the notes and check for accidentals
        bass_notes_tonal_objs.forEach((this_note_tonal_obj, index) => {
            const accidental = this_note_tonal_obj.acc;
            console.log('whats note',note,'why not accidental',this_note_tonal_obj,accidental)
            if (accidental) {
                notesBass[0].addAccidental(index, new VF.Accidental(accidental));
                console.log("PLEASzzee add accidental",index, accidental, note);
            }
        });

        treble_notes_tonal_objs.forEach((note, index) => {
            const this_note_tonal_obj = Tonal.Note.get(note);
            const accidental = this_note_tonal_obj.acc;
            if (accidental) {
                notesTreble[0].addAccidental(index, new VF.Accidental(accidental));
            }
        });

        // Create voice in 4/4 and add notes to both staves
        const voiceTreble = new VF.Voice({ num_beats: 4, beat_value: 4 });
        const voiceBass = new VF.Voice({ num_beats: 4, beat_value: 4 });

        // allow incorrect beats per measure, this can be helpful for debug i guess
        voiceTreble.setStrict(false);
        voiceBass.setStrict(false);

        voiceTreble.addTickables(notesTreble);
        voiceBass.addTickables(notesBass);

        // Format and justify the notes to 400 pixels
        const formatter = new VF.Formatter().joinVoices([voiceTreble]).joinVoices([voiceBass]).format([voiceTreble, voiceBass], 400);

        // Render the voices
        voiceTreble.draw(context, staveTreble);
        voiceBass.draw(context, staveBass);


    }
    // ,update_display(){
    //     try{

    //         document.getElementById('note_name').value=frequencyToNote(this.value);

    //     } catch(err){}
    // }
    , set_new_fundamental(new_fundamental_note_name) {
        console.log('lets set the new note to', new_fundamental_note_name);
    }
};


