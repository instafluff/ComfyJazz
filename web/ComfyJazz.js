//dependent on Howler.js https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.0/howler.min.js

const ComfyJazz = (options = {}) => {
  //Default property values, can be passed in and overidden
  const defaultOptions = {
    baseUrl: "web/sounds",
    instrument: "piano",
    autoNotesDelay: 300, //how often should we try to play notes?
    autoNotesChance: 0.2, //what % (0-1) chance is there to play an auto note?
    playAutoNotes: true, //should we automatically play notes?
    backgroundLoopUrl: "jazz_loop.ogg",
    backgroundLoopDuration: 27.428,
    volume: 1,
  };

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

      for (let i = 0; i < scaleProgression.length; i++) {
        if (scaleProgression[i].start <= currentTime && currentTime <= scaleProgression[i].end) {
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
    if (performance.now() - lastNoteTime > 900 || this.noteCount > this.maxnNotesPerPattern) {
      changePattern();
      noteCount = 0;
    }

    let e = scaleProgression[currentScaleProgression];
    scale = e.scale;
    let n = getNote(scale);
    while (n === lastNoteNumber) {
      n = getNote(scale);
    }

    // console.log(currentScaleProgression, pattern, scale);

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
  const maxnNotesPerPattern = 30;

  const scaleProgression = [
    {
      start: 0,
      end: 3.428,
      scale: "custom",
      targetNotes: [2, 4, 7],
      root: 7,
    },
    {
      start: 3.428,
      end: 6.857,
      scale: "diatonic",
      targetNotes: [2, 4, 7],
      root: 2,
    },
    {
      start: 6.857,
      end: 10.285,
      scale: "custom",
      targetNotes: [2, 4, 7],
      root: 7,
    },
    {
      start: 10.285,
      end: 12,
      scale: "diatonic",
      targetNotes: [4, 5, 9],
      root: 9,
    },
    {
      start: 12,
      end: 13.714,
      scale: "custom2",
      targetNotes: [2, 4, 11],
      root: 2,
    },
    {
      start: 13.714,
      end: 17.142,
      scale: "custom",
      targetNotes: [4, 7, 11],
      root: 11,
    },
    {
      start: 17.142,
      end: 20.571,
      scale: "custom",
      targetNotes: [0, 2, 4],
      root: 4,
    },
    {
      start: 20.571,
      end: 24,
      scale: "diatonic",
      targetNotes: [4, 5, 9],
      root: 9,
    },
    {
      start: 24,
      end: 27.428,
      scale: "custom2",
      targetNotes: [2, 4, 11],
      root: 2,
    },
  ];

  const scales = {
    diatonic: [0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0],
    dorian: [0, 1, 0, 0, -1, 0, 1, 0, 1, 0, 0, -1],
    phrygian: [0, 0, -1, 0, -1, 0, 1, 0, 0, -1, 0, -1],
    lydian: [0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
    mixolydian: [0, 1, 0, 1, 0, 0, -1, 0, -1, 0, 0, -1],
    aeolian: [0, -1, 0, 0, -1, 0, -1, 0, 0, -1, 0, -1],
    locrian: [0, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1],
    harmonicMinor: [0, 1, 0, 0, -1, 0, 1, 0, 0, -1, 1, 0],
    melodicMinor: [0, 1, 0, 0, -1, 0, 1, 0, -1, 0, 1, 0],
    majorPentatonic: [0, 1, 0, 1, 0, -1, 1, 0, 1, 0, -1, 1],
    minorPentatonic: [0, -1, 1, 0, -1, 0, 1, 0, -1, 1, 0, -1],
    doubleHarmonic: [0, 0, -1, 1, 0, 0, 1, 0, 0, -1, 1, 0],
    halfDim: [0, 1, 0, 0, -1, 0, 0, -1, 0, -1, 0, -1],
    chromatic: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    custom: [0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0],
    custom2: [-1, 0, 0, -1, 0, 0, 1, 0, 0, -1, 0, 0],
  };

  const patterns = [
    [71, 72, 69, 71, 67, 69, 64, 67, 62, 64, 62, 60, 59, 60, 62, 64, 65, 67, 69, 71, 67, 64, 62, 60, 59, 60, 57, 59, 55],
    [83, 88, 86, 81, 79, 83, 81, 76, 74, 79, 76, 72, 71, 72, 69, 67],
    [74, 72, 70, 69, 70, 67, 69, 65, 67, 62, 65, 63, 67, 70, 74, 77, 74, 77, 74, 72, 70, 69, 70, 67, 69, 65],
    [69, 74, 72, 67, 64, 69, 67, 62, 60, 64, 62, 57, 55, 60, 57, 53, 55, 57, 60, 62, 64, 65, 67, 62, 65, 64, 62, 64, 62, 60, 59],
    [
      59,
      60,
      64,
      67,
      71,
      72,
      76,
      79,
      83,
      84,
      88,
      91,
      95,
      98,
      95,
      98,
      95,
      91,
      88,
      91,
      88,
      84,
      83,
      86,
      83,
      79,
      76,
      79,
      76,
      72,
      71,
      74,
      71,
      67,
      64,
      67,
      64,
      60,
      59,
      55,
    ],
    [91, 86, 88, 84, 83, 86, 83, 79, 76, 79, 76, 72, 71, 74, 71, 67, 64, 67, 64, 60, 59, 60, 64, 67, 71, 72, 74, 76, 79, 74, 76, 71, 72, 67],
    [67, 65, 64, 65, 69, 72, 76, 79, 77, 76, 74, 76, 72, 71, 74, 71, 72, 67, 64, 67, 62, 60],
    [
      65,
      67,
      65,
      64,
      65,
      67,
      69,
      71,
      72,
      74,
      76,
      77,
      79,
      81,
      83,
      84,
      86,
      88,
      89,
      91,
      93,
      91,
      88,
      86,
      88,
      86,
      84,
      83,
      84,
      79,
      81,
      76,
      79,
      74,
      76,
      72,
      71,
      71,
      72,
      67,
    ],
    [55, 59, 60, 62, 67, 71, 72, 76, 79, 83, 86, 88, 93, 91, 88, 84, 81, 79, 77, 76, 74, 72, 71],
  ];

  const notes = [
    {
      url: "note_96",
      metaData: {
        root: 96,
        startRange: 95,
        endRange: 127,
      },
    },
    {
      url: "note_93",
      metaData: {
        root: 93,
        startRange: 92,
        endRange: 94,
      },
    },
    {
      url: "note_90",
      metaData: {
        root: 90,
        startRange: 89,
        endRange: 91,
      },
    },
    {
      url: "note_87",
      metaData: {
        root: 87,
        startRange: 86,
        endRange: 88,
      },
    },
    {
      url: "note_84",
      metaData: {
        root: 84,
        startRange: 83,
        endRange: 85,
      },
    },
    {
      url: "note_81",
      metaData: {
        root: 81,
        startRange: 80,
        endRange: 82,
      },
    },
    {
      url: "note_77",
      metaData: {
        root: 78,
        startRange: 77,
        endRange: 79,
      },
    },
    {
      url: "note_74",
      metaData: {
        root: 75,
        startRange: 74,
        endRange: 76,
      },
    },
    {
      url: "note_71",
      metaData: {
        root: 72,
        startRange: 71,
        endRange: 73,
      },
    },
    {
      url: "note_69",
      metaData: {
        root: 69,
        startRange: 68,
        endRange: 70,
      },
    },
    {
      url: "note_66",
      metaData: {
        root: 66,
        startRange: 65,
        endRange: 67,
      },
    },
    {
      url: "note_63",
      metaData: {
        root: 63,
        startRange: 62,
        endRange: 64,
      },
    },
    {
      url: "note_60",
      metaData: {
        root: 60,
        startRange: 59,
        endRange: 61,
      },
    },
    {
      url: "note_57",
      metaData: {
        root: 57,
        startRange: 56,
        endRange: 58,
      },
    },
    {
      url: "note_54",
      metaData: {
        root: 54,
        startRange: 53,
        endRange: 55,
      },
    },
    {
      url: "note_51",
      metaData: {
        root: 51,
        startRange: 50,
        endRange: 52,
      },
    },
    {
      url: "note_48",
      metaData: {
        root: 48,
        startRange: 0,
        endRange: 49,
      },
    },
  ];

  return cj;
};
