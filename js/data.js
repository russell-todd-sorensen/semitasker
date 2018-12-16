// JavaScript Document


var Data = {};
Data.url = document.url;
Data.Restored = {};
Data.fontFamily = [
    'Agency FB Bold',
    'Agency FB',
    'Aharoni Bold',
    'Algerian',
    'Andalus',
    'Aparajita',
    'Aparajita Bold',
    'Aparajita Bold Italic',
    'Aparajita Italic',
    'Arial Rounded MT Bold',
    'Arial',
    'Arial Narrow',
    'Arial Bold',
    'Arial Bold Italic',
    'Arial Italic',
    'Bauhaus 93',
    'Berlin Sans FB',
    'Berlin Sans FB Demi Bold',
    'Berlin Sans FB Bold',
    'Bernard MT Condensed',
    'Birch Std',
    'Bitstream Vera Sans Mono',
    'Bitstream Vera Sans Mono Bold',
    'Blackadder ITC',
    'Blackoak Std',
    'Bodoni MT Condensed',
    'Bodoni MT Condensed Bold',
    'Bodoni MT Condensed Bold Italic',
    'Bodoni MT Condensed Italic',
    'Bodoni MT',
    'Bodoni MT Bold',
    'Bodoni MT Bold Italic',
    'Bodoni MT Italic',
    'Bodoni MT Black',
    'Bodoni MT Black Italic',
    'Book Antiqua',
    'Book Antiqua Bold',
    'Book Antiqua Bold Italic',
    'Book Antiqua Italic',
    'Bookman Old Style',
    'Bookman Old Style Bold',
    'Bookman Old Style Bold Italic',
    'Bookman Old Style Italic',
    'Bookshelf Symbol 7',
    'Bradley Hand ITC',
    'Britannic Bold',
    'Broadway',
    'Browallia New',
    'Browallia New Bold',
    'Browallia New Bold Italic',
    'Browallia New Italic',
    'Brush Script MT Italic',
    'Brush Script Std',
    'Buxton Sketch',
    'Calibri',
    'Calibri Bold',
    'Calibri Bold Italic',
    'Calibri Italic',
    'Californian FB',
    'Californian FB Bold',
    'Calisto MT',
    'Calisto MT Bold',
    'Calisto MT Bold Italic',
    'Calisto MT Italic',
    'Cambria',
    'Cambria Bold',
    'Cambria Bold Italic',
    'Cambria Italic',
    'Cambria Math',
    'Candara',
    'Candara Bold',
    'Candara Bold Italic',
    'Candara Italic',
    'Adobe Caslon Pro',
    'Adobe Caslon Pro Bold',
    'Castellar',
    'Centaur',
    'Century',
    'Century Gothic',
    'Century Gothic Bold',
    'Century Gothic Bold Italic',
    'Century Gothic Italic',
    'Century Schoolbook',
    'Century Schoolbook Bold',
    'Century Schoolbook Bold Italic',
    'Century Schoolbook Italic',
    'Chaparral Pro',
    'Charlemagne Std',
    'Chiller',
    'Colonna MT',
    'Comic Sans MS',
    'Comic Sans MS Bold',
    'Consolas',
    'Consolas Bold',
    'Consolas Bold Italic',
    'Consolas Italic',
    'Constantia',
    'Constantia Bold',
    'Constantia Bold Italic',
    'Constantia Italic',
    'Cooper Black',
    'Copperplate Gothic Bold',
    'Copperplate Gothic Light',
    'Corbel',
    'Corbel Bold',
    'Corbel Bold Italic',
    'Corbel Italic',
    'Cordia New',
    'Cordia New Bold',
    'Cordia New Bold Italic',
    'Cordia New Italic',
    'Monotype Corsiva',
    'Courier New',
    'Courier New Bold',
    'Courier New Bold Italic',
    'Courier New Italic',
    'Curlz MT',
   // 'Ebrima Bold',
   // 'ErasITC Bold',
   // 'ErasITC Demi',
   // 'ErasITC Light',
   // 'ErasITC Medium',
    'Ebrima',
    'Ebrima Bold',
    'Edwardian Script ITC',
    'Elephant',
    'Elephant Italic',
    'Engravers MT',
    'Eras Bold ITC',
    'Eras Demi ITC',
    'Eras Light ITC',
    'Eras Medium ITC',
    'Estrangelo Edessa',
    'Euphemia',
    'Felix Titling',
    'Footlight MT Light',
    'Forte',
    'Franklin Gothic Book',
    'Franklin Gothic Demi',
    'Franklin Gothic Demi Cond',
    'Franklin Gothic Heavy',
    'Franklin Gothic Medium',
    'Franklin Gothic Medium Cond',
    'FreesiaUPC',
    'FreesiaUPC Bold',
    'FreesiaUPC Bold Italic',
    'FreesiaUPC Italic',
    'Gabriola',
    'Garamond',
    'Garamond Bold',
    'Adobe Garamond Pro',
    'Adobe Garamond Pro Bold',
    'Gautami',
    'Gautami Bold',
    'Georgia',
    'Georgia Bold',
    'Georgia Bold Italic',
    'Georgia Italic',
    'Giddyup Std',
    'Gigi',
    'Gill Sans MT',
    'Gill Sans MT Bold',
    'Gill Sans Ultra Bold',
    'Gill Sans MT Ext Condensed Bold',
    'Gill Sans Ultra Bold Condensed',
    'Gloucester MT Extra Condensed',
    'Gisha',
    'Gisha Bold',
    'Goudy Old Style',
    'Goudy Old Style Bold',
    'Goudy Stout',
    'Haettenschweiler',
    'Harlow Solid Italic',
    'Harrington',
    'High Tower Text',
    'High Tower Text Italic',
    'Hobo Std',
    'Impact',
    'Imprint MT Shadow',
    'Informal Roman',
    'JasmineUPC',
    'JasmineUPC Bold',
    'JasmineUPC Bold Italic',
    'JasmineUPC Italic',
    'Jokerman',
    'Juice ITC',
    'Kalinga',
    'Kalinga Bold',
    'Kartika',
    'Kartika Bold',
    'Khmer UI',
    'Khmer UI Bold',
    'Kristen ITC',
    'Kunstler Script',
    'Lao UI',
    'Lao UI Bold',
    'Latha',
    'Latha Bold',
    'Leelawadee',
    'Leelawadee Bold',
    'Letter Gothic Std',
    'Levenim MT',
    'Levenim MT Bold',
    'Lithos Pro Regular',
    'LilyUPC',
    'LilyUPC Bold',
    'LilyUPC Bold Italic',
    'LilyUPC Italic',
   // 'Lithos Pro Black',
    'Lucida Bright',
    'Lucida Bright Demibold',
    'Lucida Bright Demibold Italic',
    'Lucida Bright Italic',
    'Lucida Calligraphy Italic',
    'Lucida Console',
    'Lucida Fax',
    'Lucida Fax Demibold',
    'Lucida Fax Demibold Italic',
    'Lucida Fax Italic',
    'Lucida Handwriting Italic',
    'Lucida Sans',
    'Lucida Sans Demibold Roman',
    'Lucida Sans Demibold Italic',
    'Lucida Sans Italic',
    'Lucida Sans Typewriter',
    'Lucida Sans Typewriter Bold',
    'Lucida Sans Typewriter Oblique',
    'Lucida Sans Unicode',
    'Magneto Bold',
    'Maiandra GD',
    'Mangal',
    'Mangal Bold',
    'Matura MT Script Capitals',
    'Meiryo UI',
    'Meiryo UI Bold',
    'Meiryo UI Bold Italic',
    'Meiryo UI Italic',
    'Mesquite Std',
    'Microsoft New Tai Lue',
    'Microsoft New Tai Lue Bold',
    'Microsoft PhagsPa',
    'Microsoft PhagsPa Bold',
    'Microsoft Sans Serif',
    'Microsoft Tai Le',
    'Microsoft Tai Le Bold',
    'Microsoft Yi Baiti',
    'Miriam',
    'Miriam Fixed',
    'Mistral',
    'Modern No. 20',
    'MoolBoran',
    'MS Outlook',
    'MS Reference Sans Serif',
    'MS Reference Specialty',
    'MS PGothic',
    'MS UI Gothic',
    'MS Gothic',
    'MT Extra',
    'MV Boli',
    'Myriad Pro',
    'Myriad Pro Cond',
    'Myriad Web Pro',
    'Myriad Web Pro Bold',
    'Myriad Web Pro Italic',
  //  'Myriad Pro',
    //'PMing Li U',
  //  'Adobe Gothic Std Bold KS Cpc EUC-H'
    'Niagara Engraved',
    'Niagara Solid',
    'Narkisim',
    'Nueva Std Cond',
    'Nyala',
    'OCR A Extended',
    'OCR A Std',
    'Onyz',
    'Orator Std',
    'Papyrus',
    'Parchment',
    'Perpetua Titling MT',
    'Perpetua Titling MT Bold',
    'Playbill',
    'Poor Richard',
    'Poplar Std',
    'Prestige Elite Std',
    'Pristina',
    'Raavi',
    'Rage Italic',
    'Ravie',
    'Rockwell',
    'Rockwell Bold',
    'Rockwell Bold Italic',
    'Rockwell Italic',
    'Rockwell Condensed',
    'Rockwell Condensed Bold',
    'Rockwell Extra Bold',
    'Rod',
    'Rosewood Std Regular',
    'Sakkal Majalla',
    'Sakkal Majalla Bold',
    'Script MT Bold',
    'Segoe Marker',
    'Segoe Print',
    'Segoe Print Bold',
    'Segoe Script',
    'Segoe Script Bold',
    'Segoe UI Light',
    'Segoe UI',
    'Segoe UI Italic',
    'Segoe UI Semibold',
    'Segoe UI Bold',
    'Segoe UI Bold Italic',
    'Segoe UI Symbol',
    'Showcard Gothic',
    'Shruti',
    'Shruti Bold',
    'SketchFlow Print',
    'Snap ITC',
    'Stencil',
    'Stencil Std',
    'Sylfaen',
    'Symbol',
    'Tahoma',
    'Tahoma Bold',
    'Tekton Pro',
    'Tekton Pro Ext',
    'Tekton Pro Cond',
    'Tempus Sans ITC',
    'Trajan Pro',
    'Trebuchet MS',
    'Trebuchet MS Bold',
    'Trebuchet MS Bold Italic',
    'Trebuchet MS Italic',
    'Tunga',
    'Tunga Bold',
    'Tw Cen MT',
    'Tw Cen MT Bold',
    'Tw Cen MT Bold Italic',
    'Tw Cen MT Italic',
    'Tw Cen MT Condensed',
    'Tw Cen MT Condensed Bold',
    'Tw Cen MT Condensed Extra Bold',
    'Utsaah',
    'Utsaah Bold',
    'Utsaah Bold Italic',
    'Utsaah Italic',
    'Vani',
    'Vani Bold',
    'Verdana',
    'Verdana Bold',
    'Verdana Bold Italic',
    'Verdana Italic',
    'Viner Hand ITC',
    'Vivaldi Italic',
    'Vladimir Script',
    'Vrinda',
    'Vrinda Bold',
    'Webdings',
    'Wide Latin',
    'Wingdings',
    'Wingdings 2',
    'Wingdings 3'
];

