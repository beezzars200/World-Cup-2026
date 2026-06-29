window.WC = window.WC || {};

WC.GROUPS = {
  A: { teams: [
    { code: 'MEX', name: 'Mexico',              flag: '🇲🇽' },
    { code: 'RSA', name: 'South Africa',        flag: '🇿🇦' },
    { code: 'KOR', name: 'South Korea',         flag: '🇰🇷' },
    { code: 'CZE', name: 'Czechia',             flag: '🇨🇿' },
  ]},
  B: { teams: [
    { code: 'CAN', name: 'Canada',              flag: '🇨🇦' },
    { code: 'BIH', name: 'Bosnia & Herz.',      flag: '🇧🇦' },
    { code: 'QAT', name: 'Qatar',               flag: '🇶🇦' },
    { code: 'SUI', name: 'Switzerland',         flag: '🇨🇭' },
  ]},
  C: { teams: [
    { code: 'BRA', name: 'Brazil',              flag: '🇧🇷' },
    { code: 'MAR', name: 'Morocco',             flag: '🇲🇦' },
    { code: 'HAI', name: 'Haiti',               flag: '🇭🇹' },
    { code: 'SCO', name: 'Scotland',            flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  ]},
  D: { teams: [
    { code: 'USA', name: 'USA',                 flag: '🇺🇸' },
    { code: 'PAR', name: 'Paraguay',            flag: '🇵🇾' },
    { code: 'AUS', name: 'Australia',           flag: '🇦🇺' },
    { code: 'TUR', name: 'Turkey',              flag: '🇹🇷' },
  ]},
  E: { teams: [
    { code: 'GER', name: 'Germany',             flag: '🇩🇪' },
    { code: 'CUW', name: 'Curaçao',             flag: '🇨🇼' },
    { code: 'CIV', name: 'Ivory Coast',         flag: '🇨🇮' },
    { code: 'ECU', name: 'Ecuador',             flag: '🇪🇨' },
  ]},
  F: { teams: [
    { code: 'NED', name: 'Netherlands',         flag: '🇳🇱' },
    { code: 'JPN', name: 'Japan',               flag: '🇯🇵' },
    { code: 'SWE', name: 'Sweden',              flag: '🇸🇪' },
    { code: 'TUN', name: 'Tunisia',             flag: '🇹🇳' },
  ]},
  G: { teams: [
    { code: 'BEL', name: 'Belgium',             flag: '🇧🇪' },
    { code: 'EGY', name: 'Egypt',               flag: '🇪🇬' },
    { code: 'IRN', name: 'Iran',                flag: '🇮🇷' },
    { code: 'NZL', name: 'New Zealand',         flag: '🇳🇿' },
  ]},
  H: { teams: [
    { code: 'ESP', name: 'Spain',               flag: '🇪🇸' },
    { code: 'CPV', name: 'Cape Verde',          flag: '🇨🇻' },
    { code: 'KSA', name: 'Saudi Arabia',        flag: '🇸🇦' },
    { code: 'URU', name: 'Uruguay',             flag: '🇺🇾' },
  ]},
  I: { teams: [
    { code: 'FRA', name: 'France',              flag: '🇫🇷' },
    { code: 'SEN', name: 'Senegal',             flag: '🇸🇳' },
    { code: 'IRQ', name: 'Iraq',                flag: '🇮🇶' },
    { code: 'NOR', name: 'Norway',              flag: '🇳🇴' },
  ]},
  J: { teams: [
    { code: 'ARG', name: 'Argentina',           flag: '🇦🇷' },
    { code: 'ALG', name: 'Algeria',             flag: '🇩🇿' },
    { code: 'AUT', name: 'Austria',             flag: '🇦🇹' },
    { code: 'JOR', name: 'Jordan',              flag: '🇯🇴' },
  ]},
  K: { teams: [
    { code: 'POR', name: 'Portugal',            flag: '🇵🇹' },
    { code: 'COD', name: 'DR Congo',            flag: '🇨🇩' },
    { code: 'UZB', name: 'Uzbekistan',          flag: '🇺🇿' },
    { code: 'COL', name: 'Colombia',            flag: '🇨🇴' },
  ]},
  L: { teams: [
    { code: 'ENG', name: 'England',             flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { code: 'CRO', name: 'Croatia',             flag: '🇭🇷' },
    { code: 'GHA', name: 'Ghana',               flag: '🇬🇭' },
    { code: 'PAN', name: 'Panama',              flag: '🇵🇦' },
  ]},
};

WC.GROUP_MATCHES = [
  // GROUP A
  { id: 'GA-MD1a', group: 'A', md: 1, date: '2026-06-11', utc: '19:00', venue: 'Estadio Azteca',        city: 'Mexico City',     team1: WC.GROUPS.A.teams[0], team2: WC.GROUPS.A.teams[1], score1: null, score2: null, est: false },
  { id: 'GA-MD1b', group: 'A', md: 1, date: '2026-06-12', utc: '02:00', venue: 'Estadio Akron',         city: 'Guadalajara',     team1: WC.GROUPS.A.teams[2], team2: WC.GROUPS.A.teams[3], score1: null, score2: null, est: false },
  { id: 'GA-MD2a', group: 'A', md: 2, date: '2026-06-19', utc: '01:00', venue: 'Estadio Akron',         city: 'Guadalajara',     team1: WC.GROUPS.A.teams[0], team2: WC.GROUPS.A.teams[2], score1: null, score2: null, est: false },
  { id: 'GA-MD2b', group: 'A', md: 2, date: '2026-06-18', utc: '16:00', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',         team1: WC.GROUPS.A.teams[3], team2: WC.GROUPS.A.teams[1], score1: null, score2: null, est: false },
  { id: 'GA-MD3a', group: 'A', md: 3, date: '2026-06-25', utc: '01:00', venue: 'Estadio Azteca',        city: 'Mexico City',     team1: WC.GROUPS.A.teams[0], team2: WC.GROUPS.A.teams[3], score1: null, score2: null, est: false },
  { id: 'GA-MD3b', group: 'A', md: 3, date: '2026-06-25', utc: '01:00', venue: 'Estadio Akron',         city: 'Guadalajara',     team1: WC.GROUPS.A.teams[2], team2: WC.GROUPS.A.teams[1], score1: null, score2: null, est: false },
  // GROUP B
  { id: 'GB-MD1a', group: 'B', md: 1, date: '2026-06-12', utc: '19:00', venue: 'BMO Field',             city: 'Toronto',         team1: WC.GROUPS.B.teams[0], team2: WC.GROUPS.B.teams[1], score1: null, score2: null, est: false },
  { id: 'GB-MD1b', group: 'B', md: 1, date: '2026-06-13', utc: '19:00', venue: "Levi's Stadium",        city: 'Santa Clara',     team1: WC.GROUPS.B.teams[2], team2: WC.GROUPS.B.teams[3], score1: null, score2: null, est: false },
  { id: 'GB-MD2a', group: 'B', md: 2, date: '2026-06-18', utc: '22:00', venue: 'BC Place',              city: 'Vancouver',       team1: WC.GROUPS.B.teams[0], team2: WC.GROUPS.B.teams[2], score1: null, score2: null, est: false },
  { id: 'GB-MD2b', group: 'B', md: 2, date: '2026-06-18', utc: '19:00', venue: 'SoFi Stadium',          city: 'Inglewood',       team1: WC.GROUPS.B.teams[1], team2: WC.GROUPS.B.teams[3], score1: null, score2: null, est: false },
  { id: 'GB-MD3a', group: 'B', md: 3, date: '2026-06-24', utc: '19:00', venue: 'BC Place',              city: 'Vancouver',       team1: WC.GROUPS.B.teams[0], team2: WC.GROUPS.B.teams[3], score1: null, score2: null, est: false },
  { id: 'GB-MD3b', group: 'B', md: 3, date: '2026-06-24', utc: '19:00', venue: 'Lumen Field',           city: 'Seattle',         team1: WC.GROUPS.B.teams[1], team2: WC.GROUPS.B.teams[2], score1: null, score2: null, est: false },
  // GROUP C
  { id: 'GC-MD1a', group: 'C', md: 1, date: '2026-06-13', utc: '22:00', venue: 'MetLife Stadium',       city: 'East Rutherford', team1: WC.GROUPS.C.teams[0], team2: WC.GROUPS.C.teams[1], score1: null, score2: null, est: false },
  { id: 'GC-MD1b', group: 'C', md: 1, date: '2026-06-14', utc: '01:00', venue: 'Gillette Stadium',      city: 'Foxborough',      team1: WC.GROUPS.C.teams[2], team2: WC.GROUPS.C.teams[3], score1: null, score2: null, est: false },
  { id: 'GC-MD2a', group: 'C', md: 2, date: '2026-06-20', utc: '00:30', venue: 'Lincoln Financial',     city: 'Philadelphia',    team1: WC.GROUPS.C.teams[0], team2: WC.GROUPS.C.teams[2], score1: null, score2: null, est: false },
  { id: 'GC-MD2b', group: 'C', md: 2, date: '2026-06-19', utc: '22:00', venue: 'Gillette Stadium',      city: 'Foxborough',      team1: WC.GROUPS.C.teams[1], team2: WC.GROUPS.C.teams[3], score1: null, score2: null, est: false },
  { id: 'GC-MD3a', group: 'C', md: 3, date: '2026-06-24', utc: '22:00', venue: 'Hard Rock Stadium',     city: 'Miami',           team1: WC.GROUPS.C.teams[0], team2: WC.GROUPS.C.teams[3], score1: null, score2: null, est: false },
  { id: 'GC-MD3b', group: 'C', md: 3, date: '2026-06-24', utc: '22:00', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',         team1: WC.GROUPS.C.teams[1], team2: WC.GROUPS.C.teams[2], score1: null, score2: null, est: false },
  // GROUP D
  { id: 'GD-MD1a', group: 'D', md: 1, date: '2026-06-13', utc: '01:00', venue: 'SoFi Stadium',          city: 'Inglewood',       team1: WC.GROUPS.D.teams[0], team2: WC.GROUPS.D.teams[1], score1: null, score2: null, est: false },
  { id: 'GD-MD1b', group: 'D', md: 1, date: '2026-06-14', utc: '04:00', venue: 'BC Place',              city: 'Vancouver',       team1: WC.GROUPS.D.teams[2], team2: WC.GROUPS.D.teams[3], score1: null, score2: null, est: false },
  { id: 'GD-MD2a', group: 'D', md: 2, date: '2026-06-19', utc: '19:00', venue: 'Lumen Field',           city: 'Seattle',         team1: WC.GROUPS.D.teams[0], team2: WC.GROUPS.D.teams[2], score1: null, score2: null, est: false },
  { id: 'GD-MD2b', group: 'D', md: 2, date: '2026-06-20', utc: '03:00', venue: "Levi's Stadium",        city: 'Santa Clara',     team1: WC.GROUPS.D.teams[1], team2: WC.GROUPS.D.teams[3], score1: null, score2: null, est: false },
  { id: 'GD-MD3a', group: 'D', md: 3, date: '2026-06-26', utc: '02:00', venue: 'SoFi Stadium',          city: 'Inglewood',       team1: WC.GROUPS.D.teams[0], team2: WC.GROUPS.D.teams[3], score1: null, score2: null, est: false },
  { id: 'GD-MD3b', group: 'D', md: 3, date: '2026-06-26', utc: '02:00', venue: "Levi's Stadium",        city: 'Santa Clara',     team1: WC.GROUPS.D.teams[1], team2: WC.GROUPS.D.teams[2], score1: null, score2: null, est: false },
  // GROUP E
  { id: 'GE-MD1a', group: 'E', md: 1, date: '2026-06-14', utc: '17:00', venue: 'NRG Stadium',           city: 'Houston',         team1: WC.GROUPS.E.teams[0], team2: WC.GROUPS.E.teams[1], score1: null, score2: null, est: false },
  { id: 'GE-MD1b', group: 'E', md: 1, date: '2026-06-14', utc: '23:00', venue: 'Lincoln Financial',     city: 'Philadelphia',    team1: WC.GROUPS.E.teams[2], team2: WC.GROUPS.E.teams[3], score1: null, score2: null, est: false },
  { id: 'GE-MD2a', group: 'E', md: 2, date: '2026-06-20', utc: '20:00', venue: 'BMO Field',             city: 'Toronto',         team1: WC.GROUPS.E.teams[0], team2: WC.GROUPS.E.teams[2], score1: null, score2: null, est: false },
  { id: 'GE-MD2b', group: 'E', md: 2, date: '2026-06-21', utc: '00:00', venue: 'Arrowhead Stadium',     city: 'Kansas City',     team1: WC.GROUPS.E.teams[3], team2: WC.GROUPS.E.teams[1], score1: null, score2: null, est: false },
  { id: 'GE-MD3a', group: 'E', md: 3, date: '2026-06-25', utc: '20:00', venue: 'MetLife Stadium',       city: 'East Rutherford', team1: WC.GROUPS.E.teams[0], team2: WC.GROUPS.E.teams[3], score1: null, score2: null, est: false },
  { id: 'GE-MD3b', group: 'E', md: 3, date: '2026-06-25', utc: '20:00', venue: 'Lincoln Financial',     city: 'Philadelphia',    team1: WC.GROUPS.E.teams[1], team2: WC.GROUPS.E.teams[2], score1: null, score2: null, est: false },
  // GROUP F
  { id: 'GF-MD1a', group: 'F', md: 1, date: '2026-06-14', utc: '20:00', venue: 'AT&T Stadium',          city: 'Arlington',       team1: WC.GROUPS.F.teams[0], team2: WC.GROUPS.F.teams[1], score1: null, score2: null, est: false },
  { id: 'GF-MD1b', group: 'F', md: 1, date: '2026-06-15', utc: '02:00', venue: 'Estadio BBVA',          city: 'Monterrey',       team1: WC.GROUPS.F.teams[2], team2: WC.GROUPS.F.teams[3], score1: null, score2: null, est: false },
  { id: 'GF-MD2a', group: 'F', md: 2, date: '2026-06-20', utc: '17:00', venue: 'NRG Stadium',           city: 'Houston',         team1: WC.GROUPS.F.teams[0], team2: WC.GROUPS.F.teams[2], score1: null, score2: null, est: false },
  { id: 'GF-MD2b', group: 'F', md: 2, date: '2026-06-21', utc: '04:00', venue: 'Estadio BBVA',          city: 'Monterrey',       team1: WC.GROUPS.F.teams[1], team2: WC.GROUPS.F.teams[3], score1: null, score2: null, est: false },
  { id: 'GF-MD3a', group: 'F', md: 3, date: '2026-06-25', utc: '23:00', venue: 'Arrowhead Stadium',     city: 'Kansas City',     team1: WC.GROUPS.F.teams[0], team2: WC.GROUPS.F.teams[3], score1: null, score2: null, est: false },
  { id: 'GF-MD3b', group: 'F', md: 3, date: '2026-06-25', utc: '23:00', venue: 'AT&T Stadium',          city: 'Arlington',       team1: WC.GROUPS.F.teams[1], team2: WC.GROUPS.F.teams[2], score1: null, score2: null, est: false },
  // GROUP G
  { id: 'GG-MD1a', group: 'G', md: 1, date: '2026-06-15', utc: '19:00', venue: 'Lumen Field',           city: 'Seattle',         team1: WC.GROUPS.G.teams[0], team2: WC.GROUPS.G.teams[1], score1: null, score2: null, est: false },
  { id: 'GG-MD1b', group: 'G', md: 1, date: '2026-06-16', utc: '01:00', venue: 'SoFi Stadium',          city: 'Inglewood',       team1: WC.GROUPS.G.teams[2], team2: WC.GROUPS.G.teams[3], score1: null, score2: null, est: false },
  { id: 'GG-MD2a', group: 'G', md: 2, date: '2026-06-21', utc: '19:00', venue: 'SoFi Stadium',          city: 'Inglewood',       team1: WC.GROUPS.G.teams[0], team2: WC.GROUPS.G.teams[2], score1: null, score2: null, est: false },
  { id: 'GG-MD2b', group: 'G', md: 2, date: '2026-06-22', utc: '01:00', venue: 'BC Place',              city: 'Vancouver',       team1: WC.GROUPS.G.teams[1], team2: WC.GROUPS.G.teams[3], score1: null, score2: null, est: false },
  { id: 'GG-MD3a', group: 'G', md: 3, date: '2026-06-27', utc: '03:00', venue: 'BC Place',              city: 'Vancouver',       team1: WC.GROUPS.G.teams[0], team2: WC.GROUPS.G.teams[3], score1: null, score2: null, est: false },
  { id: 'GG-MD3b', group: 'G', md: 3, date: '2026-06-27', utc: '03:00', venue: 'Lumen Field',           city: 'Seattle',         team1: WC.GROUPS.G.teams[1], team2: WC.GROUPS.G.teams[2], score1: null, score2: null, est: false },
  // GROUP H
  { id: 'GH-MD1a', group: 'H', md: 1, date: '2026-06-15', utc: '16:00', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',         team1: WC.GROUPS.H.teams[0], team2: WC.GROUPS.H.teams[1], score1: null, score2: null, est: false },
  { id: 'GH-MD1b', group: 'H', md: 1, date: '2026-06-15', utc: '22:00', venue: 'Hard Rock Stadium',     city: 'Miami',           team1: WC.GROUPS.H.teams[2], team2: WC.GROUPS.H.teams[3], score1: null, score2: null, est: false },
  { id: 'GH-MD2a', group: 'H', md: 2, date: '2026-06-21', utc: '16:00', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',         team1: WC.GROUPS.H.teams[0], team2: WC.GROUPS.H.teams[2], score1: null, score2: null, est: false },
  { id: 'GH-MD2b', group: 'H', md: 2, date: '2026-06-21', utc: '22:00', venue: 'Hard Rock Stadium',     city: 'Miami',           team1: WC.GROUPS.H.teams[1], team2: WC.GROUPS.H.teams[3], score1: null, score2: null, est: false },
  { id: 'GH-MD3a', group: 'H', md: 3, date: '2026-06-27', utc: '00:00', venue: 'Estadio Akron',         city: 'Guadalajara',     team1: WC.GROUPS.H.teams[0], team2: WC.GROUPS.H.teams[3], score1: null, score2: null, est: false },
  { id: 'GH-MD3b', group: 'H', md: 3, date: '2026-06-27', utc: '00:00', venue: 'NRG Stadium',           city: 'Houston',         team1: WC.GROUPS.H.teams[1], team2: WC.GROUPS.H.teams[2], score1: null, score2: null, est: false },
  // GROUP I
  { id: 'GI-MD1a', group: 'I', md: 1, date: '2026-06-16', utc: '19:00', venue: 'MetLife Stadium',       city: 'East Rutherford', team1: WC.GROUPS.I.teams[0], team2: WC.GROUPS.I.teams[1], score1: null, score2: null, est: false },
  { id: 'GI-MD1b', group: 'I', md: 1, date: '2026-06-16', utc: '22:00', venue: 'Gillette Stadium',      city: 'Foxborough',      team1: WC.GROUPS.I.teams[2], team2: WC.GROUPS.I.teams[3], score1: null, score2: null, est: false },
  { id: 'GI-MD2a', group: 'I', md: 2, date: '2026-06-22', utc: '21:00', venue: 'Lincoln Financial',     city: 'Philadelphia',    team1: WC.GROUPS.I.teams[0], team2: WC.GROUPS.I.teams[2], score1: null, score2: null, est: false },
  { id: 'GI-MD2b', group: 'I', md: 2, date: '2026-06-23', utc: '00:00', venue: 'BMO Field',             city: 'Toronto',         team1: WC.GROUPS.I.teams[1], team2: WC.GROUPS.I.teams[3], score1: null, score2: null, est: false },
  { id: 'GI-MD3a', group: 'I', md: 3, date: '2026-06-26', utc: '19:00', venue: 'Gillette Stadium',      city: 'Foxborough',      team1: WC.GROUPS.I.teams[0], team2: WC.GROUPS.I.teams[3], score1: null, score2: null, est: false },
  { id: 'GI-MD3b', group: 'I', md: 3, date: '2026-06-26', utc: '19:00', venue: 'BMO Field',             city: 'Toronto',         team1: WC.GROUPS.I.teams[1], team2: WC.GROUPS.I.teams[2], score1: null, score2: null, est: false },
  // GROUP J
  { id: 'GJ-MD1a', group: 'J', md: 1, date: '2026-06-17', utc: '01:00', venue: 'Arrowhead Stadium',     city: 'Kansas City',     team1: WC.GROUPS.J.teams[0], team2: WC.GROUPS.J.teams[1], score1: null, score2: null, est: false },
  { id: 'GJ-MD1b', group: 'J', md: 1, date: '2026-06-17', utc: '04:00', venue: "Levi's Stadium",        city: 'Santa Clara',     team1: WC.GROUPS.J.teams[2], team2: WC.GROUPS.J.teams[3], score1: null, score2: null, est: false },
  { id: 'GJ-MD2a', group: 'J', md: 2, date: '2026-06-22', utc: '17:00', venue: 'AT&T Stadium',          city: 'Arlington',       team1: WC.GROUPS.J.teams[0], team2: WC.GROUPS.J.teams[2], score1: null, score2: null, est: false },
  { id: 'GJ-MD2b', group: 'J', md: 2, date: '2026-06-23', utc: '03:00', venue: "Levi's Stadium",        city: 'Santa Clara',     team1: WC.GROUPS.J.teams[1], team2: WC.GROUPS.J.teams[3], score1: null, score2: null, est: false },
  { id: 'GJ-MD3a', group: 'J', md: 3, date: '2026-06-28', utc: '02:00', venue: 'AT&T Stadium',          city: 'Arlington',       team1: WC.GROUPS.J.teams[0], team2: WC.GROUPS.J.teams[3], score1: null, score2: null, est: false },
  { id: 'GJ-MD3b', group: 'J', md: 3, date: '2026-06-28', utc: '02:00', venue: 'Arrowhead Stadium',     city: 'Kansas City',     team1: WC.GROUPS.J.teams[1], team2: WC.GROUPS.J.teams[2], score1: null, score2: null, est: false },
  // GROUP K
  { id: 'GK-MD1a', group: 'K', md: 1, date: '2026-06-17', utc: '17:00', venue: 'NRG Stadium',           city: 'Houston',         team1: WC.GROUPS.K.teams[0], team2: WC.GROUPS.K.teams[1], score1: null, score2: null, est: false },
  { id: 'GK-MD1b', group: 'K', md: 1, date: '2026-06-18', utc: '02:00', venue: 'Estadio Azteca',        city: 'Mexico City',     team1: WC.GROUPS.K.teams[2], team2: WC.GROUPS.K.teams[3], score1: null, score2: null, est: false },
  { id: 'GK-MD2a', group: 'K', md: 2, date: '2026-06-23', utc: '17:00', venue: 'NRG Stadium',           city: 'Houston',         team1: WC.GROUPS.K.teams[0], team2: WC.GROUPS.K.teams[2], score1: null, score2: null, est: false },
  { id: 'GK-MD2b', group: 'K', md: 2, date: '2026-06-24', utc: '02:00', venue: 'Estadio Akron',         city: 'Guadalajara',     team1: WC.GROUPS.K.teams[1], team2: WC.GROUPS.K.teams[3], score1: null, score2: null, est: false },
  { id: 'GK-MD3a', group: 'K', md: 3, date: '2026-06-27', utc: '23:30', venue: 'Hard Rock Stadium',     city: 'Miami',           team1: WC.GROUPS.K.teams[0], team2: WC.GROUPS.K.teams[3], score1: null, score2: null, est: false },
  { id: 'GK-MD3b', group: 'K', md: 3, date: '2026-06-27', utc: '23:30', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',         team1: WC.GROUPS.K.teams[1], team2: WC.GROUPS.K.teams[2], score1: null, score2: null, est: false },
  // GROUP L
  { id: 'GL-MD1a', group: 'L', md: 1, date: '2026-06-17', utc: '20:00', venue: 'AT&T Stadium',          city: 'Arlington',       team1: WC.GROUPS.L.teams[0], team2: WC.GROUPS.L.teams[1], score1: null, score2: null, est: false },
  { id: 'GL-MD1b', group: 'L', md: 1, date: '2026-06-17', utc: '23:00', venue: 'BMO Field',             city: 'Toronto',         team1: WC.GROUPS.L.teams[2], team2: WC.GROUPS.L.teams[3], score1: null, score2: null, est: false },
  { id: 'GL-MD2a', group: 'L', md: 2, date: '2026-06-23', utc: '20:00', venue: 'Gillette Stadium',      city: 'Foxborough',      team1: WC.GROUPS.L.teams[0], team2: WC.GROUPS.L.teams[2], score1: null, score2: null, est: false },
  { id: 'GL-MD2b', group: 'L', md: 2, date: '2026-06-23', utc: '23:00', venue: 'Gillette Stadium',      city: 'Foxborough',      team1: WC.GROUPS.L.teams[1], team2: WC.GROUPS.L.teams[3], score1: null, score2: null, est: false },
  { id: 'GL-MD3a', group: 'L', md: 3, date: '2026-06-27', utc: '21:00', venue: 'MetLife Stadium',       city: 'East Rutherford', team1: WC.GROUPS.L.teams[0], team2: WC.GROUPS.L.teams[3], score1: null, score2: null, est: false },
  { id: 'GL-MD3b', group: 'L', md: 3, date: '2026-06-27', utc: '21:00', venue: 'Lincoln Financial',     city: 'Philadelphia',    team1: WC.GROUPS.L.teams[1], team2: WC.GROUPS.L.teams[2], score1: null, score2: null, est: false },
];

WC.KNOCKOUT = {
  r32: [
    { id: 'M73',  no: 73,  round: 'r32', date: '2026-06-28', utc: '19:00', venue: 'SoFi Stadium',          city: 'Inglewood',       team1Label: '2A',          team2Label: '2B',          team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M90', est: false },
    { id: 'M74',  no: 74,  round: 'r32', date: '2026-06-29', utc: '20:30', venue: 'Gillette Stadium',       city: 'Foxborough',      team1Label: '1E',          team2Label: 'best 3rd',    team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M89', est: false },
    { id: 'M75',  no: 75,  round: 'r32', date: '2026-06-30', utc: '01:00', venue: 'Estadio BBVA',           city: 'Monterrey',       team1Label: '1F',          team2Label: '2C',          team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M90', est: false },
    { id: 'M76',  no: 76,  round: 'r32', date: '2026-06-29', utc: '17:00', venue: 'NRG Stadium',            city: 'Houston',         team1Label: '1C',          team2Label: '2F',          team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M91', est: false },
    { id: 'M77',  no: 77,  round: 'r32', date: '2026-06-30', utc: '21:00', venue: 'MetLife Stadium',        city: 'East Rutherford', team1Label: '1I',          team2Label: 'best 3rd',    team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M89', est: false },
    { id: 'M78',  no: 78,  round: 'r32', date: '2026-06-30', utc: '17:00', venue: 'AT&T Stadium',           city: 'Arlington',       team1Label: '2E',          team2Label: '2I',          team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M91', est: false },
    { id: 'M79',  no: 79,  round: 'r32', date: '2026-07-01', utc: '01:00', venue: 'Estadio Azteca',         city: 'Mexico City',     team1Label: '1A',          team2Label: 'best 3rd',    team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M92', est: false },
    { id: 'M80',  no: 80,  round: 'r32', date: '2026-07-01', utc: '16:00', venue: 'Mercedes-Benz Stadium',  city: 'Atlanta',         team1Label: '1L',          team2Label: 'best 3rd',    team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M92', est: false },
    { id: 'M81',  no: 81,  round: 'r32', date: '2026-07-02', utc: '00:00', venue: "Levi's Stadium",         city: 'Santa Clara',     team1Label: '1D',          team2Label: 'best 3rd',    team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M94', est: false },
    { id: 'M82',  no: 82,  round: 'r32', date: '2026-07-01', utc: '20:00', venue: 'Lumen Field',            city: 'Seattle',         team1Label: '1G',          team2Label: 'best 3rd',    team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M94', est: false },
    { id: 'M83',  no: 83,  round: 'r32', date: '2026-07-02', utc: '23:00', venue: 'BMO Field',              city: 'Toronto',         team1Label: '2K',          team2Label: '2L',          team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M93', est: false },
    { id: 'M84',  no: 84,  round: 'r32', date: '2026-07-02', utc: '19:00', venue: 'SoFi Stadium',           city: 'Inglewood',       team1Label: '1H',          team2Label: '2J',          team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M93', est: false },
    { id: 'M85',  no: 85,  round: 'r32', date: '2026-07-03', utc: '03:00', venue: 'BC Place',               city: 'Vancouver',       team1Label: '1B',          team2Label: 'best 3rd',    team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M96', est: false },
    { id: 'M86',  no: 86,  round: 'r32', date: '2026-07-03', utc: '22:00', venue: 'Hard Rock Stadium',      city: 'Miami',           team1Label: '1J',          team2Label: '2H',          team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M95', est: false },
    { id: 'M87',  no: 87,  round: 'r32', date: '2026-07-04', utc: '01:30', venue: 'Arrowhead Stadium',      city: 'Kansas City',     team1Label: '1K',          team2Label: 'best 3rd',    team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M96', est: false },
    { id: 'M88',  no: 88,  round: 'r32', date: '2026-07-03', utc: '18:00', venue: 'AT&T Stadium',           city: 'Arlington',       team1Label: '2D',          team2Label: '2G',          team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M95', est: false },
  ],
  r16: [
    { id: 'M89',  no: 89,  round: 'r16', date: '2026-07-04', utc: '21:00', venue: 'Lincoln Financial',      city: 'Philadelphia',    team1Label: 'W-74',        team2Label: 'W-77',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M97', est: false },
    { id: 'M90',  no: 90,  round: 'r16', date: '2026-07-04', utc: '17:00', venue: 'NRG Stadium',            city: 'Houston',         team1Label: 'W-73',        team2Label: 'W-75',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M97', est: false },
    { id: 'M91',  no: 91,  round: 'r16', date: '2026-07-05', utc: '20:00', venue: 'MetLife Stadium',        city: 'East Rutherford', team1Label: 'W-76',        team2Label: 'W-78',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M99', est: true  },
    { id: 'M92',  no: 92,  round: 'r16', date: '2026-07-06', utc: '00:00', venue: 'Estadio Azteca',         city: 'Mexico City',     team1Label: 'W-79',        team2Label: 'W-80',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M99', est: true  },
    { id: 'M93',  no: 93,  round: 'r16', date: '2026-07-06', utc: '19:00', venue: 'AT&T Stadium',           city: 'Arlington',       team1Label: 'W-83',        team2Label: 'W-84',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M98', est: true  },
    { id: 'M94',  no: 94,  round: 'r16', date: '2026-07-07', utc: '00:00', venue: 'Lumen Field',            city: 'Seattle',         team1Label: 'W-81',        team2Label: 'W-82',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M98', est: true  },
    { id: 'M95',  no: 95,  round: 'r16', date: '2026-07-07', utc: '16:00', venue: 'Mercedes-Benz Stadium',  city: 'Atlanta',         team1Label: 'W-86',        team2Label: 'W-88',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M100', est: true },
    { id: 'M96',  no: 96,  round: 'r16', date: '2026-07-07', utc: '20:00', venue: 'BC Place',               city: 'Vancouver',       team1Label: 'W-85',        team2Label: 'W-87',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M100', est: true },
  ],
  qf: [
    { id: 'M97',  no: 97,  round: 'qf',  date: '2026-07-09', utc: '20:00', venue: 'Gillette Stadium',       city: 'Foxborough',      team1Label: 'W-89',        team2Label: 'W-90',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M101', est: false },
    { id: 'M98',  no: 98,  round: 'qf',  date: '2026-07-10', utc: '19:00', venue: 'SoFi Stadium',           city: 'Inglewood',       team1Label: 'W-93',        team2Label: 'W-94',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M101', est: false },
    { id: 'M99',  no: 99,  round: 'qf',  date: '2026-07-11', utc: '21:00', venue: 'Hard Rock Stadium',      city: 'Miami',           team1Label: 'W-91',        team2Label: 'W-92',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M102', est: false },
    { id: 'M100', no: 100, round: 'qf',  date: '2026-07-12', utc: '01:00', venue: 'Arrowhead Stadium',      city: 'Kansas City',     team1Label: 'W-95',        team2Label: 'W-96',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M102', est: false },
  ],
  sf: [
    { id: 'M101', no: 101, round: 'sf',  date: '2026-07-14', utc: '19:00', venue: 'AT&T Stadium',           city: 'Arlington',       team1Label: 'W-97',        team2Label: 'W-98',        team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M104', est: false },
    { id: 'M102', no: 102, round: 'sf',  date: '2026-07-15', utc: '19:00', venue: 'Mercedes-Benz Stadium',  city: 'Atlanta',         team1Label: 'W-99',        team2Label: 'W-100',       team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: 'M104', est: false },
  ],
  thirdPlace: { id: 'M103', no: 103, round: '3rd',   date: '2026-07-18', utc: '21:00', venue: 'Hard Rock Stadium',      city: 'Miami',           team1Label: 'L-101',       team2Label: 'L-102',       team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: null, est: false },
  final:      { id: 'M104', no: 104, round: 'final', date: '2026-07-19', utc: '19:00', venue: 'MetLife Stadium',        city: 'East Rutherford', team1Label: 'W-101',       team2Label: 'W-102',       team1: null, team2: null, score1: null, score2: null, winner: null, feedsMatch: null, est: false },
};

// Allocation of the eight best third-placed teams to their Round-of-32 matches.
// Key   = the eight groups (sorted) whose third-placed team qualified.
// Value = { matchId: groupLetter } — which group's third plays in each "best 3rd" slot,
//         per FIFA's published Annex C combination table.
WC.THIRD_PLACE_ALLOCATION = {
  // Group stage outcome: thirds from B, D, E, F, I, J, K, L advanced.
  'BDEFIJKL': { M74: 'D', M77: 'F', M79: 'E', M80: 'K', M81: 'B', M82: 'I', M85: 'J', M87: 'L' }
};

WC.TIMEZONES = [
  // Europe
  { region: 'Europe', name: 'Ireland',        tz: 'Europe/Dublin',                    flag: '🇮🇪', default: true },
  { region: 'Europe', name: 'United Kingdom', tz: 'Europe/London',                    flag: '🇬🇧' },
  { region: 'Europe', name: 'Scotland',       tz: 'Europe/London',                    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { region: 'Europe', name: 'Portugal',       tz: 'Europe/Lisbon',                    flag: '🇵🇹' },
  { region: 'Europe', name: 'Iceland',        tz: 'Atlantic/Reykjavik',               flag: '🇮🇸' },
  { region: 'Europe', name: 'France',         tz: 'Europe/Paris',                     flag: '🇫🇷' },
  { region: 'Europe', name: 'Germany',        tz: 'Europe/Berlin',                    flag: '🇩🇪' },
  { region: 'Europe', name: 'Spain',          tz: 'Europe/Madrid',                    flag: '🇪🇸' },
  { region: 'Europe', name: 'Netherlands',    tz: 'Europe/Amsterdam',                 flag: '🇳🇱' },
  { region: 'Europe', name: 'Belgium',        tz: 'Europe/Brussels',                  flag: '🇧🇪' },
  { region: 'Europe', name: 'Luxembourg',     tz: 'Europe/Luxembourg',                flag: '🇱🇺' },
  { region: 'Europe', name: 'Switzerland',    tz: 'Europe/Zurich',                    flag: '🇨🇭' },
  { region: 'Europe', name: 'Italy',          tz: 'Europe/Rome',                      flag: '🇮🇹' },
  { region: 'Europe', name: 'Austria',        tz: 'Europe/Vienna',                    flag: '🇦🇹' },
  { region: 'Europe', name: 'Denmark',        tz: 'Europe/Copenhagen',                flag: '🇩🇰' },
  { region: 'Europe', name: 'Sweden',         tz: 'Europe/Stockholm',                 flag: '🇸🇪' },
  { region: 'Europe', name: 'Norway',         tz: 'Europe/Oslo',                      flag: '🇳🇴' },
  { region: 'Europe', name: 'Finland',        tz: 'Europe/Helsinki',                  flag: '🇫🇮' },
  { region: 'Europe', name: 'Poland',         tz: 'Europe/Warsaw',                    flag: '🇵🇱' },
  { region: 'Europe', name: 'Czech Republic', tz: 'Europe/Prague',                    flag: '🇨🇿' },
  { region: 'Europe', name: 'Slovakia',       tz: 'Europe/Bratislava',                flag: '🇸🇰' },
  { region: 'Europe', name: 'Hungary',        tz: 'Europe/Budapest',                  flag: '🇭🇺' },
  { region: 'Europe', name: 'Slovenia',       tz: 'Europe/Ljubljana',                 flag: '🇸🇮' },
  { region: 'Europe', name: 'Croatia',        tz: 'Europe/Zagreb',                    flag: '🇭🇷' },
  { region: 'Europe', name: 'Serbia',         tz: 'Europe/Belgrade',                  flag: '🇷🇸' },
  { region: 'Europe', name: 'Romania',        tz: 'Europe/Bucharest',                 flag: '🇷🇴' },
  { region: 'Europe', name: 'Bulgaria',       tz: 'Europe/Sofia',                     flag: '🇧🇬' },
  { region: 'Europe', name: 'Greece',         tz: 'Europe/Athens',                    flag: '🇬🇷' },
  { region: 'Europe', name: 'Albania',        tz: 'Europe/Tirane',                    flag: '🇦🇱' },
  { region: 'Europe', name: 'North Macedonia',tz: 'Europe/Skopje',                    flag: '🇲🇰' },
  { region: 'Europe', name: 'Turkey',         tz: 'Europe/Istanbul',                  flag: '🇹🇷' },
  { region: 'Europe', name: 'Estonia',        tz: 'Europe/Tallinn',                   flag: '🇪🇪' },
  { region: 'Europe', name: 'Latvia',         tz: 'Europe/Riga',                      flag: '🇱🇻' },
  { region: 'Europe', name: 'Lithuania',      tz: 'Europe/Vilnius',                   flag: '🇱🇹' },
  { region: 'Europe', name: 'Ukraine',        tz: 'Europe/Kiev',                      flag: '🇺🇦' },
  { region: 'Europe', name: 'Russia',         tz: 'Europe/Moscow',                    flag: '🇷🇺' },

  // North America
  { region: 'North America', name: 'USA (East)',    tz: 'America/New_York',    flag: '🇺🇸' },
  { region: 'North America', name: 'USA (Central)', tz: 'America/Chicago',     flag: '🇺🇸' },
  { region: 'North America', name: 'USA (Mountain)',tz: 'America/Denver',      flag: '🇺🇸' },
  { region: 'North America', name: 'USA (West)',    tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { region: 'North America', name: 'Canada (East)', tz: 'America/Toronto',     flag: '🇨🇦' },
  { region: 'North America', name: 'Canada (West)', tz: 'America/Vancouver',   flag: '🇨🇦' },
  { region: 'North America', name: 'Mexico',        tz: 'America/Mexico_City', flag: '🇲🇽' },
  { region: 'North America', name: 'Costa Rica',    tz: 'America/Costa_Rica',  flag: '🇨🇷' },
  { region: 'North America', name: 'Jamaica',       tz: 'America/Jamaica',     flag: '🇯🇲' },
  { region: 'North America', name: 'Trinidad & Tobago', tz: 'America/Port_of_Spain', flag: '🇹🇹' },

  // South America
  { region: 'South America', name: 'Brazil',    tz: 'America/Sao_Paulo',              flag: '🇧🇷' },
  { region: 'South America', name: 'Argentina', tz: 'America/Argentina/Buenos_Aires', flag: '🇦🇷' },
  { region: 'South America', name: 'Colombia',  tz: 'America/Bogota',                 flag: '🇨🇴' },
  { region: 'South America', name: 'Chile',     tz: 'America/Santiago',               flag: '🇨🇱' },
  { region: 'South America', name: 'Peru',      tz: 'America/Lima',                   flag: '🇵🇪' },
  { region: 'South America', name: 'Ecuador',   tz: 'America/Guayaquil',              flag: '🇪🇨' },
  { region: 'South America', name: 'Venezuela', tz: 'America/Caracas',                flag: '🇻🇪' },
  { region: 'South America', name: 'Uruguay',   tz: 'America/Montevideo',             flag: '🇺🇾' },
  { region: 'South America', name: 'Bolivia',   tz: 'America/La_Paz',                 flag: '🇧🇴' },
  { region: 'South America', name: 'Paraguay',  tz: 'America/Asuncion',               flag: '🇵🇾' },

  // Africa
  { region: 'Africa', name: 'Morocco',       tz: 'Africa/Casablanca',    flag: '🇲🇦' },
  { region: 'Africa', name: 'Algeria',       tz: 'Africa/Algiers',       flag: '🇩🇿' },
  { region: 'Africa', name: 'Tunisia',       tz: 'Africa/Tunis',         flag: '🇹🇳' },
  { region: 'Africa', name: 'Egypt',         tz: 'Africa/Cairo',         flag: '🇪🇬' },
  { region: 'Africa', name: 'Senegal',       tz: 'Africa/Dakar',         flag: '🇸🇳' },
  { region: 'Africa', name: 'Ghana',         tz: 'Africa/Accra',         flag: '🇬🇭' },
  { region: 'Africa', name: 'Nigeria',       tz: 'Africa/Lagos',         flag: '🇳🇬' },
  { region: 'Africa', name: 'Cameroon',      tz: 'Africa/Douala',        flag: '🇨🇲' },
  { region: 'Africa', name: "Côte d'Ivoire", tz: 'Africa/Abidjan',       flag: '🇨🇮' },
  { region: 'Africa', name: 'Kenya',         tz: 'Africa/Nairobi',       flag: '🇰🇪' },
  { region: 'Africa', name: 'Tanzania',      tz: 'Africa/Dar_es_Salaam', flag: '🇹🇿' },
  { region: 'Africa', name: 'Ethiopia',      tz: 'Africa/Addis_Ababa',   flag: '🇪🇹' },
  { region: 'Africa', name: 'South Africa',  tz: 'Africa/Johannesburg',  flag: '🇿🇦' },

  // Middle East
  { region: 'Middle East', name: 'Saudi Arabia', tz: 'Asia/Riyadh',    flag: '🇸🇦' },
  { region: 'Middle East', name: 'UAE',           tz: 'Asia/Dubai',     flag: '🇦🇪' },
  { region: 'Middle East', name: 'Qatar',         tz: 'Asia/Qatar',     flag: '🇶🇦' },
  { region: 'Middle East', name: 'Kuwait',        tz: 'Asia/Kuwait',    flag: '🇰🇼' },
  { region: 'Middle East', name: 'Bahrain',       tz: 'Asia/Bahrain',   flag: '🇧🇭' },
  { region: 'Middle East', name: 'Oman',          tz: 'Asia/Muscat',    flag: '🇴🇲' },
  { region: 'Middle East', name: 'Jordan',        tz: 'Asia/Amman',     flag: '🇯🇴' },
  { region: 'Middle East', name: 'Lebanon',       tz: 'Asia/Beirut',    flag: '🇱🇧' },
  { region: 'Middle East', name: 'Israel',        tz: 'Asia/Jerusalem',  flag: '🇮🇱' },
  { region: 'Middle East', name: 'Iraq',          tz: 'Asia/Baghdad',   flag: '🇮🇶' },
  { region: 'Middle East', name: 'Iran',          tz: 'Asia/Tehran',    flag: '🇮🇷' },

  // Asia
  { region: 'Asia', name: 'Pakistan',    tz: 'Asia/Karachi',       flag: '🇵🇰' },
  { region: 'Asia', name: 'India',       tz: 'Asia/Kolkata',       flag: '🇮🇳' },
  { region: 'Asia', name: 'Sri Lanka',   tz: 'Asia/Colombo',       flag: '🇱🇰' },
  { region: 'Asia', name: 'Nepal',       tz: 'Asia/Kathmandu',     flag: '🇳🇵' },
  { region: 'Asia', name: 'Bangladesh',  tz: 'Asia/Dhaka',         flag: '🇧🇩' },
  { region: 'Asia', name: 'Thailand',    tz: 'Asia/Bangkok',       flag: '🇹🇭' },
  { region: 'Asia', name: 'Vietnam',     tz: 'Asia/Ho_Chi_Minh',   flag: '🇻🇳' },
  { region: 'Asia', name: 'Malaysia',    tz: 'Asia/Kuala_Lumpur',  flag: '🇲🇾' },
  { region: 'Asia', name: 'Singapore',   tz: 'Asia/Singapore',     flag: '🇸🇬' },
  { region: 'Asia', name: 'Indonesia',   tz: 'Asia/Jakarta',       flag: '🇮🇩' },
  { region: 'Asia', name: 'Philippines', tz: 'Asia/Manila',        flag: '🇵🇭' },
  { region: 'Asia', name: 'China',       tz: 'Asia/Shanghai',      flag: '🇨🇳' },
  { region: 'Asia', name: 'South Korea', tz: 'Asia/Seoul',         flag: '🇰🇷' },
  { region: 'Asia', name: 'Japan',       tz: 'Asia/Tokyo',         flag: '🇯🇵' },

  // Oceania
  { region: 'Oceania', name: 'Australia (East)', tz: 'Australia/Sydney', flag: '🇦🇺' },
  { region: 'Oceania', name: 'Australia (West)', tz: 'Australia/Perth',  flag: '🇦🇺' },
  { region: 'Oceania', name: 'New Zealand',      tz: 'Pacific/Auckland', flag: '🇳🇿' },
];

// Opening ceremonies — one in each host nation, each 90 min before
// that host's first match. Times in UTC.
WC.CEREMONIES = [
  {
    city: 'Mexico City', flag: '🇲🇽', venue: 'Estadio Azteca',
    utc: '2026-06-11T17:30:00Z',
    note: "Ahead of Mexico's opening match",
    lineup: ''
  },
  {
    city: 'Toronto', flag: '🇨🇦', venue: 'Toronto Stadium',
    utc: '2026-06-12T17:30:00Z',
    note: "Ahead of Canada's opening match",
    lineup: 'Michael Bublé headlines · Jessie Reyez · Elyanna · Alanis Morissette · Alessia Cara · Nora Fatehi & more'
  },
  {
    city: 'Los Angeles', flag: '🇺🇸', venue: 'SoFi Stadium',
    utc: '2026-06-12T23:30:00Z',
    note: "Ahead of USA's opening match",
    lineup: 'Katy Perry · Blackpink · Future · Tyla · Anitta · Rema'
  },
];
