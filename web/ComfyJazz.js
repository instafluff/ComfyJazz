//dependent on Howler.js https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.0/howler.min.js

const ComfyJazz = (options = {}) => {
  const cj = { ...defaultOptions, ...options };

  /////////////////////
  //ComfyJazz Methods

  cj.setVolume = (vol) => {
    cj.volume = vol;

    if( cj.backgroundSound ) {
      cj.backgroundSound.volume(vol);
    }
      if( cj.lastSound ) {
      cj.lastSound.volume(vol);
    }

  };

  cj.mute = () => cj.setVolume(0);
  cj.unmute = () => cj.setVolume(1);
  cj.isMuted = () => cj.volume <= 0;
  cj.start = () => startComfyJazz();

  cj.playNoteProgression = playNoteProgression;
  cj.playNote = playNoteRandomly;

  /////////////////////

  async function startComfyJazz() {
    let startTime = performance.now();

    //initial start of the background music
    playBackgroundSound(`${cj.baseUrl}/${cj.backgroundLoopUrl}`, cj.volume, 1); //1.0594630943592953

    //this will Automatically play a note and then call itself again after a delay
    const AutomaticPlayNote = async () => {
      let currentTime = (performance.now() - startTime) / 1000;

      if (currentTime > cj.backgroundLoopDuration) {
        startTime = performance.now();
        currentTime = 0;

        // play the background music again
        playBackgroundSound(`${cj.baseUrl}/${cj.backgroundLoopUrl}`, cj.volume, 1);
      }

      for (let i = 0; i < scaleProgressions.length; i++) {
        if (scaleProgressions[i].start <= currentTime && currentTime <= scaleProgressions[i].end) {
          currentScaleProgression = i;
          break;
        }
      }

      //play a note 20% of the time
      if (cj.playAutoNotes && Math.random() < cj.autoNotesChance) {
        playNoteRandomly(0, 200);
      }

      //here's what will loop
      setTimeout(AutomaticPlayNote, cj.autoNotesDelay);
    };

    //start the Automatic Note Player loop
    AutomaticPlayNote();
  }

  //Play a note with possible random delay
  async function playNoteRandomly(minRandom = 0, maxRandom = 200) {
    setTimeout(async () => {
      let sound = getNextNote();
	  const instruments = cj.instrument.split( "," ).map( x => x.trim() );
	  let instrument = instruments[ getRandomInt( instruments.length ) ];
      await playSound(`${cj.baseUrl}/${instrument}/${sound.url}.ogg`, cj.volume, sound.playbackRate);
    }, minRandom + Math.random() * maxRandom);
  }

  //Play a progression of notes, with random delay spacing!
  function playNoteProgression(numNotes) {
    for (var i = 0; i < numNotes; i++) {
      playNoteRandomly(100, 200 * i);
    }
  }

  ////////////////////////////////
  //The fancy music playing functions
  ////////////////////////////////

  function semitonesToPlaybackRate(t) {
    var e = Math.pow(2, 1 / 12);
    return Math.pow(e, t);
  }

  function shiftSource( tone, startRange, endRange ) {
  	let a = startRange
  	  , u = endRange
  	  , c = new WeakMap;

  	// var e = c.get( tone );
  	// if( e ) return e;
  	let n = a + Math.random() * ( u - a );
  	// c.set( tone, n );
  	return n;
  }

  function playBackgroundSound(url, volume = 1, rate = 1) {
    return new Promise((resolve, reject) => {
      let a = new Howl({
        src: [url],
        volume: volume,
        onend: function () {
          resolve();
        },
      });
      a.rate(rate);
      a.play();
      cj.backgroundSound = a;
    });
  }

  function playSound(url, volume = 1, rate = 1) {
    return new Promise((resolve, reject) => {
      let a = new Howl({
        src: [url],
        volume: volume,
        onend: function () {
          resolve();
        },
      });
      a.rate(rate);
      a.play();
      a.fade( volume, 0.0, 1000 );//a.duration() * 500 );
      cj.lastSound = a;
    });
  }

  function getNextNote() {
    if (performance.now() - lastNoteTime > 900 || this.noteCount > maxNotesPerPattern) {
      changePattern();
      noteCount = 0;
    }

    let e = scaleProgressions[currentScaleProgression];
    scale = e.scale;
    let n = getNote(scale);
    while (n === lastNoteNumber) {
      n = getNote(scale);
    }

    // console.log(currentScaleProgressions, pattern, scale);

    if (e.root !== lastRoot) {
      n = scaleifyNote(n, e.targetNotes);
    }

    var a = n || 48,
      s = null;
    s = notes.filter((x) => x.metaData.startRange <= a && a <= x.metaData.endRange)[0];
	// NOTE: OOPS THIS MIGHT BE THE WRONG SPOT FOR SHIFTSOURCE
	// let shifted = shiftSource( s.metaData.root, s.metaData.startRange, s.metaData.endRange );
    let c = a - s.metaData.root;
    let playbackRate = semitonesToPlaybackRate(c);
    // console.log("playback", c, playbackRate);
    let playNote = s;
    playNote.playbackRate = playbackRate;

    noteCount++;
    lastNoteTime = performance.now();
    lastNoteNumber = n;
    lastRoot = e.root;
    return playNote;
  }

  function getNote(scale) {
    // scale.length || (scale = e.scalesToUse[Math.floor(Math.random() * e.scalesToUse.length)]),
    if (pattern < 0) {
      changePattern();
    }
    let t = patterns[pattern][currentStep];
    let n = t + scales[scale][t % 12];
    let r = transpose + n;
    currentStep = (currentStep + 1) % patterns[pattern].length;
    return r;
  }

  function getRandomInt(number) {
    return Math.floor(number * Math.random());
  }

  function changePattern() {
    pattern = getRandomInt(patterns.length);
    currentStep = 0;
  }

  function getClosestTarget(t, e) {
    return t.reduce(function (t, n) {
      return Math.abs(n - e) < Math.abs(t - e) ? n : t;
    });
  }

  function scaleifyNote(t, e) {
    var n = ((t % 12) + 5) % 12;
    if (
      void 0 ==
      e.filter(function (t) {
        return t === n;
      })[0]
    ) {
      var r = getClosestTarget(e, t),
        o = (t -= n - r);
      t = o += scales[scale][((o % 12) + 5) % 12];
    }
    return t;
  }

  function getNoteFromSemitone(tone) {
    return notes.filter((x) => x.metaData.startRange <= tone && tone <= x.metaData.endRange)[0];
  }

  let currentScaleProgression = 0;
  let root = 0;
  let lastRoot = undefined;
  let pattern = -1;
  let scale = "custom";
  let transpose = -5;
  let currentStep = 0;
  let lastNoteTime = 0;
  let lastNoteNumber = 0;
  let noteCount = 0;

  return cj;
};