Data.Images = [
		{url: '/images/Butterfly%206.jpg',alt:'Butterfly 6'},
		{url: '/images/Butterfly%2017a.jpg',alt:'Butterfly 17a'},
		{url: '/images/Butterfly%2028.jpg',alt:'Butterfly 28'},
		{url: '/images/Butterfly%2057.jpg',alt:'Butterfly 57'},
		{url: '/images/Butterfly%2062.jpg',alt:'Butterfly 62'},
		{url: '/images/Butterfly%2086.jpg',alt:'Butterfly 86'},
		{url: '/images/Grasshopper%201.JPG',alt:'Grasshopper 1'},
		{url: '/images/Ladybug%206.jpg',alt:'Ladybug 6'},
		{url: '/images/building-1.jpg',alt:'Building 1'},
		{url: '/images/sphinx5.jpg',alt:'Sphinx 5'},
		{url: '/images/egypt-2.jpg',alt:'Egypt 2'},
		{url: '/images/EgyptianTomb.jpg',alt:'Egyptian Tomb'},
		{url: '/images/stone-hut-1.jpg',alt:'Stone Hut 1'},
		{url: '/images/stone-wall-1.jpg',alt:'Stone Wall 1'},
		{url: '/images/stone-arch-1.jpg',alt:'Stone Arch 1'},
		{url: '/images/igloo2.jpg',alt:'Igloo 2'},
		{url: '/images/rotunda-statue.jpg',alt:'Rotunda Statue'},
		{url: '/images/staircase-1.jpg',alt:'Spiral Staircase 1'},
		{url: '/images/red-fence-1.jpg',alt:'Red Fence 1'},
		{url: '/images/palace-1.jpg',alt:'Palace 1'},
		{url: '/images/london-plaza-1.jpg',alt:'London Plaza 1'},
		{url: '/images/glass-pyramids.jpg',alt:'Glass Pyramid'},
		{url: '/images/old-man-with-hat.jpg',alt:'Old Man with Hat'},
		{url: '/images/Woman-183.jpg',alt:'Woman with Hands'},
		{url: '/images/Woman-214.jpg',alt:'Woman with Hat'},
		{url: '/images/jelly-fish-1.jpg',alt:'Jelly Fish 1'},
		{url: '/images/jelly-fish-2.jpg',alt:'Jelly Fish 2'},
		{url: '/images/fishes-3.gif',alt:'Fishes 3'},
		{url: '/images/parrot-1.jpg',alt:'Parrot Headshot'},
		{url: '/images/parrot-2.jpg',alt:'Parrot in Tree'},
		{url: '/images/feathers-1.jpg',alt:'Peacock Feathers'},
		{url: '/images/feathers-2.jpg',alt:'Peacock'},
		{url: '/images/Butterfly%2017.jpg',alt:'Butterfly 17'},
		{url: '/images/Butterfly%2022.jpg',alt:'Butterfly 22'},
		{url: '/images/Butterfly%2036.png',alt:'Butterfly 36'},
		{url: '/images/Butterfly%2069.png',alt:'Butterfly 69'},
		{url: '/images/desert-1.jpg',alt:'Desert Landscape'},
		{url: '/images/swan-1.jpg',alt:'Swan on Pond'},
		{url: '/images/us-flag-1.jpg',alt:'US Flag 1'},
		{url: '/images/golden-gate-1.jpg', alt: 'Golden Gate 1'},
		{url: '/images/golden-gate-2.jpg', alt: 'Golden Gate 2'},
		{url: '/images/sky-1.jpg', alt: 'Sky 1'},
		{url: '/images/E1777.jpg', alt: 'Clouds &amp; Blue Sky'},
		{url: '/images/fountain-1.jpg', alt: 'Fountain 1'},
		{url: '/images/fountain-2.jpg', alt: 'Fountain 2'},
		{url: '/images/fountain-3.jpg', alt: 'Fountain 3'},
		{url: '/images/wildmanlogo-1.svg',alt:'Wildman Logo 1'},
		{url: '/images/tartan2.gif', alt: 'Tartan 2'},
		{url: '/images/desktop-background-images/grid.svg', alt: 'Grid For testing'},
		{url: '/images/desktop-background-images/mandelbrot-001.png', alt: 'Mandelbrot 001'},
		{url: '/images/desktop-background-images/mandelbrot-0011.png', alt: 'Mandelbrot 011'},
		{url: '/images/desktop-background-images/mandelbrot-0012.png', alt: 'Mandelbrot 0012'},
		{url: '/images/desktop-background-images/mandelbrot-0013.png', alt: 'Mandelbrot 0013'},
		{url: '/images/desktop-background-images/mandelbrot-0014.png', alt: 'Mandelbrot 0014'},
		{url: '/images/desktop-background-images/mandelbrot-0015.png', alt: 'Mandelbrot 0015'},
		{url: '/images/desktop-background-images/mandelbrot-0016.png', alt: 'Mandelbrot 0016'},
		{url: '/images/desktop-background-images/mandelbrot-0017.png', alt: 'Mandelbrot 0017'},
		{url: '/images/desktop-background-images/mandelbrot-0018.png', alt: 'Mandelbrot 0018'},
		{url: '/images/desktop-background-images/mandelbrot-0019.png', alt: 'Mandelbrot 0019'},
		{url: '/images/desktop-background-images/mandelbrot-0020.png', alt: 'Mandelbrot 0020'},
		{url: '/images/desktop-background-images/mandelbrot-0021.png', alt: 'Mandelbrot 0021'},
		{url: '/images/desktop-background-images/mandelbrot-1.png', alt: 'Mandelbrot 1'},
		{url: '/images/desktop-background-images/mandelbrot-2.png', alt: 'Mandelbrot 2'},
		{url: '/images/desktop-background-images/mandelbrot-3.png', alt: 'Mandelbrot 3'},
		{url: '/images/desktop-background-images/mandelbrot-4.png', alt: 'Mandelbrot 4'},
		{url: '/images/desktop-background-images/mandelbrot-5.png', alt: 'Mandelbrot 5'},
		{url: '/images/desktop-background-images/mandelbrot-6.png', alt: 'Mandelbrot 6'},
		{url: '/images/desktop-background-images/mandelbrot-7.png', alt: 'Mandelbrot 7'},
		{url: '/images/desktop-background-images/mandelbrot-8.png', alt: 'Mandelbrot 8'},
		{url: '/images/desktop-background-images/mandelbrot-9.png', alt: 'Mandelbrot 9'},
		{url: '/images/desktop-background-images/mandelbrot-10.png', alt: 'Mandelbrot 10'},
		{url: '/images/desktop-background-images/mandelbrot-11.png', alt: 'Mandelbrot 11'},
		{url: '/images/desktop-background-images/mandelbrot-12.png', alt: 'Mandelbrot 12'},
		{url: '/images/desktop-background-images/mandelbrot-13.png', alt: 'Mandelbrot 13'},
		{url: '/images/desktop-background-images/mandelbrot-14.png', alt: 'Mandelbrot 14'},
		{url: '/images/desktop-background-images/mandelbrot-15.png', alt: 'Mandelbrot 15'},
		{url: '/images/desktop-background-images/mandelbrot-16.png', alt: 'Mandelbrot 16'},
		{url: '/images/desktop-background-images/mandelbrot-17.png', alt: 'Mandelbrot 17'},
		{url: '/images/desktop-background-images/mandelbrot-18.png', alt: 'Mandelbrot 18'},
		{url: '/images/desktop-background-images/mandelbrot-19.png', alt: 'Mandelbrot 19'},
		{url: '/images/desktop-background-images/mandelbrot-20.png', alt: 'Mandelbrot 20'},
		{url: '/images/desktop-background-images/mandelbrot-21.png', alt: 'Mandelbrot 21'},
		{url: '/images/desktop-background-images/mandelbrot-22.png', alt: 'Mandelbrot 22'},
		{url: '/images/desktop-background-images/mandelbrot-23.png', alt: 'Mandelbrot 23'},
		{url: '/images/desktop-background-images/mandelbrot-24.png', alt: 'Mandelbrot 24'},
		{url: '/images/desktop-background-images/mandelbrot-25.png', alt: 'Mandelbrot 25'},
		{url: '/images/desktop-background-images/mandelbrot-26.png', alt: 'Mandelbrot 26'},
		{url: '/images/desktop-background-images/mandelbrot-27.png', alt: 'Mandelbrot 27'},
		{url: '/images/desktop-background-images/mandelbrot-28.png', alt: 'Mandelbrot 28'},
		{url: '/images/desktop-background-images/mandelbrot-29.png', alt: 'Mandelbrot 29'},
		{url: '/images/desktop-background-images/mandelbrot-30.png', alt: 'Mandelbrot 30'},
		{url: '/images/desktop-background-images/mandelbrot-31.png', alt: 'Mandelbrot 31'},
		{url: '/images/desktop-background-images/mandelbrot-32.png', alt: 'Mandelbrot 32'},
		{url: '/images/desktop-background-images/mandelbrot-33.png', alt: 'Mandelbrot 33'},
		{url: '/images/desktop-background-images/mandelbrot-34.png', alt: 'Mandelbrot 34'},
		{url: '/images/desktop-background-images/mandelbrot-35.png', alt: 'Mandelbrot 35'},
		{url: '/images/desktop-background-images/mandelbrot-36.png', alt: 'Mandelbrot 36'},
		{url: '/images/desktop-background-images/mandelbrot-37.png', alt: 'Mandelbrot 37'},
		{url: '/images/desktop-background-images/mandelbrot-38.png', alt: 'Mandelbrot 38'},
		{url: '/images/desktop-background-images/mandelbrot-39.png', alt: 'Mandelbrot 39'},
		{url: '/images/desktop-background-images/mandelbrot-40.png', alt: 'Mandelbrot 40'},
		{url: '/images/desktop-background-images/mandelbrot-41.png', alt: 'Mandelbrot 41'},
		{url: '/images/desktop-background-images/mandelbrot-42.png', alt: 'Mandelbrot 42'},
		{url: '/images/desktop-background-images/mandelbrot-43.png', alt: 'Mandelbrot 43'},
		{url: '/images/desktop-background-images/mandelbrot-44.png', alt: 'Mandelbrot 44'},
		{url: '/images/desktop-background-images/mandelbrot-45.png', alt: 'Mandelbrot 45'},
		{url: '/images/desktop-background-images/mandelbrot-46.png', alt: 'Mandelbrot 46'},
		{url: '/images/desktop-background-images/mandelbrot-47.png', alt: 'Mandelbrot 47'},
		{url: '/images/desktop-background-images/mandelbrot-48.png', alt: 'Mandelbrot 48'},
		{url: '/images/desktop-background-images/mandelbrot-49.png', alt: 'Mandelbrot 49'},
		{url: '/images/desktop-background-images/mandelbrot-50.png', alt: 'Mandelbrot 50'},
		{url: '/images/desktop-background-images/mandelbrot-51.png', alt: 'Mandelbrot 51'},
		{url: '/images/desktop-background-images/mandelbrot-52.png', alt: 'Mandelbrot 52'},
		{url: '/images/desktop-background-images/mandelbrot-53.png', alt: 'Mandelbrot 53'},
		{url: '/images/desktop-background-images/mandelbrot-54.png', alt: 'Mandelbrot 54'},
		{url: '/images/desktop-background-images/mandelbrot-55.png', alt: 'Mandelbrot 55'},
		{url: '/images/desktop-background-images/mandelbrot-56.png', alt: 'Mandelbrot 56'},
		{url: '/images/desktop-background-images/mandelbrot-57.png', alt: 'Mandelbrot 57'},
		{url: '/images/desktop-background-images/mandelbrot-58.png', alt: 'Mandelbrot 58'},
		{url: '/images/desktop-background-images/mandelbrot-59.png', alt: 'Mandelbrot 59'},
		{url: '/images/desktop-background-images/mandelbrot-60.png', alt: 'Mandelbrot 60'},
		{url: '/images/desktop-background-images/mandelbrot-61.png', alt: 'Mandelbrot 61'},
		{url: '/images/desktop-background-images/mandelbrot-62.png', alt: 'Mandelbrot 62'},
		{url: '/images/desktop-background-images/mandelbrot-63.png', alt: 'Mandelbrot 63'},
		{url: '/images/desktop-background-images/mandelbrot-64.png', alt: 'Mandelbrot 64'},
		{url: '/images/desktop-background-images/mandelbrot-65.png', alt: 'Mandelbrot 65'},
		{url: '/images/desktop-background-images/mandelbrot-66.png', alt: 'Mandelbrot 66'},
		{url: '/images/desktop-background-images/mandelbrot-67.png', alt: 'Mandelbrot 67'},
		{url: '/images/desktop-background-images/mandelbrot-68.png', alt: 'Mandelbrot 68'},
		{url: '/images/desktop-background-images/mandelbrot-69.png', alt: 'Mandelbrot 69'},
		{url: '/images/desktop-background-images/mandelbrot-70.png', alt: 'Mandelbrot 70'},
		{url: '/images/desktop-background-images/mandelbrot-71.png', alt: 'Mandelbrot 71'},
		{url: '/images/desktop-background-images/mandelbrot-72.png', alt: 'Mandelbrot 72'},
		{url: '/images/desktop-background-images/mandelbrot-73.png', alt: 'Mandelbrot 73'},
		{url: '/images/desktop-background-images/mandelbrot-74.png', alt: 'Mandelbrot 74'},
		{url: '/images/desktop-background-images/mandelbrot-75.png', alt: 'Mandelbrot 75'},
		{url: '/images/desktop-background-images/mandelbrot-76.png', alt: 'Mandelbrot 76'},
		{url: '/images/desktop-background-images/mandelbrot-77.png', alt: 'Mandelbrot 77'},
		{url: '/images/desktop-background-images/mandelbrot-78.png', alt: 'Mandelbrot 78'},
		{url: '/images/desktop-background-images/mandelbrot-79.png', alt: 'Mandelbrot 79'},
		{url: '/images/desktop-background-images/mandelbrot-80.png', alt: 'Mandelbrot 80'},
		{url: '/images/desktop-background-images/mandelbrot-81.png', alt: 'Mandelbrot 81'},
		{url: '/images/desktop-background-images/mandelbrot-82.png', alt: 'Mandelbrot 82'},
		{url: '/images/desktop-background-images/mandelbrot-83.png', alt: 'Mandelbrot 83'},
		{url: '/images/desktop-background-images/mandelbrot-84.png', alt: 'Mandelbrot 84'},
		{url: '/images/desktop-background-images/mandelbrot-85.png', alt: 'Mandelbrot 85'},
		{url: '/images/desktop-background-images/mandelbrot-86.png', alt: 'Mandelbrot 86'},
		{url: '/images/desktop-background-images/mandelbrot-87.png', alt: 'Mandelbrot 87'},
		{url: '/images/desktop-background-images/mandelbrot-88.png', alt: 'Mandelbrot 88'},
		{url: '/images/desktop-background-images/mandelbrot-89.png', alt: 'Mandelbrot 89'},
		{url: '/images/desktop-background-images/mandelbrot-90.png', alt: 'Mandelbrot 90'},
		{url: '/images/desktop-background-images/mandelbrot-91.png', alt: 'Mandelbrot 91'},
		{url: '/images/desktop-background-images/mandelbrot-92.png', alt: 'Mandelbrot 92'},
		{url: '/images/desktop-background-images/mandelbrot-93.png', alt: 'Mandelbrot 93'},
		{url: '/images/desktop-background-images/mandelbrot-94.png', alt: 'Mandelbrot 94'},
		{url: '/images/desktop-background-images/mandelbrot-95.png', alt: 'Mandelbrot 95'},
		{url: '/images/desktop-background-images/mandelbrot-96.png', alt: 'Mandelbrot 96'},
		{url: '/images/desktop-background-images/mandelbrot-97.png', alt: 'Mandelbrot 97'},
		{url: '/images/desktop-background-images/mandelbrot-98.png', alt: 'Mandelbrot 98'},
		{url: '/images/desktop-background-images/mandelbrot-99.png', alt: 'Mandelbrot 99'},
		{url: '/images/desktop-background-images/mandelbrot-100.png', alt: 'Mandelbrot 100'},
		{url: '/images/desktop-background-images/mandelbrot-101.png', alt: 'Mandelbrot 101'},
		{url: '/images/desktop-background-images/mandelbrot-102.png', alt: 'Mandelbrot 102'},
	    {url: '/images/desktop-background-images/mandelbrot-103.png', alt: 'Mandelbrot 103'},
		{url: '/images/desktop-background-images/mandelbrot-104.png', alt: 'Mandelbrot 104'},
		{url: '/images/desktop-background-images/mandelbrot-105.png', alt: 'Mandelbrot 105'},
		{url: '/images/desktop-background-images/mandelbrot-106.png', alt: 'Mandelbrot 106'},
		{url: '/images/desktop-background-images/mandelbrot-107.png', alt: 'Mandelbrot 107'},
		{url: '/images/desktop-background-images/mandelbrot-108.png', alt: 'Mandelbrot 108'},
		{url: '/images/desktop-background-images/mandelbrot-109.png', alt: 'Mandelbrot 109'},
		{url: '/images/desktop-background-images/mandelbrot-110.png', alt: 'Mandelbrot 110'},
		{url: '/images/desktop-background-images/mandelbrot-111.png', alt: 'Mandelbrot 111'},
		{url: '/images/desktop-background-images/mandelbrot-112.png', alt: 'Mandelbrot 112'},
		{url: '/images/desktop-background-images/mandelbrot-113.png', alt: 'Mandelbrot 113'},
		{url: '/images/desktop-background-images/mandelbrot-114.png', alt: 'Mandelbrot 114'},
		{url: '/images/desktop-background-images/mandelbrot-115.png', alt: 'Mandelbrot 115'},
		{url: '/images/desktop-background-images/mandelbrot-116.png', alt: 'Mandelbrot 116'},
		{url: '/images/desktop-background-images/mandelbrot-117.png', alt: 'Mandelbrot 117'},
		{url: '/images/desktop-background-images/mandelbrot-118.png', alt: 'Mandelbrot 118'},
		{url: '/images/desktop-background-images/mandelbrot-119.png', alt: 'Mandelbrot 119'},
		{url: '/images/desktop-background-images/mandelbrot-120.png', alt: 'Mandelbrot 120'},
		{url: '/images/desktop-background-images/mandelbrot-121.png', alt: 'Mandelbrot 121'},
		{url: '/images/desktop-background-images/mandelbrot-122.png', alt: 'Mandelbrot 122'},
		{url: '/images/desktop-background-images/mandelbrot-123.png', alt: 'Mandelbrot 123'},
		{url: '/images/desktop-background-images/mandelbrot-124.png', alt: 'Mandelbrot 124'},
		{url: '/images/desktop-background-images/mandelbrot-125.png', alt: 'Mandelbrot 125'},
		{url: '/images/desktop-background-images/mandelbrot-126.png', alt: 'Mandelbrot 126'},
		{url: '/images/desktop-background-images/mandelbrot-127.png', alt: 'Mandelbrot 127'},
		{url: '/images/desktop-background-images/mandelbrot-128.png', alt: 'Mandelbrot 128'},
		{url: '/images/desktop-background-images/mandelbrot-129.png', alt: 'Mandelbrot 129'},
		{url: '/images/desktop-background-images/mandelbrot-130.png', alt: 'Mandelbrot 130'},
		{url: '/images/desktop-background-images/mandelbrot-131.png', alt: 'Mandelbrot 131'},
		{url: '/images/desktop-background-images/mandelbrot-132.png', alt: 'Mandelbrot 132'},
		{url: '/images/desktop-background-images/mandelbrot-133.png', alt: 'Mandelbrot 133'},
		{url: '/images/desktop-background-images/mandelbrot-134.png', alt: 'Mandelbrot 134'},
		{url: '/images/desktop-background-images/mandelbrot-135.png', alt: 'Mandelbrot 135'},
		{url: '/images/desktop-background-images/mandelbrot-136.png', alt: 'Mandelbrot 136'},
		{url: '/images/desktop-background-images/mandelbrot-137.png', alt: 'Mandelbrot 137'},
		{url: '/images/desktop-background-images/mandelbrot-138.png', alt: 'Mandelbrot 138'},
		{url: '/images/desktop-background-images/mandelbrot-139.png', alt: 'Mandelbrot 139'},
		{url: '/images/desktop-background-images/mandelbrot-140.png', alt: 'Mandelbrot 140'},
		{url: '/images/desktop-background-images/mandelbrot-141.png', alt: 'Mandelbrot 141'},
		{url: '/images/desktop-background-images/mandelbrot-142.png', alt: 'Mandelbrot 142'},
		{url: '/images/desktop-background-images/mandelbrot-143.png', alt: 'Mandelbrot 143'},
		{url: '/images/desktop-background-images/mandelbrot-144.png', alt: 'Mandelbrot 144'},
		{url: '/images/desktop-background-images/mandelbrot-145.png', alt: 'Mandelbrot 145'},
		{url: '/images/desktop-background-images/mandelbrot-146.png', alt: 'Mandelbrot 146'},
		{url: '/images/desktop-background-images/mandelbrot-147.png', alt: 'Mandelbrot 147'},
		{url: '/images/desktop-background-images/mandelbrot-148.png', alt: 'Mandelbrot 148'},
		{url: '/images/desktop-background-images/mandelbrot-149.png', alt: 'Mandelbrot 149'},
		{url: '/images/desktop-background-images/mandelbrot-150.png', alt: 'Mandelbrot 150'},
		{url: '/images/desktop-background-images/mandelbrot-151.png', alt: 'Mandelbrot 151'},
		{url: '/images/desktop-background-images/mandelbrot-152.png', alt: 'Mandelbrot 152'},
		{url: '/images/desktop-background-images/mandelbrot-153.png', alt: 'Mandelbrot 153'},
		{url: '/images/desktop-background-images/mandelbrot-154.png', alt: 'Mandelbrot 154'},
		{url: '/images/desktop-background-images/mandelbrot-155.png', alt: 'Mandelbrot 155'},
		{url: '/images/desktop-background-images/mandelbrot-156.png', alt: 'Mandelbrot 156'},
		{url: '/images/desktop-background-images/mandelbrot-157.png', alt: 'Mandelbrot 157'},
		{url: '/images/desktop-background-images/mandelbrot-158.png', alt: 'Mandelbrot 158'},
		{url: '/images/desktop-background-images/mandelbrot-159.png', alt: 'Mandelbrot 159'},
		{url: '/images/desktop-background-images/mandelbrot-160.png', alt: 'Mandelbrot 160'},
		{url: '/images/desktop-background-images/mandelbrot-161.png', alt: 'Mandelbrot 161'},
		{url: '/images/desktop-background-images/mandelbrot-162.png', alt: 'Mandelbrot 162'},
		{url: '/images/desktop-background-images/mandelbrot-163.png', alt: 'Mandelbrot 163'},
		{url: '/images/desktop-background-images/mandelbrot-164.png', alt: 'Mandelbrot 164'},
		{url: '/images/desktop-background-images/mandelbrot-165.png', alt: 'Mandelbrot 165'},
		{url: '/images/desktop-background-images/mandelbrot-166.png', alt: 'Mandelbrot 166'},
		{url: '/images/desktop-background-images/mandelbrot-167.png', alt: 'Mandelbrot 167'},
		{url: '/images/desktop-background-images/mandelbrot-168.png', alt: 'Mandelbrot 168'},
		{url: '/images/desktop-background-images/mandelbrot-169.png', alt: 'Mandelbrot 169'},
		{url: '/images/desktop-background-images/mandelbrot-170.png', alt: 'Mandelbrot 170'},
		{url: '/images/desktop-background-images/mandelbrot-171.png', alt: 'Mandelbrot 171'},
		{url: '/images/desktop-background-images/mandelbrot-172.png', alt: 'Mandelbrot 172'},
		{url: '/images/desktop-background-images/mandelbrot-173.png', alt: 'Mandelbrot 173'},
		{url: '/images/desktop-background-images/mandelbrot-174.png', alt: 'Mandelbrot 174'},
		{url: '/images/desktop-background-images/mandelbrot-175.png', alt: 'Mandelbrot 175'},
		{url: '/images/desktop-background-images/mandelbrot-176.png', alt: 'Mandelbrot 176'},
		{url: '/images/desktop-background-images/mandelbrot-177.png', alt: 'Mandelbrot 177'},
		{url: '/images/desktop-background-images/mandelbrot-178.png', alt: 'Mandelbrot 178'},
		{url: '/images/desktop-background-images/mandelbrot-179.png', alt: 'Mandelbrot 179'},
		{url: '/images/desktop-background-images/mandelbrot-180.png', alt: 'Mandelbrot 180'},
		{url: '/images/desktop-background-images/mandelbrot-181.png', alt: 'Mandelbrot 181'},
		{url: '/images/desktop-background-images/mandelbrot-182.png', alt: 'Mandelbrot 182'},
		{url: '/images/desktop-background-images/mandelbrot-183.png', alt: 'Mandelbrot 183'},
		{url: '/images/desktop-background-images/mandelbrot-184.png', alt: 'Mandelbrot 184'},
		{url: '/images/desktop-background-images/mandelbrot-185.png', alt: 'Mandelbrot 185'},
		{url: '/images/desktop-background-images/mandelbrot-186.png', alt: 'Mandelbrot 186'},
		{url: '/images/desktop-background-images/mandelbrot-187.png', alt: 'Mandelbrot 187'},
		{url: '/images/desktop-background-images/mandelbrot-188.png', alt: 'Mandelbrot 188'},
		{url: '/images/desktop-background-images/mandelbrot-189.png', alt: 'Mandelbrot 189'},
		{url: '/images/desktop-background-images/mandelbrot-190.png', alt: 'Mandelbrot 190'},
		{url: '/images/desktop-background-images/mandelbrot-191.png', alt: 'Mandelbrot 191'},
		{url: '/images/desktop-background-images/mandelbrot-192.png', alt: 'Mandelbrot 192'},
		{url: '/images/desktop-background-images/mandelbrot-193.png', alt: 'Mandelbrot 193'},
		{url: '/images/desktop-background-images/mandelbrot-194.png', alt: 'Mandelbrot 194'},
		{url: '/images/desktop-background-images/mandelbrot-195.png', alt: 'Mandelbrot 195'},
		{url: '/images/desktop-background-images/mandelbrot-196.png', alt: 'Mandelbrot 196'},
		{url: '/images/desktop-background-images/mandelbrot-197.png', alt: 'Mandelbrot 197'},
		{url: '/images/desktop-background-images/mandelbrot-198.png', alt: 'Mandelbrot 198'},
		{url: '/images/desktop-background-images/mandelbrot-199.png', alt: 'Mandelbrot 199'},
		{url: '/images/desktop-background-images/mandelbrot-200.png', alt: 'Mandelbrot 200'},
		{url: '/images/desktop-background-images/mandelbrot-201.png', alt: 'Mandelbrot 201'},
		{url: '/images/desktop-background-images/mandelbrot-202.png', alt: 'Mandelbrot 202'},
		{url: '/images/desktop-background-images/mandelbrot-203.png', alt: 'Mandelbrot 203'},
		{url: '/images/desktop-background-images/mandelbrot-204.png', alt: 'Mandelbrot 204'},
		{url: '/images/desktop-background-images/mandelbrot-205.png', alt: 'Mandelbrot 205'},
		{url: '/images/desktop-background-images/mandelbrot-206.png', alt: 'Mandelbrot 206'},
		{url: '/images/desktop-background-images/mandelbrot-207.png', alt: 'Mandelbrot 207'},
		{url: '/images/desktop-background-images/mandelbrot-208.png', alt: 'Mandelbrot 208'},
		{url: '/images/desktop-background-images/mandelbrot-209.png', alt: 'Mandelbrot 209'},
		{url: '/images/desktop-background-images/mandelbrot-210.png', alt: 'Mandelbrot 210'},
		{url: '/images/desktop-background-images/mandelbrot-211.png', alt: 'Mandelbrot 211'},
		{url: '/images/desktop-background-images/mandelbrot-212.png', alt: 'Mandelbrot 212'},
		{url: '/images/desktop-background-images/mandelbrot-213.png', alt: 'Mandelbrot 213'},
		{url: '/images/desktop-background-images/mandelbrot-214.png', alt: 'Mandelbrot 214'},
		{url: '/images/desktop-background-images/mandelbrot-215.png', alt: 'Mandelbrot 215'},
		{url: '/images/desktop-background-images/mandelbrot-216.png', alt: 'Mandelbrot 216'},
		{url: '/images/desktop-background-images/mandelbrot-217.png', alt: 'Mandelbrot 217'},
		{url: '/images/desktop-background-images/mandelbrot-218.png', alt: 'Mandelbrot 218'},
		{url: '/images/desktop-background-images/mandelbrot-219.png', alt: 'Mandelbrot 219'},
		{url: '/images/desktop-background-images/mandelbrot-220.png', alt: 'Mandelbrot 220'},
		{url: '/images/desktop-background-images/mandelbrot-221.png', alt: 'Mandelbrot 221'},
		{url: '/images/desktop-background-images/mandelbrot-222.png', alt: 'Mandelbrot 222'},
		{url: '/images/desktop-background-images/mandelbrot-223.png', alt: 'Mandelbrot 223'},
		{url: '/images/desktop-background-images/mandelbrot-224.png', alt: 'Mandelbrot 224'},
		{url: '/images/desktop-background-images/mandelbrot-225.png', alt: 'Mandelbrot 225'},
		{url: '/images/desktop-background-images/mandelbrot-226.png', alt: 'Mandelbrot 226'},
		{url: '/images/desktop-background-images/mandelbrot-227.png', alt: 'Mandelbrot 227'},
		{url: '/images/desktop-background-images/mandelbrot-228.png', alt: 'Mandelbrot 228'},
		{url: '/images/desktop-background-images/mandelbrot-229.png', alt: 'Mandelbrot 229'},
		{url: '/images/desktop-background-images/mandelbrot-230.png', alt: 'Mandelbrot 230'},
		{url: '/images/desktop-background-images/mandelbrot-231.png', alt: 'Mandelbrot 231'},
		{url: '/images/desktop-background-images/mandelbrot-232.png', alt: 'Mandelbrot 232'},
		{url: '/images/desktop-background-images/mandelbrot-233.png', alt: 'Mandelbrot 233'},
		{url: '/images/desktop-background-images/mandelbrot-234.png', alt: 'Mandelbrot 234'},
		{url: '/images/desktop-background-images/mandelbrot-235.png', alt: 'Mandelbrot 235'},
		{url: '/images/desktop-background-images/mandelbrot-236.png', alt: 'Mandelbrot 236'},
		{url: '/images/desktop-background-images/mandelbrot-237.png', alt: 'Mandelbrot 237'},
		{url: '/images/desktop-background-images/mandelbrot-238.png', alt: 'Mandelbrot 238'},
		{url: '/images/desktop-background-images/mandelbrot-239.png', alt: 'Mandelbrot 239'},
		{url: '/images/desktop-background-images/mandelbrot-240.png', alt: 'Mandelbrot 240'},
		{url: '/images/desktop-background-images/mandelbrot-241.png', alt: 'Mandelbrot 241'},
		{url: '/images/desktop-background-images/mandelbrot-242.png', alt: 'Mandelbrot 242'},
		{url: '/images/desktop-background-images/mandelbrot-243.png', alt: 'Mandelbrot 243'},
		{url: '/images/desktop-background-images/mandelbrot-244.png', alt: 'Mandelbrot 244'},
		{url: '/images/desktop-background-images/mandelbrot-245.png', alt: 'Mandelbrot 245'},
		{url: '/images/desktop-background-images/mandelbrot-246.png', alt: 'Mandelbrot 246'},
		{url: '/images/desktop-background-images/mandelbrot-247.png', alt: 'Mandelbrot 247'},
		{url: '/images/desktop-background-images/mandelbrot-248.png', alt: 'Mandelbrot 248'},
		{url: '/images/desktop-background-images/mandelbrot-249.png', alt: 'Mandelbrot 249'},
		{url: '/images/desktop-background-images/mandelbrot-250.png', alt: 'Mandelbrot 250'},
		{url: '/images/desktop-background-images/mandelbrot-251.png', alt: 'Mandelbrot 251'},
		{url: '/images/desktop-background-images/mandelbrot-252.png', alt: 'Mandelbrot 252'},
		{url: '/images/desktop-background-images/mandelbrot-253.png', alt: 'Mandelbrot 253'},
		{url: '/images/desktop-background-images/mandelbrot-254.png', alt: 'Mandelbrot 254'},
		{url: '/images/desktop-background-images/mandelbrot-255.png', alt: 'Mandelbrot 255'},
		{url: '/images/desktop-background-images/mandelbrot-256.png', alt: 'Mandelbrot 256'},
		{url: '/images/desktop-background-images/mandelbrot-257.png', alt: 'Mandelbrot 257'},
		{url: '/images/desktop-background-images/mandelbrot-258.png', alt: 'Mandelbrot 258'},
		{url: '/images/desktop-background-images/mandelbrot-259.png', alt: 'Mandelbrot 259'},
		{url: '/images/desktop-background-images/mandelbrot-260.png', alt: 'Mandelbrot 260'},
		{url: '/images/desktop-background-images/mandelbrot-261.png', alt: 'Mandelbrot 261'},
		{url: '/images/desktop-background-images/mandelbrot-262.png', alt: 'Mandelbrot 262'},
		{url: '/images/desktop-background-images/mandelbrot-263.png', alt: 'Mandelbrot 263'},
		{url: '/images/desktop-background-images/mandelbrot-264.png', alt: 'Mandelbrot 264'},
		{url: '/images/desktop-background-images/mandelbrot-265.png', alt: 'Mandelbrot 265'},
		{url: '/images/desktop-background-images/mandelbrot-266.png', alt: 'Mandelbrot 266'},
		{url: '/images/desktop-background-images/mandelbrot-267.png', alt: 'Mandelbrot 267'},
		{url: '/images/desktop-background-images/mandelbrot-268.png', alt: 'Mandelbrot 268'},
		{url: '/images/desktop-background-images/mandelbrot-269.png', alt: 'Mandelbrot 269'},
		{url: '/images/desktop-background-images/mandelbrot-270.png', alt: 'Mandelbrot 270'},
		{url: '/images/desktop-background-images/mandelbrot-271.png', alt: 'Mandelbrot 271'},
		{url: '/images/desktop-background-images/mandelbrot-272.png', alt: 'Mandelbrot 272'},
		{url: '/images/desktop-background-images/mandelbrot-273.png', alt: 'Mandelbrot 273'},
		{url: '/images/desktop-background-images/mandelbrot-274.png', alt: 'Mandelbrot 274'},
		{url: '/images/desktop-background-images/mandelbrot-275.png', alt: 'Mandelbrot 275'},
		{url: '/images/desktop-background-images/mandelbrot-276.png', alt: 'Mandelbrot 276'},
		{url: '/images/desktop-background-images/mandelbrot-277.png', alt: 'Mandelbrot 277'},
		{url: '/images/desktop-background-images/mandelbrot-278.png', alt: 'Mandelbrot 278'},
		{url: '/images/desktop-background-images/mandelbrot-279.png', alt: 'Mandelbrot 279'},
		{url: '/images/desktop-background-images/mandelbrot-280.png', alt: 'Mandelbrot 280'},
		{url: '/images/desktop-background-images/mandelbrot-281.png', alt: 'Mandelbrot 281'},
		{url: '/images/desktop-background-images/mandelbrot-282.png', alt: 'Mandelbrot 282'},
		{url: '/images/desktop-background-images/mandelbrot-283.png', alt: 'Mandelbrot 283'},
		{url: '/images/desktop-background-images/mandelbrot-284.png', alt: 'Mandelbrot 284'},
		{url: '/images/desktop-background-images/mandelbrot-285.png', alt: 'Mandelbrot 285'},
		{url: '/images/desktop-background-images/mandelbrot-286.png', alt: 'Mandelbrot 286'},
		{url: '/images/desktop-background-images/mandelbrot-287.png', alt: 'Mandelbrot 287'},
		{url: '/images/desktop-background-images/mandelbrot-288.png', alt: 'Mandelbrot 288'},
		{url: '/images/desktop-background-images/hsb-1.png', alt: 'HSB  1'},
		{url: '/images/desktop-background-images/hsb-2.png', alt: 'HSB  2'},
		{url: '/images/desktop-background-images/hsb-3.png', alt: 'HSB  3'},
		{url: '/images/desktop-background-images/hsb-4.png', alt: 'HSB  4'},
		{url: '/images/desktop-background-images/hsb-5.png', alt: 'HSB  5'},
		{url: '/images/desktop-background-images/hsb-6.png', alt: 'HSB  6'},
		{url: '/images/desktop-background-images/hsb-7.png', alt: 'HSB  7'},
		{url: '/images/desktop-background-images/hsb-8.png', alt: 'HSB  8'},
		{url: '/images/desktop-background-images/hsb-9.png', alt: 'HSB  9'},
		{url: '/images/desktop-background-images/hsb-10.png', alt: 'HSB 10'},
		{url: '/images/desktop-background-images/hsb-11.png', alt: 'HSB 11'},
		{url: '/images/desktop-background-images/hsb-12.png', alt: 'HSB 12'},
		{url: '/images/desktop-background-images/hsb-13.png', alt: 'HSB 13'},
		{url: '/images/desktop-background-images/hsb-14.png', alt: 'HSB 14'},
		{url: '/images/desktop-background-images/hsb-15.png', alt: 'HSB 15'},
		{url: '/images/desktop-background-images/hsb-16.png', alt: 'HSB 16'},
		{url: '/images/desktop-background-images/hsb-17.png', alt: 'HSB 17'},
		{url: '/images/desktop-background-images/hsb-18.png', alt: 'HSB 18'},
		{url: '/images/desktop-background-images/hsb-19.png', alt: 'HSB 19'},
		{url: '/images/desktop-background-images/hsb-20.png', alt: 'HSB 20'},
		{url: '/images/desktop-background-images/hsb-21.png', alt: 'HSB 21'},
		{url: '/images/desktop-background-images/hsb-22.png', alt: 'HSB 22'},
		{url: '/images/desktop-background-images/hsb-23.png', alt: 'HSB 23'},
		{url: '/images/desktop-background-images/hsb-24.png', alt: 'HSB 24'},
		{url: '/images/desktop-background-images/hsb-25.png', alt: 'HSB 25'},
		{url: '/images/desktop-background-images/hsb-26.png', alt: 'HSB 26'},
		{url: '/images/desktop-background-images/hsb-27.png', alt: 'HSB 27'},
		{url: '/images/desktop-background-images/hsb-28.png', alt: 'HSB 28'},
		{url: '/images/desktop-background-images/hsb-29.png', alt: 'HSB 29'},
		{url: '/images/desktop-background-images/hsb-30.png', alt: 'HSB 30'},
		{url: '/images/desktop-background-images/hsb-31.png', alt: 'HSB 31'},
		{url: '/images/desktop-background-images/hsb-32.png', alt: 'HSB 32'},
		{url: '/images/desktop-background-images/hsb-33.png', alt: 'HSB 33'},
		{url: '/images/desktop-background-images/hsb-34.png', alt: 'HSB 34'},
		{url: '/images/desktop-background-images/hsb-35.png', alt: 'HSB 35'},
		{url: '/images/desktop-background-images/hsb-16.png', alt: 'HSB 36'},
		{url: '/images/desktop-background-images/hsb-37.png', alt: 'HSB 37'},
		{url: '/images/desktop-background-images/hsb-38.png', alt: 'HSB 38'},
		{url: '/images/desktop-background-images/hsb-39.png', alt: 'HSB 39'},
		{url: '/images/desktop-background-images/hsb-40.png', alt: 'HSB 40'},
		{url: '/images/desktop-background-images/hsb-41.png', alt: 'HSB 41'},
		{url: '/images/desktop-background-images/hsb-42.png', alt: 'HSB 42'},
		{url: '/images/desktop-background-images/hsb-43.png', alt: 'HSB 43'},
		{url: '/images/desktop-background-images/hsb-44.png', alt: 'HSB 44'},
		{url: '/images/desktop-background-images/hsb-45.png', alt: 'HSB 45'},
		{url: '/images/desktop-background-images/hsb-46.png', alt: 'HSB 46'},
		{url: '/images/desktop-background-images/hsb-47.png', alt: 'HSB 47'},
        { url:'/images/mset/mset-0001.png', alt:'mset-0001.png'},
              { url:'/images/mset/mset-5006.png', alt:'mset-5006.png'},
              { url:'/images/mset/mset-5007.png', alt:'mset-5007.png'},
              { url:'/images/mset/mset-5011.png', alt:'mset-5011.png'},
              { url:'/images/mset/mset-5012.png', alt:'mset-5012.png'},
              { url:'/images/mset/mset-5017.png', alt:'mset-5017.png'},
              { url:'/images/mset/mset-5019.png', alt:'mset-5019.png'},
              { url:'/images/mset/mset-5020.png', alt:'mset-5020.png'},
              { url:'/images/mset/mset-5028.png', alt:'mset-5028.png'},
              { url:'/images/mset/mset-5029.png', alt:'mset-5029.png'},
              { url:'/images/mset/mset-5031.png', alt:'mset-5031.png'},
              { url:'/images/mset/mset-5032.png', alt:'mset-5032.png'},
              { url:'/images/mset/mset-5033.png', alt:'mset-5033.png'},
              { url:'/images/mset/mset-5034.png', alt:'mset-5034.png'},
              { url:'/images/mset/mset-5037.png', alt:'mset-5037.png'},
              { url:'/images/mset/mset-5038.png', alt:'mset-5038.png'},
              { url:'/images/mset/mset-5039.png', alt:'mset-5039.png'},
              { url:'/images/mset/mset-5040.png', alt:'mset-5040.png'},
              { url:'/images/mset/mset-5041.png', alt:'mset-5041.png'},
              { url:'/images/mset/mset-5043.png', alt:'mset-5043.png'},
              { url:'/images/mset/mset-5045.png', alt:'mset-5045.png'},
              { url:'/images/mset/mset-5046.png', alt:'mset-5046.png'},
              { url:'/images/mset/mset-5047.png', alt:'mset-5047.png'},
              { url:'/images/mset/mset-5048.png', alt:'mset-5048.png'},
              { url:'/images/mset/mset-5049.png', alt:'mset-5049.png'},
              { url:'/images/mset/mset-5050.png', alt:'mset-5050.png'},
              { url:'/images/mset/mset-5051.png', alt:'mset-5051.png'},
              { url:'/images/mset/mset-5052.png', alt:'mset-5052.png'},
              { url:'/images/mset/mset-5059.png', alt:'mset-5059.png'},
              { url:'/images/mset/mset-5066.png', alt:'mset-5066.png'},
              { url:'/images/mset/mset-5073.png', alt:'mset-5073.png'},
              { url:'/images/mset/mset-5078.png', alt:'mset-5078.png'},
              { url:'/images/mset/mset-5079.png', alt:'mset-5079.png'},
              { url:'/images/mset/mset-5081.png', alt:'mset-5081.png'},
              { url:'/images/mset/mset-5083.png', alt:'mset-5083.png'},
              { url:'/images/mset/mset-5084.png', alt:'mset-5084.png'},
              { url:'/images/mset/mset-5086.png', alt:'mset-5086.png'},
              { url:'/images/mset/mset-5088.png', alt:'mset-5088.png'},
              { url:'/images/mset/mset-5090.png', alt:'mset-5090.png'},
              { url:'/images/mset/mset-5095.png', alt:'mset-5095.png'},
              { url:'/images/mset/mset-5096.png', alt:'mset-5096.png'},
              { url:'/images/mset/mset-5097.png', alt:'mset-5097.png'},
              { url:'/images/mset/mset-5098.png', alt:'mset-5098.png'},
              { url:'/images/mset/mset-5099.png', alt:'mset-5099.png'},
              { url:'/images/mset/mset-5100.png', alt:'mset-5100.png'},
              { url:'/images/mset/mset-5101.png', alt:'mset-5101.png'},
              { url:'/images/mset/mset-5102.png', alt:'mset-5102.png'},
              { url:'/images/mset/mset-5104.png', alt:'mset-5104.png'},
              { url:'/images/mset/mset-5105.png', alt:'mset-5105.png'},
              { url:'/images/mset/mset-5106.png', alt:'mset-5106.png'},
              { url:'/images/mset/mset-5109.png', alt:'mset-5109.png'},
              { url:'/images/mset/mset-5110.png', alt:'mset-5110.png'},
              { url:'/images/mset/mset-5116.png', alt:'mset-5116.png'},
              { url:'/images/mset/mset-5118.png', alt:'mset-5118.png'},
              { url:'/images/mset/mset-5119.png', alt:'mset-5119.png'},
              { url:'/images/mset/mset-5123.png', alt:'mset-5123.png'},
              { url:'/images/mset/mset-5124.png', alt:'mset-5124.png'},
              { url:'/images/mset/mset-5133.png', alt:'mset-5133.png'},
              { url:'/images/mset/mset-5134.png', alt:'mset-5134.png'},
              { url:'/images/mset/mset-5135.png', alt:'mset-5135.png'},
              { url:'/images/mset/mset-5136.png', alt:'mset-5136.png'},
              { url:'/images/mset/mset-5137.png', alt:'mset-5137.png'},
              { url:'/images/mset/mset-5138.png', alt:'mset-5138.png'},
              { url:'/images/mset/mset-5139.png', alt:'mset-5139.png'},
              { url:'/images/mset/mset-5140.png', alt:'mset-5140.png'},
              { url:'/images/mset/mset-5141.png', alt:'mset-5141.png'},
              { url:'/images/mset/mset-5142.png', alt:'mset-5142.png'},
              { url:'/images/mset/mset-5160.png', alt:'mset-5160.png'},
              { url:'/images/mset/mset-5161.png', alt:'mset-5161.png'},
              { url:'/images/mset/mset-5163.png', alt:'mset-5163.png'},
              { url:'/images/mset/mset-5165.png', alt:'mset-5165.png'},
              { url:'/images/mset/mset-5168.png', alt:'mset-5168.png'},
              { url:'/images/mset/mset-5170.png', alt:'mset-5170.png'},
              { url:'/images/mset/mset-5173.png', alt:'mset-5173.png'},
              { url:'/images/mset/mset-5174.png', alt:'mset-5174.png'},
              { url:'/images/mset/mset-5176.png', alt:'mset-5176.png'},
              { url:'/images/mset/mset-5178.png', alt:'mset-5178.png'},
              { url:'/images/mset/mset-5179.png', alt:'mset-5179.png'},
              { url:'/images/mset/mset-5180.png', alt:'mset-5180.png'},
              { url:'/images/mset/mset-5182.png', alt:'mset-5182.png'},
              { url:'/images/mset/mset-5185.png', alt:'mset-5185.png'},
              { url:'/images/mset/mset-5186.png', alt:'mset-5186.png'},
              { url:'/images/mset/mset-5189.png', alt:'mset-5189.png'},
              { url:'/images/mset/mset-5192.png', alt:'mset-5192.png'},
              { url:'/images/mset/mset-5193.png', alt:'mset-5193.png'},
              { url:'/images/mset/mset-5195.png', alt:'mset-5195.png'},
              { url:'/images/mset/mset-5197.png', alt:'mset-5197.png'},
              { url:'/images/mset/mset-5198.png', alt:'mset-5198.png'},
              { url:'/images/mset/mset-5205.png', alt:'mset-5205.png'},
              { url:'/images/mset/mset-5225.png', alt:'mset-5225.png'},
              { url:'/images/mset/mset-5226.png', alt:'mset-5226.png'},
              { url:'/images/mset/mset-5230.png', alt:'mset-5230.png'},
              { url:'/images/mset/mset-5235.png', alt:'mset-5235.png'},
              { url:'/images/mset/mset-5237.png', alt:'mset-5237.png'},
              { url:'/images/mset/mset-5243.png', alt:'mset-5243.png'},
              { url:'/images/mset/mset-5245.png', alt:'mset-5245.png'},
              { url:'/images/mset/mset-5253.png', alt:'mset-5253.png'},
              { url:'/images/mset/mset-5256.png', alt:'mset-5256.png'},
              { url:'/images/mset/mset-5258.png', alt:'mset-5258.png'},
              { url:'/images/mset/mset-5263.png', alt:'mset-5263.png'},
              { url:'/images/mset/mset-5275.png', alt:'mset-5275.png'},
              { url:'/images/mset/mset-5296.png', alt:'mset-5296.png'},
              { url:'/images/mset/mset-5297.png', alt:'mset-5297.png'},
              { url:'/images/mset/mset-5298.png', alt:'mset-5298.png'},
              { url:'/images/mset/mset-5303.png', alt:'mset-5303.png'},
              { url:'/images/mset/mset-5305.png', alt:'mset-5305.png'},
              { url:'/images/mset/mset-5336.png', alt:'mset-5336.png'},
              { url:'/images/mset/mset-5343.png', alt:'mset-5343.png'},
              { url:'/images/mset/mset-5348.png', alt:'mset-5348.png'},
              { url:'/images/mset/mset-5349.png', alt:'mset-5349.png'},
              { url:'/images/mset/mset-5351.png', alt:'mset-5351.png'},
              { url:'/images/mset/mset-5353.png', alt:'mset-5353.png'},
              { url:'/images/mset/mset-5361.png', alt:'mset-5361.png'},
              { url:'/images/mset/mset-5364.png', alt:'mset-5364.png'},
              { url:'/images/mset/mset-5366.png', alt:'mset-5366.png'},
              { url:'/images/mset/mset-5371.png', alt:'mset-5371.png'},
              { url:'/images/mset/mset-5375.png', alt:'mset-5375.png'},
              { url:'/images/mset/mset-5376.png', alt:'mset-5376.png'},
              { url:'/images/mset/mset-5377.png', alt:'mset-5377.png'},
              { url:'/images/mset/mset-5382.png', alt:'mset-5382.png'},
              { url:'/images/mset/mset-5383.png', alt:'mset-5383.png'},
              { url:'/images/mset/mset-5385.png', alt:'mset-5385.png'},
              { url:'/images/mset/mset-5390.png', alt:'mset-5390.png'},
              { url:'/images/mset/mset-5392.png', alt:'mset-5392.png'},
              { url:'/images/mset/mset-5395.png', alt:'mset-5395.png'},
              { url:'/images/mset/mset-5397.png', alt:'mset-5397.png'},
              { url:'/images/mset/mset-5402.png', alt:'mset-5402.png'},
              { url:'/images/mset/mset-5403.png', alt:'mset-5403.png'},
              { url:'/images/mset/mset-5404.png', alt:'mset-5404.png'},
              { url:'/images/mset/mset-5405.png', alt:'mset-5405.png'},
              { url:'/images/mset/mset-5406.png', alt:'mset-5406.png'},
              { url:'/images/mset/mset-5407.png', alt:'mset-5407.png'},
              { url:'/images/mset/mset-5409.png', alt:'mset-5409.png'},
              { url:'/images/mset/mset-5411.png', alt:'mset-5411.png'},
              { url:'/images/mset/mset-5412.png', alt:'mset-5412.png'},
              { url:'/images/mset/mset-5413.png', alt:'mset-5413.png'},
              { url:'/images/mset/mset-5414.png', alt:'mset-5414.png'},
              { url:'/images/mset/mset-5415.png', alt:'mset-5415.png'},
              { url:'/images/mset/mset-5419.png', alt:'mset-5419.png'},
              { url:'/images/mset/mset-5420.png', alt:'mset-5420.png'},
              { url:'/images/mset/mset-5437.png', alt:'mset-5437.png'},
              { url:'/images/mset/mset-5438.png', alt:'mset-5438.png'},
              { url:'/images/mset/mset-5450.png', alt:'mset-5450.png'},
              { url:'/images/mset/mset-5452.png', alt:'mset-5452.png'},
              { url:'/images/mset/mset-5455.png', alt:'mset-5455.png'},
              { url:'/images/mset/mset-5458.png', alt:'mset-5458.png'},
              { url:'/images/mset/mset-5459.png', alt:'mset-5459.png'},
              { url:'/images/mset/mset-5460.png', alt:'mset-5460.png'},
              { url:'/images/mset/mset-5461.png', alt:'mset-5461.png'},
              { url:'/images/mset/mset-5462.png', alt:'mset-5462.png'},
              { url:'/images/mset/mset-5481.png', alt:'mset-5481.png'},
              { url:'/images/mset/mset-5486.png', alt:'mset-5486.png'},
              { url:'/images/mset/mset-5487.png', alt:'mset-5487.png'},
              { url:'/images/mset/mset-5489.png', alt:'mset-5489.png'},
              { url:'/images/mset/mset-5490.png', alt:'mset-5490.png'},
              { url:'/images/mset/mset-5497.png', alt:'mset-5497.png'},
              { url:'/images/mset/mset-5500.png', alt:'mset-5500.png'},
              { url:'/images/mset/mset-5580.png', alt:'mset-5580.png'},
              { url:'/images/mset/mset-5583.png', alt:'mset-5583.png'},
              { url:'/images/mset/mset-5584.png', alt:'mset-5584.png'},
              { url:'/images/mset/mset-5591.png', alt:'mset-5591.png'},
              { url:'/images/mset/mset-5592.png', alt:'mset-5592.png'},
              { url:'/images/mset/mset-5597.png', alt:'mset-5597.png'},
              { url:'/images/mset/mset-5600.png', alt:'mset-5600.png'},
              { url:'/images/mset/mset-5603.png', alt:'mset-5603.png'},
              { url:'/images/mset/mset-5632.png', alt:'mset-5632.png'},
              { url:'/images/mset/mset-5633.png', alt:'mset-5633.png'},
              { url:'/images/mset/mset-5641.png', alt:'mset-5641.png'},
              { url:'/images/mset/mset-5642.png', alt:'mset-5642.png'},
              { url:'/images/mset/mset-5645.png', alt:'mset-5645.png'},
              { url:'/images/mset/mset-5646.png', alt:'mset-5646.png'},
              { url:'/images/mset/mset-6123-moire.png', alt:'mset-6123-moire.png'},
              { url:'/images/mset/mset-6124-moire.png', alt:'mset-6124-moire.png'},
              { url:'/images/mset/mset-6125-moire.png', alt:'mset-6125-moire.png'},
              { url:'/images/mset/mset-6126-moire.png', alt:'mset-6126-moire.png'},
              { url:'/images/mset/mset-6127-moire.png', alt:'mset-6127-moire.png'},
              { url:'/images/mset/mset-6128-moire.png', alt:'mset-6128-moire.png'},
              { url:'/images/mset/mset-6129-moire.png', alt:'mset-6129-moire.png'},
              { url:'/images/mset/mset-6130-moire.png', alt:'mset-6130-moire.png'},
              { url:'/images/mset/mset-6131.png', alt:'mset-6123.png'},
              { url:'/images/mset/mset-6137.png', alt:'mset-6137.png'},
              { url:'/images/mset/mset-6138.png', alt:'mset-6138.png'},
              { url:'/images/mset/mset-6139.png', alt:'mset-6139.png'},
              { url:'/images/mset/mset-6140.png', alt:'mset-6140.png'},
              { url:'/images/mset/mset-6141.png', alt:'mset-6141.png'},
              { url:'/images/mset/mset-6142.png', alt:'mset-6142.png'},
              { url:'/images/mset/mset-6143.png', alt:'mset-6143.png'},
              { url:'/images/mset/mset-6144-rand-ellipse.png', alt:'mset-6144-rand-ellipse.png'},
              { url:'/images/mset/mset-6145-rand-ellipse.png', alt:'mset-6145-rand-ellipse.png'},
              { url:'/images/mset/mset-6146-rand-ellipse.png', alt:'mset-6146-rand-ellipse.png'},
              { url:'/images/mset/mset-6147-rand-ellipse.png', alt:'mset-6147-rand-ellipse.png'},
              { url:'/images/mset/mset-6148-rand-ellipse.png', alt:'mset-6148-rand-ellipse.png'},
              { url:'/images/mset/mset-6149-rand-ellipse.png', alt:'mset-6149-rand-ellipse.png'},
              { url:'/images/mset/mset-6150.png', alt:'mset-6150.png'},
              { url:'/images/mset/mset-6151.png', alt:'mset-6151.png'},
              { url:'/images/mset/mset-6152.png', alt:'mset-6152.png'},
              { url:'/images/mset/mset-6153.png', alt:'mset-6153.png'},
              { url:'/images/mset/mset-6154.png', alt:'mset-6154.png'},
              { url:'/images/mset/mset-6155.png', alt:'mset-6155.png'},
              { url:'/images/mset/mset-6156.png', alt:'mset-6156.png'},
              { url:'/images/mset/mset-6157.png', alt:'mset-6157.png'},
              { url:'/images/mset/mset-6158.png', alt:'mset-6158.png'},
              { url:'/images/mset/mset-6159.png', alt:'mset-6159.png'},
              { url:'/images/mset/mset-6160.png', alt:'mset-6160.png'},
              { url:'/images/mset/mset-6161.png', alt:'mset-6161.png'},
              { url:'/images/mset/mset-6162.png', alt:'mset-6162.png'},
              { url:'/images/mset/mset-6163.png', alt:'mset-6163.png'},
              { url:'/images/mset/mset-6164.png', alt:'mset-6164.png'},
              { url:'/images/mset/mset-6165.png', alt:'mset-6165.png'},
              { url:'/images/mset/mset-6166.png', alt:'mset-6166.png'},
              { url:'/images/mset/mset-6167.png', alt:'mset-6167.png'},
              { url:'/images/mset/mset-6168.png', alt:'mset-6168.png'},
              { url:'/images/mset/mset-6169.png', alt:'mset-6169.png'},
              { url:'/images/mset/mset-6170.png', alt:'mset-6170.png'},
              { url:'/images/mset/mset-6171.png', alt:'mset-6171.png'},
              { url:'/images/mset/mset-6172.png', alt:'mset-6172.png'},
              { url:'/images/mset/mset-6173.png', alt:'mset-6173.png'},
              { url:'/images/mset/mset-6174.png', alt:'mset-6174.png'},
              { url:'/images/mset/mset-6175.png', alt:'mset-6175.png'},
              { url:'/images/mset/mset-6176.png', alt:'mset-6176.png'},
              { url:'/images/mset/mset-6177.png', alt:'mset-6177.png'},
              { url:'/images/mset/mset-6178.png', alt:'mset-6178.png'},
              { url:'/images/mset/mset-6179.png', alt:'mset-6179.png'},
              { url:'/images/mset/mset-6180.png', alt:'mset-6180.png'},
              { url:'/images/mset/mset-6181.png', alt:'mset-6181.png'},
              { url:'/images/mset/mset-6182.png', alt:'mset-6182.png'},
              { url:'/images/mset/mset-6183.png', alt:'mset-6183.png'},
              { url:'/images/mset/mset-6184.png', alt:'mset-6184.png'},
              { url:'/images/mset/mset-6185.png', alt:'mset-6185.png'},
              { url:'/images/mset/mset-6186.png', alt:'mset-6186.png'},
              { url:'/images/mset/mset-6187.png', alt:'mset-6187.png'},
              { url:'/images/mset/mset-6188.png', alt:'mset-6188.png'},
              { url:'/images/mset/mset-6189.png', alt:'mset-6189.png'},
              { url:'/images/mset/mset-6190.png', alt:'mset-6190.png'},
              { url:'/images/mset/mset-6191.png', alt:'mset-6191.png'},
              { url:'/images/mset/mset-6192.png', alt:'mset-6192.png'},
];


