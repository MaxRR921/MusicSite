grand_staff_harm = {
    fundamental_note_name: "D2"
    , init: function () {
        this.draw();
    }
    ,dom_id:'staff'
    ,draw:function(){

        document.getElementById(grand_staff_harm.dom_id).innerHTML = "";

        const scale = Tonal.Scale.get("C lydian dominant").notes; // Get notes in the C lydian dominant scale
        var degrees = [-15 + (1 + 15), -8 + (1 + 15), -4 + (1 + 15), 1 + 14, 3 + 14, 5 + 14, 7 + 14, 8 + 14, 9 + 14, 10 + 14, 11 + 14]; // Scale degrees
        // Map degrees to notes and transpose down to correct fundamental
        const harmonic_series_notes = degrees.map(degree => {
            const index = (degree - 1) % scale.length; // Use modulo to cycle through the scale
            const octaveShift = Math.floor((degree - 1) / scale.length); // Shift octave if necessary
            const note = scale[index] + (4 + octaveShift); // Starting in octave 4, adjust as needed

            // Transpose the note down by a major sixth
            const transposedNote = Tonal.Note.transpose(note, Tonal.Interval.distance("C4", grand_staff_harm.fundamental_note_name) );

            return transposedNote; // Return transposed note with correct octave
        });

        document.getElementById("html_display_of_notes").innerHTML = harmonic_series_notes.join(" ").replace(/[0-9]g/,"");

        // Separate notes into bass and treble clefs, and prepare them for VexFlow
        var bass_notes_for_vexflow = [];
        var treble_notes_for_vexflow = [];
        var bass_notes_tonal_objs = [];
        var treble_notes_tonal_objs = [];

        harmonic_series_notes.forEach((partial) => {
            const this_note_tonal_obj = Tonal.Note.get(partial);
            const this_note_in_vexflow_format = this_note_tonal_obj.pc + "/" + this_note_tonal_obj.oct;
            if (this_note_tonal_obj.oct < 4) {
                bass_notes_for_vexflow.push(this_note_in_vexflow_format);
                bass_notes_tonal_objs.push(this_note_tonal_obj);
            } else {
                treble_notes_for_vexflow.push(this_note_in_vexflow_format);
                treble_notes_tonal_objs.push(this_note_tonal_obj);
            }
        });

        // Initialize VexFlow renderer
        const VF = Vex.Flow;
        const div = document.getElementById(grand_staff_harm.dom_id);
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        // Configure rendering context
        renderer.resize(360, 300);
        const context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

        // Create grand staff (treble and bass clef)
        const staveTreble = new VF.Stave(10, 40, 400);
        staveTreble.addClef("treble").setContext(context).draw();

        const staveBass = new VF.Stave(10, 130, 400);
        staveBass.addClef("bass").setContext(context).draw();
        
        // Create notes for bass and treble clefs
        const notesBass = new VF.StaveNote({
            clef: "bass",
            keys: bass_notes_for_vexflow,
            duration: "w"
        });

        const notesTreble = new VF.StaveNote({
            clef: "treble",
            keys: treble_notes_for_vexflow,
            duration: "w"
        });

        // Create voice in 4/4 and add notes to both staves
        const voiceTreble = new VF.Voice({ num_beats: 4, beat_value: 4 }).addTickables([notesTreble]);
        const voiceBass = new VF.Voice({ num_beats: 4, beat_value: 4 }).addTickables([notesBass]);

        console.log(grand_staff_harm.fundamental_note_name,bass_notes_for_vexflow,treble_notes_for_vexflow)

        VF.Accidental.applyAccidentals([voiceBass], `C`);
        VF.Accidental.applyAccidentals([voiceTreble], `C`);

        // Format and justify the notes to 400 pixels
        const formatter = new VF.Formatter().joinVoices([voiceTreble, voiceBass]).format([voiceTreble, voiceBass], 400);

        // Render the voices
        voiceTreble.draw(context, staveTreble);
        voiceBass.draw(context, staveBass);

    }
    ,update:function(new_fundamental_note_name){
        this.fundamental_note_name = new_fundamental_note_name;
        this.draw();
        try{
            document.getElementById('note_name').value=frequencyToNote(this.value);
        } catch(err){}
    }
    , set_new_fundamental(new_fundamental_note_name) {
        console.log('lets set the new note to', new_fundamental_note_name);
    }
};


