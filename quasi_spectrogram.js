quasi_spectrogram = {
    init: function () {
        var fundamental = this.fundamental;
        var num_partials = this.num_partials;
        var series = this.harmonic_series(fundamental, num_partials);

        this.set_frequencies_to_harmonic_series(fundamental);

        this.updateDisplay();

        // console.log( this.this_var, "CHECKPOINT what is this?" );
        // LESSON LEARNED: the "scope" or something like that means that at this time, "this" refernces to the quasi_spectrogram global object
    }
    , fundamental: 100 // Hz
    // , num_partials: 11 // up to the "tritone" (augmented fourth / diminished fifth)
    , num_partials: 16 // four octaves
    , set_frequencies_to_harmonic_series: function (fundamental) {
        this.frequencies = [];
        for (var partial_num = 1; partial_num <= this.num_partials; partial_num++) {
            this.frequencies.push(new this.Frequency(fundamental * partial_num, 1 / partial_num));
        }
        this.updateDisplay();
    }
    , frequencies: []
    , Frequency: function (freq, amp) {
        var new_obj = {
            frequency: freq
            , freq: freq
            , amplitude: amp
            , amp: amp
            , setAmplitude: function (amp) {
                this.amp = amp;
                this.amplitude = amp;
            }
            , setFrequency: function (freq) {
                this.freq = freq;
                this.frequency = frequency;
            }
            , getFrequency: function () {
                if (this.frequency != this.freq)
                    throw new Exception("uh oh, this.frequency != this.freq of this thing:", this);
                return this.frequency;
            }
            , getAmplitude: function () {
                if (this.amplitude != this.amp)
                    throw new Exception("uh oh, this.amplitude != this.amp of this thing:", this);
                return this.amp;
            }
        };
        return new_obj;
    }
    , harmonic_series: function (fundamental, num_partials) {
        var series = [];
        for (var i = 1; i <= num_partials; i++) {
            var partial_num = i;
            var frequency = partial_num * fundamental;
            var amplitude = 1 / partial_num;
            series[partial_num] = frequency;
        }
        return series;
    }
    , updateDisplay: function () {
        // note to self: i'm unsure of whether there's a convention that functional calls within an object have their names formatted in camelCase or with lowercase_and_underscores
        // oh well!
        // :) doesn't really matter haha

        this.ensure_enough_html_dom_for_frequencies();
        // YES! As of 4pm, this is correct! wehave enough "bars" (.h_line's) to update the CSS on the display


        for (var i = 0; i < this.frequencies.length; i++) {
            if (!this.frequencies.hasOwnProperty(i))
                continue;
            const frequency_obj = this.frequencies[i];
            const freq = frequency_obj.getFrequency();
            var amp = frequency_obj.getAmplitude();
            var partial_num = i + 1;

            const id = this.bar_id_to_dom_id(i);
            var bottom_scaled = frequency_obj.freq / 5;
            const { h, s, l } = this.hsl_from_freq_and_amp(freq, amp);
            var rgb_1 = hslToRgb(h, s, l);
            var rgb_2 = hslToRgb(h, s, l+13);
            var rgba_1 = hslToRgba(h, s, l+39, .75);
            var rgba_2 = hslToRgba(h, s+39, l, .69);
            // what's up here?
            // console.log("trying to set BG color of ",id,` which is freq ${freq} to have new CSS bottom value of bottom_scaled ${bottom_scaled} hsl ${h} ${s} ${l} rgb ${rgb}`);

            $(`#${id}`)
                .html(this.generate_inner_html_from_freq_amp(freq, amp, this.fundamental, partial_num))
                .stop()
                .css({ boxShadow: `0 -1px 0 ${rgba_1}`, borderBottom: `1px solid ${rgba_2}` })
                .animate(
                    {
                        backgroundColor: rgb_1
                        , color: rgb_2
                        , bottom: bottom_scaled + "px"
                    }
                    , Math.min(i + (i * 100),400)
                );
        }

    }
    , generate_inner_html_from_freq_amp: function (freq, amp, fundamental, partial_num) {
        var inner_html = "";
        inner_html += "<span class='fundamental_x_partial'>" + fundamental + " Hz * " + (partial_num) + "</span>";
        inner_html += "<span class='in_hz'>" + Math.round(freq) + " Hz</span>";
        return inner_html;
    }
    // B-) STYLE!!! let's get classy
    // how do we want each overtone to look?
    , hsl_from_freq_and_amp(freq,amp,partial_num) {
        var h = freq/8;
        while (h < 0) {
            h += 360;
        }
        if (h > 360) {
            h %= 360;
        }
        var s = 100;
        var l = Math.max(0, (amp * 46) + 4);

        return { h: h, s: s, l: l };
    }
    , parent_dom_id: 'spectrogram_3d'
    , parent_height: 400
    , bar_class: 'h_line'
    , bar_id_to_dom_id: function (bar_id) {
        return `${this.bar_class}${bar_id}`;
    }
    // if there aren't enough <div>'s with correct ID's and class names, then make more!
    , ensure_enough_html_dom_for_frequencies: function () {
        for (var i = 0; i <= this.frequencies.length; i++) {
            var bar_id = i;
            try {
                document.getElementById(this.bar_id_to_dom_id(bar_id)).style.bottom = `${i * 20}`;
            } catch (err) {
                var dom_id = this.bar_id_to_dom_id(bar_id);
                var new_html = `<div id="${dom_id}" class="${this.bar_class}"></div>`;
                document.getElementById(this.parent_dom_id).innerHTML += new_html;
            }
        }
    }
    , this_var: 'value'

    , last_misc_var: ''
};