Data.Filters = [

  {url: "", alt: "No Filter"},
  {url: "url(#ZZ)", alt: "ZZ"},
  {url: "url(#X)", alt: "X"},
  {url: "url(#Y)", alt: "Y"},
  {url: "url(#X)", alt: "Z"},
  {url: "url(#XX)", alt: "XX"},
  {url: "url(#XX2)", alt: "XX2 Vertical"},
  {url: "url(#XX3)", alt: "XX3 Horizontal"},
  {url: "url(#XX4)", alt: "XX4 Convolve Radial"},
  {url: "url(#XX5)", alt: "XX5 Blur"},
  {url: "url(#XX6)", alt: "XX6 Blur Posterize"},
  {url: "url(#XX7)", alt: "XX7 Blur?"},
  {url: "url(#XX8)", alt: "XX8 Blur? Animate"},
  {url: "url(#desaturate-1)", alt: "Desaturate 1"},
  {url: "url(#desaturate-2)", alt: "Desaturate 2"},
  {url: "url(#desaturate-3)", alt: "Desaturate 3 Animated"},
  {url: "url(#hueRotate-1)", alt: "Hue Rotate 45&deg;"},
  {url: "url(#hueRotate-2)", alt: "Hue Rotate 20&deg;"},
  {url: "url(#hueRotate-3)", alt: "Hue Rotate Animation"},
  {url: "url(#luminanceToAlpha-1)", alt: "Luminance To Alpha 1"},
  {url: "url(#posterize-0)", alt: "Posterize 0"},
  {url: "url(#posterize-00)", alt: "Posterize 00"},
  {url: "url(#posterize-000)", alt: "Posterize 000"},
  {url: "url(#posterize-000-1)", alt: "Posterize 000-1"},
  {url: "url(#posterize-000-2)", alt: "Posterize 000-2"},
  {url: "url(#posterize-000-3)", alt: "Posterize 000-3"},
  {url: "url(#posterize-000-4)", alt: "Posterize 000-4 (T-Mobile)"},
  {url: "url(#posterize-0000)", alt: "Posterize 0000"},
  {url: "url(#posterize-1)", alt: "Posterize 1"},
  {url: "url(#posterize-2)", alt: "Posterize 2"},
  {url: "url(#posterize-3)", alt: "Posterize 3"},
  {url: "url(#posterize-4)", alt: "Posterize 4"},
  {url: "url(#posterize-5)", alt: "Posterize 5"},
  {url: "url(#posterize-6)", alt: "Posterize 6"},
  {url: "url(#posterize-7)", alt: "Posterize 7"},
  {url: "url(#posterize-7-table)", alt: "Posterize 7 table"},
  {url: "url(#posterize-8)", alt: "Posterize 8"},
  {url: "url(#posterize-9)", alt: "Posterize 9"},
  {url: "url(#posterize-10)", alt: "Posterize 10"},
  {url: "url(#posterize-11)", alt: "Posterize 11"},
  {url: "url(#posterize-12)", alt: "Posterize 12"},
  {url: "url(#posterize-12-table)", alt: "Posterize 12 table"},
  {url: "url(#sharpen-1)", alt: "Sharpen 1"},
  {url: "url(#sharpen-2)", alt: "Sharpen 2"},
  {url: "url(#sharpen-3)", alt: "Sharpen 3"},
  {url: "url(#sharpen-3-1)", alt: "Sharpen 3-1"},
  {url: "url(#sharpen-3-2)", alt: "Sharpen 3-2"},
  {url: "url(#sharpen-3-3)", alt: "Sharpen 3-3"},
  {url: "url(#sharpen-4)", alt: "Sharpen 4"},
  {url: "url(#sharpen-5)", alt: "Sharpen 5"},
  {url: "url(#blow-1)", alt: "Blow 1 (sharpen)"},
  {url: "url(#blow-2)", alt: "Blow 2 (sharpen)"},
  {url: "url(#blow-3)", alt: "Blow 3 (sharpen)"},
  {url: "url(#blow-4)", alt: "Blow 4 (sharpen)"},
  {url: "url(#blow-5)", alt: "Blow 5 (sharpen)"},
  {url: "url(#blow-6)", alt: "Blow 6 (sharpen)"},
  {url: "url(#blow-7)", alt: "Blow 7 (sharpen)"},
  {url: "url(#sticks-filter-1)", alt: "Sticks Filter 1"},
  {url: "url(#sticks-filter-2)", alt: "Sticks Filter 2"},
  {url: "url(#super-saturate)", alt: "SuperSaturate"},
  {url: "url(#saturate-red)", alt: "Saturate Red"},
  {url: "url(#saturate-green)", alt: "Saturate Green"},
  {url: "url(#saturate-blue)", alt: "Saturate Blue"},
  {url: "url(#photo-negative)", alt: "Photo Negative"},
  {url: "url(#MorphErode-1)", alt: "Morph Erode 1 Animated"},
  {url: "url(#MorphDilate-1)", alt: "Morph Dilate 1 Animated"},
  {url: "url(#DD)", alt: "DD"},
  {url: "url(#table-1)", alt: "Table 1"},
  {url: "url(#table-2)", alt: "Gamma 1: Purple"},
  {url: "url(#table-3)", alt: "Table 3"},
  {url: "url(#table-4)", alt: "Table 4"},
  {url: "url(#table-5)", alt: "Table 5"},
  {url: "url(#table-6)", alt: "Table 6"},
  {url: "url(#table-7)", alt: "Table 7"},
  {url: "url(#table-8)", alt: "Table 8"},
  {url: "url(#table-9)", alt: "Table 9"},
  {url: "url(#table-10)", alt: "Table 10"},
  {url: "url(#table-10-2)", alt: "Table 10-2"},
  {url: "url(#table-10-3)", alt: "Table 10-3"},
  {url: "url(#table-10-4)", alt: "Table 10-4"},
  {url: "url(#table-10-5)", alt: "Table 10-5"},
  {url: "url(#table-10-6)", alt: "Table 10-6"},
  {url: "url(#table-10-7)", alt: "Table 10-7"},
  {url: "url(#table-10-7-2)", alt: "Table 10-7-2"},
  {url: "url(#table-10-8)", alt: "Table 10-8"},
  {url: "url(#table-10-9)", alt: "Table 10-9"},
  {url: "url(#table-10-10)", alt: "Table 10-10"},
  {url: "url(#table-10-11)", alt: "Table 10-11"},
  {url: "url(#table-11)", alt: "Table 11 Animated 9-10"},
  {url: "url(#table-12)", alt: "Table 12 Animated"},
  {url: "url(#table-14)", alt: "Table 14 Animated Pos to Neg"},
  {url: "url(#table-15)", alt: "Table 15 Animated"},
  {url: "url(#table-16)", alt: "Table 16 Animated"},
  {url: "url(#table-17)", alt: "Table 17 Animated"},
  {url: "url(#table-18)", alt: "Table 18 Animated"},
  {url: "url(#table-19)", alt: "Table 19 Animated"},
  {url: "url(#linear-displace-y)", alt: "Linear Displace Vert 1"},
  {url: "url(#linear-displace-y-2)", alt: "Linear Displace Ver 2"},
  {url: "url(#displaceX)", alt: "DisplaceX Radial"},
  {url: "url(#displaceX-2)", alt: "DisplaceX Linear"},
  {url: "url(#displaceX-3)", alt: "DisplaceX Linear 45&deg;"},
  {url: "url(#fish-eye-1)", alt: "Fish Eye 1"},
  {url: "url(#fish-eye-2)", alt: "Fish Eye 2"},
	{url: "url(#btw-fade-1-darken)", alt: "BTW Fade 1 Darken"},
	{url: "url(#btw-fade-2-darken)", alt: "BTW Fade 2 Darken"},
	{url: "url(#btw-fade-3-darken)", alt: "BTW Fade 3 Darken"},
	{url: "url(#btw-fade-4-darken)", alt: "BTW Fade 4 Darken"},
	{url: "url(#btw-fade-1-lighten)", alt: "BTW Fade 1 Lighten"},
	{url: "url(#btw-fade-2-lighten)", alt: "BTW Fade 2 Lighten"},
	{url: "url(#btw-fade-3-lighten)", alt: "BTW Fade 3 Lighten"},
	{url: "url(#btw-fade-4-lighten)", alt: "BTW Fade 4 Lighten"},
];



