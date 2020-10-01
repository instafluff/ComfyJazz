function semitonesToPlaybackRate( t ) {
	var e = Math.pow(2, 1 / 12);
	return Math.pow(e, t);
}
//
// function shiftSource( tone, startRange, endRange ) {
// 	let a = startRange
// 	  , u = endRange
// 	  , c = new WeakMap;
//
// 	var e = c.get( tone );
// 	if( e ) return e;
// 	let n = a + Math.random() * ( u - a );
// 	c.set( t, n );
// 	return n;
// }

function playSound( url, volume = 1, rate = 1 ) {
    return new Promise( ( resolve, reject ) => {
		let a = new Howl({
			src: [ url ],
			volume: volume,
			onend: function() {
				resolve();
			}
		});
		a.rate( rate );
		a.play();
	});
}

function getNextNote() {
	if( performance.now() - lastNoteTime > 900 || this.noteCount > this.maxnNotesPerPattern ) {
		changePattern();
		noteCount = 0;
	}

	let e = scaleProgression[ currentScaleProgression ];
	scale = e.scale;
	let n = getNote( scale );
	while( n === lastNoteNumber ) {
		n = getNote( scale );
	}

	console.log( currentScaleProgression, pattern, scale );

	if( e.root !== lastRoot ) {
		n = scaleifyNote( n, e.targetNotes );
	}

	var a = n || 48
	  , s = null;
	s = notes.filter( x => x.metaData.startRange <= a && a <= x.metaData.endRange )[ 0 ];
	let c = a - s.metaData.root;
	let playbackRate = semitonesToPlaybackRate( c );
	console.log( "playback", c, playbackRate );
	let playNote = s;
	playNote.playbackRate = playbackRate;

	noteCount++;
	lastNoteTime = performance.now();
	lastNoteNumber = n;
	lastRoot = e.root;
	return playNote;
}

function getNote( scale ) {
	// scale.length || (scale = e.scalesToUse[Math.floor(Math.random() * e.scalesToUse.length)]),
	if( pattern < 0 ) {
		changePattern();
	}
	let t = patterns[ pattern ][ currentStep ];
	let n = t + scales[ scale ][ t % 12 ];
	let r = transpose + n;
	currentStep = ( currentStep + 1 ) % patterns[ pattern ].length;
	return r;
}

function getRandomInt( number ) {
	return Math.floor( number * Math.random() );
}

function changePattern() {
	pattern = getRandomInt( patterns.length );
	currentStep = 0;
}

function getClosestTarget( t, e ) {
	return t.reduce( function( t, n ) {
		return Math.abs( n - e ) < Math.abs( t - e ) ? n : t;
	} );
}

function scaleifyNote( t, e ) {
	var n = ( t % 12 + 5 ) % 12;
	if( void 0 == e.filter((function(t) {
		return t === n
	}
	))[0]) {
		var r = getClosestTarget( e, t )
		  , o = t -= n - r;
		t = o += scales[ scale ][(o % 12 + 5) % 12 ]
	}
	return t;
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

const scaleProgression = [{
	start: 0,
	end: 3.428,
	scale: "custom",
	targetNotes: [2, 4, 7],
	root: 7
}, {
	start: 3.428,
	end: 6.857,
	scale: "diatonic",
	targetNotes: [2, 4, 7],
	root: 2
}, {
	start: 6.857,
	end: 10.285,
	scale: "custom",
	targetNotes: [2, 4, 7],
	root: 7
}, {
	start: 10.285,
	end: 12,
	scale: "diatonic",
	targetNotes: [4, 5, 9],
	root: 9
}, {
	start: 12,
	end: 13.714,
	scale: "custom2",
	targetNotes: [2, 4, 11],
	root: 2
}, {
	start: 13.714,
	end: 17.142,
	scale: "custom",
	targetNotes: [4, 7, 11],
	root: 11
}, {
	start: 17.142,
	end: 20.571,
	scale: "custom",
	targetNotes: [0, 2, 4],
	root: 4
}, {
	start: 20.571,
	end: 24,
	scale: "diatonic",
	targetNotes: [4, 5, 9],
	root: 9
}, {
	start: 24,
	end: 27.428,
	scale: "custom2",
	targetNotes: [2, 4, 11],
	root: 2
}];

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
	custom2: [-1, 0, 0, -1, 0, 0, 1, 0, 0, -1, 0, 0]
};

