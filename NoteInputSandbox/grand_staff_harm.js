
grand_staff_harm = {
    init: function () {
        this.fundamental_note_name = "C2"
        this.draw();
    }

    ,dom_id:'staff'
    ,draw:function(){

        document.getElementById(grand_staff_harm.dom_id).innerHTML = "";
          
        // Map degrees to notes and transpose down to correct fundamental
        var bass_notes_for_vexflow = [];
        var treble_notes_for_vexflow = [];
        var bass_notes_tonal_objs = [];
        var treble_notes_tonal_objs = [];
        const this_note_tonal_obj = Tonal.Note.get(this.fundamental_note_name);
        const this_note_in_vexflow_format = this_note_tonal_obj.pc + "/" + this_note_tonal_obj.oct;
        if (this_note_tonal_obj.oct < 4) {
            bass_notes_for_vexflow.push(this_note_in_vexflow_format);
            bass_notes_tonal_objs.push(this_note_tonal_obj);
        } else {
            treble_notes_for_vexflow.push(this_note_in_vexflow_format);
            treble_notes_tonal_objs.push(this_note_tonal_obj);
        }
       

        // Initialize VexFlow renderer
        const VF = Vex.Flow;
        const div = document.getElementById(grand_staff_harm.dom_id);
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        // Configure rendering context
        renderer.resize(360, 350);
        const context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

        // Create grand staff (treble and bass clef)
        const staveTreble = new VF.Stave(10, 80, 400);
        staveTreble.addClef("treble").setContext(context).draw();

        const staveBass = new VF.Stave(10, 170, 400);
        staveBass.addClef("bass").setContext(context).draw();
       

        // Check if there are any bass notes
        const no_bass_notes = bass_notes_for_vexflow.length === 0;

        // Set default to a rest if no bass notes are provided
        bass_notes_for_vexflow = no_bass_notes ? ['f/3'] : bass_notes_for_vexflow;

        // Create the stave note for bass clef
        const notesBass = new VF.StaveNote({
            clef: "bass",
            keys: bass_notes_for_vexflow,
            duration: no_bass_notes ? "wr" : "w",  // Whole rest if no notes, whole note otherwise
        });
        

        // Check if there are any treble notes
        const no_treble_notes = treble_notes_for_vexflow.length === 0;

        // Set default to a rest if no treble notes are provided
        treble_notes_for_vexflow = no_treble_notes ? ['b/4'] : treble_notes_for_vexflow;

        // Create the stave note for treble clef
        const notesTreble = new VF.StaveNote({
            clef: "treble",
            keys: treble_notes_for_vexflow,
            duration: no_treble_notes ? "wr" : "w",  // Whole rest if no notes, whole note otherwise
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