Data.writeFontFamilySelect = function( selector ) {

  var selection = $(selector);
  selection.html("");

  for (var i = 0; i < this.fontFamily.length; i++) {
    var font = this.fontFamily[i];
    selection.append("\n <option value='" + font + "'>" + font + "</option>");
  }
};

Data.changeFont = function(selectId) {

  var font = $('#' + selectId + " option::selected").val();

  if (arguments.length == 1) {
    $('body').css('font-family',"'" + font + "'");
  } else {
    var selector;
    for (var i = 1; i < arguments.length; i++) {
      selector = arguments[i];
      $(selector).css('font-family',"'" + font + "'");
    }
  }


  var call = "Data.saveSelect('" + selectId + "','Data.changeFont'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  call += ");";
  setTimeout(call, 10);

  if (this.Restored[selectId]) { // this is a regular form change, not a restoration
    Log.Notice("Updating current font to " + font);
    $('#current').val(font);
    $('#changeFontButton').click();
  } else {
		this.Restored[selectId] = true;
    Log.Notice("Just restoring select font to " + font);
  }

  return false;
};

Data.changeFontSize = function (inputId) {

  var fontSize = parseInt($('#' + inputId).val());

  if (arguments.length == 1) {
    $('body').css('font-size','' + fontSize + 'px');
  } else {
    var selector;
    for (var i = 1; i < arguments.length; i++) {
      selector = arguments[i];
      $(selector).css('font-size','' + fontSize + 'px');
    }
  }

  var call = "Data.saveInput('" + inputId + "','Data.changeFontSize'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}

Data.changeImage = function (selectId) {
  var imageSelector = '#' + selectId + " option::selected";
  var imageUrl = $(imageSelector).val();

  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).attr("href",imageUrl);
  }


  var call = "Data.saveSelect('" + selectId + "','Data.changeImage'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}