const patterns = [
	[71, 72, 69, 71, 67, 69, 64, 67, 62, 64, 62, 60, 59, 60, 62, 64, 65, 67, 69, 71, 67, 64, 62, 60, 59, 60, 57, 59, 55],
	[83, 88, 86, 81, 79, 83, 81, 76, 74, 79, 76, 72, 71, 72, 69, 67],
	[74, 72, 70, 69, 70, 67, 69, 65, 67, 62, 65, 63, 67, 70, 74, 77, 74, 77, 74, 72, 70, 69, 70, 67, 69, 65],
	[69, 74, 72, 67, 64, 69, 67, 62, 60, 64, 62, 57, 55, 60, 57, 53, 55, 57, 60, 62, 64, 65, 67, 62, 65, 64, 62, 64, 62, 60, 59],
	[59, 60, 64, 67, 71, 72, 76, 79, 83, 84, 88, 91, 95, 98, 95, 98, 95, 91, 88, 91, 88, 84, 83, 86, 83, 79, 76, 79, 76, 72, 71, 74, 71, 67, 64, 67, 64, 60, 59, 55],
	[91, 86, 88, 84, 83, 86, 83, 79, 76, 79, 76, 72, 71, 74, 71, 67, 64, 67, 64, 60, 59, 60, 64, 67, 71, 72, 74, 76, 79, 74, 76, 71, 72, 67],
	[67, 65, 64, 65, 69, 72, 76, 79, 77, 76, 74, 76, 72, 71, 74, 71, 72, 67, 64, 67, 62, 60],
	[65, 67, 65, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89, 91, 93, 91, 88, 86, 88, 86, 84, 83, 84, 79, 81, 76, 79, 74, 76, 72, 71, 71, 72, 67],
	[55, 59, 60, 62, 67, 71, 72, 76, 79, 83, 86, 88, 93, 91, 88, 84, 81, 79, 77, 76, 74, 72, 71]
];

function getNoteFromSemitone( tone ) {
	return notes.filter( x => x.metaData.startRange <= tone && tone <= x.metaData.endRange )[ 0 ];
}

const notes = [
	{
		id: "15440",
		url: "15440_a9f36d2753fd812d2be727f2b69445f2_piano_sampler_96",
		metaData: {
			root: 96,
			startRange: 95,
			endRange: 127
		},
	}, {
		id: "15441",
		url: "15441_1a45611474d755094d3841d9ffef46c1_piano_sampler_93",
		metaData: {
			root: 93,
			startRange: 92,
			endRange: 94
		},
	}, {
		id: "15442",
		url: "15442_5b743aaf50a35729b09a217a6b6807cd_piano_sampler_90",
		metaData: {
			root: 90,
			startRange: 89,
			endRange: 91
		},
	}, {
		id: "15443",
		url: "15443_73b0c4eb9f154dc8404a48cb495ade7b_piano_sampler_87",
		metaData: {
			root: 87,
			startRange: 86,
			endRange: 88
		},
	}, {
		id: "15444",
		url: "15444_e33cd8836bf877fc69a97b23a22662d1_piano_sampler_84",
		metaData: {
			root: 84,
			startRange: 83,
			endRange: 85
		},
	}, {
		id: "15458",
		url: "15458_117b506578c86e821389674482572cef_piano_sampler_81",
		metaData: {
			root: 81,
			startRange: 80,
			endRange: 82
		},
	}, {
		id: "15446",
		url: "15446_d86155fee288cac69b9d6f10cefd79dc_piano_sampler_77",
		metaData: {
			root: 78,
			startRange: 77,
			endRange: 79
		},
	}, {
		id: "15447",
		url: "15447_c6947c09cab559792f61c80df6d24ea1_piano_sampler_74",
		metaData: {
			root: 75,
			startRange: 74,
			endRange: 76
		},
	}, {
		id: "15448",
		url: "15448_22c5d06f2860e3a37d4130b61d1367cb_piano_sampler_71",
		metaData: {
			root: 72,
			startRange: 71,
			endRange: 73
		},
	}, {
		id: "15449",
		url: "15449_9d4e9a8d3c56812f838ce676c2d2429f_piano_sampler_69",
		metaData: {
			root: 69,
			startRange: 68,
			endRange: 70
		},
	}, {
		id: "15450",
		url: "15450_d28740d20d8b8f36b0cd05ad789f92ba_piano_sampler_66",
		metaData: {
			root: 66,
			startRange: 65,
			endRange: 67
		},
	}, {
		id: "15451",
		url: "15451_9920f947e7a0f61b9d48e9360a733411_piano_sampler_63",
		metaData: {
			root: 63,
			startRange: 62,
			endRange: 64
		},
	}, {
		id: "15457",
		url: "15457_4ae62d5265ee9fcac6976dba3c647e16_piano_sampler_60",
		metaData: {
			root: 60,
			startRange: 59,
			endRange: 61
		},
	}, {
		id: "15453",
		url: "15453_5476c8016ae8fd0c5f3004aa3e2797f4_piano_sampler_57",
		metaData: {
			root: 57,
			startRange: 56,
			endRange: 58
		},
	}, {
		id: "15454",
		url: "15454_500b392917fdbd5d3ec07eb2884f62a1_piano_sampler_54",
		metaData: {
			root: 54,
			startRange: 53,
			endRange: 55
		},
	}, {
		id: "15455",
		url: "15455_b47d23a7fe95e03f63f59beaebd5f8a7_piano_sampler_51",
		metaData: {
			root: 51,
			startRange: 50,
			endRange: 52
		},
	}, {
		id: "15456",
		url: "15456_bce1749ab8fed6d5aa25b196056183b6_piano_sampler_48",
		metaData: {
			root: 48,
			startRange: 0,
			endRange: 49
		},
	}
];

