// World Cup Buster 2026 — official draw results (48 entries)
// team: internal team code from tournament.js
// scorer/scorerCountry: top goalscorer pick, normalised spelling for API matching
(function () {
  'use strict';
  window.WC = window.WC || {};

  WC.DRAW = [
    { no: 1,  name: 'Kim Moore',                   team: 'NOR', scorer: 'Eberechi Eze',         scorerCountry: 'England' },
    { no: 2,  name: 'Scott Moore',                 team: 'BRA', scorer: 'Cristiano Ronaldo',    scorerCountry: 'Portugal' },
    { no: 3,  name: 'Kian Kelleher',               team: 'COL', scorer: 'Lionel Messi',         scorerCountry: 'Argentina' },
    { no: 4,  name: 'Bee O Sullivan',              team: 'ARG', scorer: 'Erling Haaland',       scorerCountry: 'Norway' },
    { no: 5,  name: 'Eugene Hennessy',             team: 'NZL', scorer: 'Désiré Doué',          scorerCountry: 'France' },
    { no: 6,  name: 'Nathan Hennessy',             team: 'SUI', scorer: 'Florian Wirtz',        scorerCountry: 'Germany' },
    { no: 7,  name: 'Adrian Duggan',               team: 'GER', scorer: 'Jérémy Doku',          scorerCountry: 'Belgium' },
    { no: 8,  name: 'Caroline Hennessy',           team: 'ECU', scorer: 'Lamine Yamal',         scorerCountry: 'Spain' },
    { no: 9,  name: 'Mick O Sullivan',             team: 'BEL', scorer: 'Brian Brobbey',        scorerCountry: 'Netherlands' },
    { no: 10, name: 'Marie O Sullivan',     team: 'CAN', scorer: 'Kylian Mbappé',        scorerCountry: 'France' },
    { no: 11, name: 'Richy O Hare',                team: 'QAT', scorer: 'Darwin Núñez',         scorerCountry: 'Uruguay' },
    { no: 12, name: 'Jimmy O Brien',               team: 'CUW', scorer: 'Jonathan David',       scorerCountry: 'Canada' },
    { no: 13, name: 'Johnny Scribbles',      team: 'SWE', scorer: 'Bruno Fernandes',      scorerCountry: 'Portugal' },
    { no: 14, name: 'Bianca de Nicola',      team: 'ENG', scorer: 'Mikel Oyarzabal',      scorerCountry: 'Spain' },
    { no: 15, name: 'Tony O Brien',                team: 'USA', scorer: 'Marcus Thuram',        scorerCountry: 'France' },
    { no: 16, name: 'Pa O Connor',                 team: 'ALG', scorer: 'Michael Olise',        scorerCountry: 'France' },
    { no: 17, name: 'Stevie Waters',               team: 'SEN', scorer: 'Matheus Cunha',        scorerCountry: 'Brazil' },
    { no: 18, name: 'Eoin O Donovan',      team: 'KSA', scorer: 'Harry Kane',           scorerCountry: 'England' },
    { no: 19, name: 'David Forde',                 team: 'NED', scorer: 'Ferran Torres',        scorerCountry: 'Spain' },
    { no: 20, name: 'Don Kelleher',                team: 'SCO', scorer: 'Donyell Malen',        scorerCountry: 'Netherlands' },
    { no: 21, name: 'Ciaran Crowley',              team: 'CIV', scorer: 'Romelu Lukaku',        scorerCountry: 'Belgium' },
    { no: 22, name: 'Stephen Harris',              team: 'JPN', scorer: 'Nicolas Jackson',      scorerCountry: 'Senegal' },
    { no: 23, name: 'Paul Gardner',                team: 'IRN', scorer: 'Luis Javier Suárez',   scorerCountry: 'Colombia' },
    { no: 24, name: 'Gavin Duggan',                team: 'ESP', scorer: 'Memphis Depay',        scorerCountry: 'Netherlands' },
    { no: 25, name: 'Sandra Coughlan',             team: 'TUR', scorer: 'Alexander Isak',       scorerCountry: 'Sweden' },
    { no: 26, name: 'Frank Geaney',                team: 'CPV', scorer: 'Bukayo Saka',          scorerCountry: 'England' },
    { no: 27, name: 'Tadhg Lawton',                team: 'CRO', scorer: 'Marcus Rashford',      scorerCountry: 'England' },
    { no: 28, name: 'Louise Lawton',               team: 'MAR', scorer: 'Ollie Watkins',        scorerCountry: 'England' },
    { no: 29, name: 'James Byrnes',                team: 'JOR', scorer: 'Alexander Sørloth',    scorerCountry: 'Norway' },
    { no: 30, name: 'Keith Shaw',                  team: 'EGY', scorer: 'Lautaro Martínez',     scorerCountry: 'Argentina' },
    { no: 31, name: 'Jason Kelly',                 team: 'KOR', scorer: 'Jude Bellingham',      scorerCountry: 'England' },
    { no: 32, name: 'Gary Coughlan',               team: 'CZE', scorer: 'Nick Woltemade',       scorerCountry: 'Germany' },
    { no: 33, name: 'Maura O Connor',         team: 'GHA', scorer: 'Sadio Mané',           scorerCountry: 'Senegal' },
    { no: 34, name: 'Iris O Brien',                team: 'PAR', scorer: 'Vinícius Júnior',      scorerCountry: 'Brazil' },
    { no: 35, name: 'Declan O Sullivan',  team: 'AUT', scorer: 'Enner Valencia',       scorerCountry: 'Ecuador' },
    { no: 36, name: 'Carol Geaney',        team: 'FRA', scorer: 'Anthony Gordon',       scorerCountry: 'England' },
    { no: 37, name: 'Darren Geaney',       team: 'BIH', scorer: 'Igor Thiago',          scorerCountry: 'Brazil' },
    { no: 38, name: 'Razor',               team: 'AUS', scorer: 'Mo Salah',             scorerCountry: 'Egypt' },
    { no: 39, name: 'Nicole Geaney',       team: 'POR', scorer: 'Morgan Rogers',        scorerCountry: 'England' },
    { no: 40, name: 'Courtney O Keefe',    team: 'MEX', scorer: 'Rafael Leão',          scorerCountry: 'Portugal' },
    { no: 41, name: 'Graham Waters',               team: 'UZB', scorer: 'Julián Álvarez',       scorerCountry: 'Argentina' },
    { no: 42, name: 'Paudie Crowley',              team: 'HAI', scorer: 'Raphinha',             scorerCountry: 'Brazil' },
    { no: 43, name: 'Paul Barrett',        team: 'TUN', scorer: 'Charles De Ketelaere', scorerCountry: 'Belgium' },
    { no: 44, name: 'Dean Smith',          team: 'PAN', scorer: 'Ousmane Dembélé',      scorerCountry: 'France' },
    { no: 45, name: 'Johnny Kennelly',        team: 'RSA', scorer: 'Luis Díaz',            scorerCountry: 'Colombia' },
    { no: 46, name: 'Tony Hyde',                   team: 'COD', scorer: 'Kai Havertz',          scorerCountry: 'Germany' },
    { no: 47, name: 'Dean Murray',                 team: 'URU', scorer: 'Jamal Musiala',        scorerCountry: 'Germany' },
    { no: 48, name: 'David Byrne',                 team: 'IRQ', scorer: 'Cody Gakpo',           scorerCountry: 'Netherlands' }
  ];

  // Stand-by top scorer picks, in case of injury before the first game
  WC.RESERVE_SCORERS = [
    { name: 'Endrick',           country: 'Brazil' },
    { name: 'Antoine Semenyo',   country: 'Ghana' },
    { name: 'Christian Pulisic', country: 'USA' },
    { name: 'Bradley Barcola',   country: 'France' },
    { name: 'Nico Williams',     country: 'Spain' },
    { name: 'Viktor Gyökeres',   country: 'Sweden' },
    { name: 'Gonçalo Ramos',     country: 'Portugal' },
    { name: 'John Yeboah',       country: 'Ecuador' },
    { name: 'Raúl Jiménez',      country: 'Mexico' },
    { name: 'Daizen Maeda',      country: 'Japan' }
  ];
})();