// this must change to support color editing
Data.changeStrokeWidth = function (inputId) {

  var strokeWidth = parseInt($('#' + inputId).val()) ;
  strokeWidth = strokeWidth < 1 ? 0 : strokeWidth;
  var strokeColor, fillColor;
  if (arguments.length == 1) {

    if (strokeWidth > 0) {
      strokeColor = $('body').css('fill');
      $('body')
        .css('stroke-width','' + strokeWidth + 'px')
      //  .css('stroke', '' + strokeColor )
      //  .css('fill','none');
    }
    else {
      fillColor = $('body').css('stroke');
      $('body')
        .css('stroke-width','' + strokeWidth + 'px')
      //  .css('stroke', 'none')
     //   .css('fill',fillColor);
    }
  }
	else {
    var selector;
    for (var i = 1; i < arguments.length; i++) {
      selector = arguments[i];
      if (strokeWidth > 0) {
        strokeColor = $(selector).css('color');
        $(selector)
          .css('stroke-width','' + strokeWidth + 'px')
       //   .css('stroke', '' + strokeColor )
       //   .css('fill','none');
      }
      else {
        fillColor = $(selector).css('color');
        $(selector)
          .css('stroke-width','' + strokeWidth + 'px')
       //   .css('stroke', 'none')
       //   .css('fill',fillColor);
      }
    }
  }

  var call = "Data.saveInput('" + inputId + "','Data.changeStrokeWidth'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}


// default is to switch the body fontFamily,
// otherwise treat remaining arguments as selectors
Data.changeFont2 = function (inputId) {

  var font = $('#' + inputId).val();

  if (arguments.length == 1) {
    $('body').css('font-family',"'" + font + "'");
  } else {
    var selector;
    for (var i = 1; i < arguments.length; i++) {
      selector = arguments[i];
      $(selector).css('font-family',"'" + font + "'");
    }
  }

  //saveInput(inputId, 'changeFont2', '#logo', 'body');

  var call = "Data.saveInput('" + inputId + "','Data.changeFont2'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
};

Data.changeFontMultiple = function(selectId) {

  var fontSelector = '#' + selectId + " option::selected";
  var fonts = [];
  $(fontSelector).each(function(i,e) {
    Log.Notice('font[' + fonts.length + '] =' + $(this).attr('value'));
    fonts[fonts.length] = $(this).attr('value');
  });

  $('#font-compare').html(""); // zero out font-compare

  for (var i = 0; i<fonts.length; i++) {

    $('#font-compare').append("<div class='font' style=\"font-family: '" + fonts[i] + "';\"><span>" + fonts[i] + "</span></div>");

  }

  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).css('font-family',"'" + font + "'");
  }


  var call = "Data.saveSelectMultiple('" + selectId + "','Data.changeFontMultiple'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  call += ");";
  setTimeout(call, 10);
  setTimeout("Data.restoreInput('font-size')", 10);
	setTimeout("Data.restoreInput('font-weight')",10);

  return false;
};