let files = [{
	id: "15524",
	url: "15524_977c2821fbcf14f51358e08bc046c0c3_rollover",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15504",
	url: "15504_5393ee93b85c850534c3a2bf99454a44_200917_amati_home",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15520",
	url: "15520_9f6ea519fa18de197fdddf08a83b6307_200917_amati_uideselect",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15521",
	url: "15521_acca9111763459399fa45d1e2ddbe539_200917_amati_uiselect",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15516",
	url: "15516_4aa772fc1bc07d3e7f4f7828e62269b3_200917_amati_componentfocus",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15518",
	url: "15518_7218b27d855f4bdadda9eea93374d0c7_200917_amati_transitionbackwardz",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15519",
	url: "15519_b373a2f9ca2e5d74e114394fe6877c5a_200917_amati_transitionforwardz",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15440",
	url: "15440_a9f36d2753fd812d2be727f2b69445f2_piano_sampler_96",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15441",
	url: "15441_1a45611474d755094d3841d9ffef46c1_piano_sampler_93",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15442",
	url: "15442_5b743aaf50a35729b09a217a6b6807cd_piano_sampler_90",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15443",
	url: "15443_73b0c4eb9f154dc8404a48cb495ade7b_piano_sampler_87",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15444",
	url: "15444_e33cd8836bf877fc69a97b23a22662d1_piano_sampler_84",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15458",
	url: "15458_117b506578c86e821389674482572cef_piano_sampler_81",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15446",
	url: "15446_d86155fee288cac69b9d6f10cefd79dc_piano_sampler_77",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15447",
	url: "15447_c6947c09cab559792f61c80df6d24ea1_piano_sampler_74",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15448",
	url: "15448_22c5d06f2860e3a37d4130b61d1367cb_piano_sampler_71",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15449",
	url: "15449_9d4e9a8d3c56812f838ce676c2d2429f_piano_sampler_69",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15450",
	url: "15450_d28740d20d8b8f36b0cd05ad789f92ba_piano_sampler_66",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15451",
	url: "15451_9920f947e7a0f61b9d48e9360a733411_piano_sampler_63",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15457",
	url: "15457_4ae62d5265ee9fcac6976dba3c647e16_piano_sampler_60",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15453",
	url: "15453_5476c8016ae8fd0c5f3004aa3e2797f4_piano_sampler_57",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15454",
	url: "15454_500b392917fdbd5d3ec07eb2884f62a1_piano_sampler_54",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15455",
	url: "15455_b47d23a7fe95e03f63f59beaebd5f8a7_piano_sampler_51",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15456",
	url: "15456_bce1749ab8fed6d5aa25b196056183b6_piano_sampler_48",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15439",
	url: "15439_f526d889c4bfa24d6f891b6ea6a4daad_google_night_in_teaser_loop",
	file_type: "audio",
	load_group: "auto"
}, {
	id: "15427",
	url: "15427_c2b68285b54516eac799112c3edb5800_button_click",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15523",
	url: "15523_2f7d7eb7c6b2484078decd4b4a5f9543_countdown_r1",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15462",
	url: "15462_a8efee8220f686b8a0df980a5e4f1619_google_ni_ui_buttonpopup2",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15460",
	url: "15460_e367db167bed6155de69d142ec7c8bb2_google_ni_ui_transition1",
	file_type: "audio",
	load_group: "ui"
}, {
	id: "15517",
	url: "15517_cafc97ab523ab71507f18cd7fbb78fa9_200917_amati_applaunch",
	file_type: "audio",
	load_group: "ui"
}];
