
grand_staff_harm = {
    fundamental_note_name: "D2"
    , init: function () {
        this.draw();
    }

    ,dom_id:'staff'
    ,draw:function(){

        document.getElementById(grand_staff_harm.dom_id).innerHTML = "";

        const scale = Tonal.Scale.get("C lydian dominant").notes; // Get notes in the C lydian dominant scale
        var degrees = [
            1,  // 1st partial
            8,  // 2th partial
            12, // 3th partial
            15, // 4th partial
            17, // 5th partial
            19, // 6th partial
            21, // 7st partial
            22, // 8nd partial
            23, // 9rd partial
            24, // 10th partial
            25  // 11th partial
          ];
          
        // Map degrees to notes and transpose down to correct fundamental
        const harmonic_series_notes = degrees.map(degree => {
            const index = (degree - 1) % scale.length; // Use modulo to cycle through the scale
            const octaveShift = Math.floor((degree - 1) / scale.length); // Shift octave if necessary
            const note = scale[index] + (4 + octaveShift); // Starting in octave 4, adjust as needed

            // Transpose the note down
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
       

        const no_bass_notes = bass_notes_for_vexflow.length != 0 ? false : true;
        bass_notes_for_vexflow = no_bass_notes ? bass_notes_for_vexflow :  ['b/4/r'];
        
        // Create notes for bass and treble clefs
        const notesBass = new VF.StaveNote({
            clef: "bass",
            keys: bass_notes_for_vexflow ,
            duration:no_bass_notes ? "wr" : "w"
        });

        const no_treble_notes = treble_notes_for_vexflow.length != 0 ? false :true
        treble_notes_for_vexflow = no_treble_notes? treble_notes_for_vexflow :  ['b/4/r'];

        const notesTreble = new VF.StaveNote({
            clef: "treble",
            keys: treble_notes_for_vexflow,
            duration: no_treble_notes ? "wr" : "w"
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

    ,getHarmonicSeries:function(note_freq){
        partials = []
        console.log(note_freq);
        for (let i = 1; i < 6; i++) {
            partials.push(i * note_freq)
            console.log(partials[i])
        }

        partials.push()
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