Data.changeFontMultipleSVG = function(selectId) {

  var fontSelector = '#' + selectId + " option::selected";
  var fonts = [];
  $(fontSelector).each(function(i,e) {
    Log.Notice('font[' + fonts.length + '] =' + $(this).attr('value'));
    fonts[fonts.length] = $(this).attr('value');
  });

  $('#font-compare').html(""); // zero out font-compare

  var UpperCase = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z ! @ # $ % ^ * ( ) _ + = : ; \" \' | ~ \n";
  var LowerCase = "a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 0 - ?";
  var isoChars = "";

  for (var i = 127; i< 256; i++) {
    isoChars = isoChars + " &#" + i + ";";
  }
  isoChars = isoChars.trim();

  //var textTest = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
  //var textXHeightTest = "x";
  //var maxHeightText = "A B C D Q J R Y W T P G I a b c d e f g h i j k l p q t v y z";
  var fontSize = parseInt($('#font-size').val());

  for (var i = 0; i<fonts.length; i++) {
    var caseArray = [UpperCase, LowerCase, isoChars];
    caseArray[caseArray.length] = fonts[i];
    var height = [];
    var width = []
    for (var j = 0; j <caseArray.length; j++ ) {

      $('#font-test').html("");
      $('#font-test').append("<svg xmlns:xlink='http://www.w3.org/1999/xlink' width='1000' height='150' id='test-svg'>\n"
        + "<text style=\"font-family: '"
        + fonts[i]
        + "'; font-size: " + fontSize + "px;\">"
        + "<tSpan x='30' dy='" + parseInt(fontSize * .8) + "' id='test-font-size'>" + caseArray[j] + "</tSpan>\n"
        + "</text>\n"
        + "</svg>"
        );
        height[j] = $('#test-font-size').outerHeight();
        width[j] = $('#test-font-size').outerWidth();
        Log.Notice('Font ' + fonts[i] + ' height = ' + height[j] );
    }

    var fontWidth = width[caseArray.length-1];
    var fontHeight = height[caseArray.length-1];
    var maxHeight = d3.max(height);
    var maxWidth = d3.max(width);
    Log.Notice('maxHeight for ' + fonts[i] + '='  + maxHeight);


    $('#font-compare').append("<svg xmlns:xlink='http://www.w3.org/1999/xlink' width='" + parseInt(maxWidth + 35) + "' height='" + parseInt(4.3 * maxHeight) + "' x='0' y='0'>"
      + "<rect class='bg' x='25' y='0' height='" + parseInt(4 * maxHeight + 9 ) + "' width='" + parseInt(maxWidth + 5) + "' />\n"
      + "<circle cx='30' cy='" + maxHeight + "' r='5' />\n"
      + "<rect x='27' y='" + parseFloat(maxHeight) + "' height='" + parseFloat(maxHeight) + "' width='" + parseInt(fontWidth + 25) + "' class='font-name' />"
      + "<text x='30' y='" + maxHeight + "'"
      + " id='text-id-" + i + "'"
      + " style=\"font-family: '"
      + fonts[i]
      + "'; font-size: "
      + maxHeight + "px;"
      +"\"><tSpan class='norm' x='30' dy='-" + parseInt(maxHeight * .2 + 2) + "'>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z ! @ # $ % ^ * ( ) _ + = : ; \" \' | ~ \n</tSpan>"
      + "<tSpan class='reverse' x='30' dy='" + parseInt(maxHeight + 0) + "'>"
      + fonts[i]
      + "</tSpan>\n"
      + "<tSpan class='outline' dx='30' dy='0'>" + fonts[i] + "</tSpan>\n"
      + "<tSpan class='norm' x='30' dy='" + parseInt(maxHeight + 4) + "'>a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 0 - ?</tspan>"
      + "</tSpan>\n<tSpan class='norm' x='30' dy='" + parseInt(maxHeight) + "'>" + isoChars + "</tspan>"
      + "</text>\n</svg>\n");

  }
  var font = fonts[0];
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).css('font-family',"'" + font + "'");
  }


  var call = "Data.saveSelectMultiple('" + selectId + "','Data.changeFontMultipleSVG'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  call += ");";
  setTimeout(call, 10);
  setTimeout("Data.restoreInput('font-size')", 10);
	setTimeout("Data.restoreInput('stroke-width')",10);

  return false;
};

Data.saveSelect = function (selectId, restoreFunction) {
  var selectedOption = "#" + selectId + " option:selected";
  var value = $(selectedOption).val();
  if (value || value == 0) {
    Log.Notice('saveSelect id=' + selectId + ' value="' + value + '"');
    var call = restoreFunction + "('" + selectId  + "'";
    for (var i = 2; i<arguments.length; i++) {
      call =  call + ",'" + arguments[i] + "'";
    }
    call += ");"
    localStorage.setItem(document.URL + '-ANIMATION-VALUE-' + selectId, value);
    localStorage.setItem(document.URL + '-ANIMATION-RESTORE-' + selectId, call);
  }
};


Data.restoreSelect = function (selectId) {

  var value = localStorage.getItem(document.URL + '-ANIMATION-VALUE-' + selectId);
  var call = localStorage.getItem(document.URL + '-ANIMATION-RESTORE-' + selectId);
  if (value || value == 0) {
    var selectedOption = "#" + selectId + " " + "option:selected";
    $(selectedOption).removeAttr('selected');
    var valueOption = "#" + selectId + " " + "option[value='" + value + "']";
    $(valueOption)
      .attr('selected', 'selected');

    setTimeout(call, 10);
    //setTimeout("Data.Restored['" + selectId + "']= true;", 10);
  }
};

// Set the select to the passed in value. If the value doesn't exist,
// all options will be cleared, none selected.

Data.setSelect = function (selectId,value,restoreFunction) {
    var selectedOptions = '#' + selectId + " option:selected";
    $(selectedOptions).each(function(i,e) {
        //Log.Notice('for ' + selectedOptions + ' removing option ' + i );
        $(this).removeAttr('selected');
    });
    var valueOption = "#" + selectId + " option[value='" + value + "']";
    $(valueOption)
        .attr('selected','selected');

    if (restoreFunction) {
    } else {
        var restoreFunction = "Log.Notice";
    }

    Data.saveSelect(selectId,restoreFunction);
    return false;
}



Data.saveSelectMultiple = function (selectId, restoreFunction) {
  var selectedOptions = "#" + selectId + " " + "option:selected";
  var value = [];
  $(selectedOptions).each(function(i,e) {
    Log.Notice('saveSelectMultiple option = ' + $(this).val());
    value[value.length] = $(this).val();
  });
  valueString = value.join(",");
  if (value.length > 0) {
    var call = restoreFunction + "('" + selectId  + "'";
    for (var i = 2; i<arguments.length; i++) {
      call =  call + ",'" + arguments[i] + "'";
    }
    call += ");"
    localStorage.setItem(document.URL + '-SELECT-MULTIVALUE-' + selectId, valueString);
    localStorage.setItem(document.URL + '-SELECT-RESTORE-' + selectId, call);
  }
};

Data.restoreSelectMultiple = function (selectId) {

  var valueString = localStorage.getItem(document.URL + '-SELECT-MULTIVALUE-' + selectId);
  var call = localStorage.getItem(document.URL + '-SELECT-RESTORE-' + selectId);
  if (valueString) {
    var selectedOption = "#" + selectId + " " + "option:selected";
    $(selectedOption).each(function(i,e) {
      $(this).removeAttr('selected');
    });
    var values = valueString.split(",");
     var valueOption;
    for (var i = 0; i < values.length; i++) {
      valueOption  = "#" + selectId + " " + "option[value='" + values[i] + "']";
      $(valueOption)
        .attr('selected', 'selected');
    }
    setTimeout(call, 10);
  }
};

Data.getCheckboxValues = function (checkboxId) {
    var value = [];
    var checkedBoxes = '#' + checkboxId + ":checked";

    $(checkedBoxes).each(function(i,e) {
        //Log.Notice('getCheckboxValues val=' + $(this).val());
        value[value.length] = $(this).val();
    });
    return value;
};
// The following form deprecates previous function
Data.getNamedCheckboxValues = function (checkboxName) {
    var value = [];
    var checkboxSelector = "input[name='" + checkboxName + "']";
    $(checkboxSelector).each(function(i,e) {
        if ($(this).attr('checked') == 'checked') {
            value[value.length] = $(this).val();
        }
    });
    return value;
};


Data.saveCheckbox = function (checkboxId, restoreFunction) {

  //

  var value = Data.getCheckboxValues(checkboxId);
  valueString = value.join(",");
  Log.Notice('saveCheckbox id=' + checkboxId + ' value="' + valueString + '"' );
  var call = restoreFunction + "('" + checkboxId  + "'";
  for (var i = 2; i<arguments.length; i++) {
      call =  call + ",'" + arguments[i] + "'";
  }
  call += ");"
  localStorage.setItem(document.URL + '-CHECKBOX-' + checkboxId, valueString);
  localStorage.setItem(document.URL + '-CHECKBOX-RESTORE-' + checkboxId, call);
};

Data.restoreCheckbox = function (checkboxId) {

  var valueString = localStorage.getItem(document.URL + '-CHECKBOX-' + checkboxId);
  var call = localStorage.getItem(document.URL + '-CHECKBOX-RESTORE-' + checkboxId);
  if (valueString) {
    var checkboxSelector = "input[name='" + checkboxId + "']";
    //var checkboxSelector = '#' + checkboxId + ":checked";
    $(checkboxSelector).each(function(i,e) {
        $(this).removeAttr('checked');
    });
    var values = valueString.split(",");
    var valueOption;
    var handle;
    for (var i = 0; i < values.length; i++) {
      //Log.Notice('valueOption = ' + values[i]);
      valueOption  = "input[name='" + checkboxId + "']";
      //valueOption = '#' + checkboxId;
      $(valueOption).each(function(i,e) {
          var val = $(this).val();
          for (var j = 0;j<values.length;j++) {
              if ( val == values[j] ) {
                  $(this).attr('checked','checked');
                  break;
              }
          }
          //Log.Notice('what values=' + values[i]);
      });
    }
    setTimeout(call, 10);
  }
};

// set the checkbox group to the passed in value, if the value
// doesn't exist, no checkboxes will be checked after the operation
// new checkbox configuration is saved

Data.setCheckbox = function (checkboxId,value,restoreFunction) {
    var checkedBoxes = '#' + checkboxId + ":checked";
    $(checkedBoxes).each(function(i,e) {
        //Log.Notice('for ' + checkedBoxes + ' removing check ' + i );
        $(this).removeAttr('checked');
    });

    var valueOption = "#" + checkboxId + "[value='" + value + "']";

    $(valueOption)
        .attr('checked','checked');

    if (restoreFunction) {
    } else {
        var restoreFunction = "Log.Notice";
    }

    Data.saveCheckbox(checkboxId,restoreFunction);
    return false;
};


Data.setCheckboxes = function (checkboxId,values,restoreFunction) {
    var value,valueSelector;
    var valueList = values.split(',');
    var checkedBoxes = '#' + checkboxId + ":checked";

    $(checkedBoxes).each(function(i,e) {
        //Log.Notice('for ' + checkedBoxes + ' removing check ' + i );
        $(this).removeAttr('checked');
    });

    for (var i = 0;i<valueList.length;i++) {
        value = valueList[i];
        valueSelector = "#" + checkboxId + "[value='" + value + "']";
        $(valueSelector)
            .attr('checked','checked');
    }

    Data.saveCheckbox(checkboxId,restoreFunction);
};


Data.saveInput = function (inputIdList, restoreFunction, arg2, arg3) {
	var inputIdArray = inputIdList.split(',');
	for (var j = 0; j < inputIdArray.length; j++ ) {
		inputId = inputIdArray[j];
		var inputSelector = "#" + inputId;
		var value = $(inputSelector).val();
		if (value || value == 0) {
		    Log.Notice('saveInput id=' + inputId + ' value="' + value + '"');
		    var call = restoreFunction + "('" + inputId  + "'";
		    for (var i = 2; i<arguments.length; i++) {
		        call =  call + ",'" + arguments[i] + "'";
		    }
		    call += ");"
		    localStorage.setItem(document.URL + '-ANIMATION-VALUE-' + inputId, value);
		    localStorage.setItem(document.URL + '-ANIMATION-RESTORE-' + inputId, call);
  	    }
	}
};

Data.restoreInput = function (inputId) {

  var value = localStorage.getItem(document.URL + '-ANIMATION-VALUE-' + inputId);
  var call = localStorage.getItem(document.URL + '-ANIMATION-RESTORE-' + inputId);
  if (value || value == 0) {
	$('#' + inputId).val(value);
     setTimeout(call, 10);
  }
};

Data.restoreHiddenInput = function (inputId) {


};

Data.loadSelectOptions = function (selectId,data) {
	var s = $('#' + selectId);
	for (var i=0; i< data.length; i++) {
		s.append("<option value='" + data[i].url + "'>" + data[i].alt + "</option>\n");
	}
}


Data.changeOpacity = function (inputId) {

  var opacity = document.getElementById(inputId).value;
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    d3.selectAll(selector).style('opacity',opacity);
  }


  //saveInput(inputId, 'Data.changeOpacity', '#points circle');

  var call = "Data.saveInput('" + inputId + "','Data.changeOpacity'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
};

Data.changeStyle = function (inputId, styleName) {

  var styleValue = document.getElementById(inputId).value;
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    d3.selectAll(selector).style(styleName,styleValue);
  }


  //saveInput(inputId, 'Data.changeOpacity', '#points circle');

  var call = "Data.saveInput('" + inputId + "','Data.changeStyle'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
};

Data.changeText = function(inputId) {

	var text = $('#' + inputId).val();
	var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).text(text);
  }
	var call = "Data.saveInput('" + inputId + "','Data.changeText'";
	for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}

Data.toggleFormInputType = function (evt) {
	var id = '#' + $(this).attr('for');
	Log.Notice("toggleFormInputType for id=" + id);
	var parent = $(this).parent();
	var input = d3.select(id);
	var type = $(id).attr('type');
	var numberStyle = "width: 75px;";
	var rangeStyle = "width: 150px;";
	if (evt.data) {
	  numberStyle = evt.data.numberStyle;
	  rangeStyle = evt.data.rangeStyle;
	}
	switch (type) {
	case 'number':
		var maximum = input.attr('max');
		var minimum = input.attr('min');

	  input
		  .attr('type','range');

		d3.select(id + '-min')
		     .html(minimum);

		d3.select(id + '-max')
		     .html(maximum);

		d3.select(id)
		 .transition()
		 .ease('linear')
		 .delay(0)
		 .duration(1000)
		 .attr('style',rangeStyle);

		break;
	case 'range':

	  input
		  .attr('type',"number");

		d3.select(id + '-min')
			.html('');

		d3.select(id + '-max')
			.html('');

		d3.select(id)
		 .transition()
		 .ease('linear')
		 .delay(0)
		 .duration(1000)
		 .attr('style', numberStyle);

		break;
	}
};
