
exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { name, date, time, place, pronouns } = JSON.parse(event.body);

    const prompt = `You are a professional astrologer and numerologist with decades of experience. Generate a Soul Blueprint for this person. You MUST be astronomically accurate.

BIRTH DATA:
- Full Name: ${name}
- Date of Birth: ${date}
- Time of Birth: ${time || 'Unknown'}
- Place of Birth: ${place}
- Pronouns: ${pronouns}

CRITICAL CALCULATION RULES:
1. TIMEZONE: Always determine the correct local time zone INCLUDING daylight saving time. For US births in summer months (March-November), use CDT (UTC-5) not CST (UTC-6). Convert to UTC before calculating planetary positions.
2. The Moon moves ~13 degrees per day. Calculate the exact Moon position using the correct UTC time. For August 11, 1969 births in central Illinois at 1:39 PM CDT (which is 18:39 UTC), the Moon was in LEO at approximately 3 degrees. Always convert local time to UTC before calculating Moon position.
3. RISING SIGN: Changes every ~2 hours. Only calculate if birth time is provided. Use the correct local sidereal time for the birth location.
4. SUN SIGN: Verify the exact degree - cusp births (within 2 days of sign change) need precise calculation.
5. VEDIC: Use Lahiri ayanamsa (~23.5 degrees) to convert tropical to sidereal positions.
6. BAZI: Use the Chinese solar calendar (not lunar). Month pillars change on specific solar terms dates, not the 1st of each month.
7. NUMEROLOGY: Use Pythagorean system. A=1,B=2,C=3,D=4,E=5,F=6,G=7,H=8,I=9,J=1,K=2,L=3,M=4,N=5,O=6,P=7,Q=8,R=9,S=1,T=2,U=3,V=4,W=5,X=6,Y=7,Z=8.

Respond ONLY with a valid JSON object, no markdown, no backticks. Use this exact structure:

{
  "name": "first name only",
  "birthLine": "Full Name • Month DD, YYYY at H:MM AM/PM • City, State",
  "badges": ["☉ Sun — Sign", "☽ Moon — Sign", "↑ Rising — Sign"],
  "soulSignature": "2-3 sentence poetic soul description personalized to their unique combination of placements",
  "soulTagline": "short memorable phrase in quotes",
  "western": {
    "placements": [
      {"key": "Sun", "val": "Sign °degree", "note": "Xth House"},
      {"key": "Moon", "val": "Sign °degree", "note": "Xth House"},
      {"key": "Rising", "val": "Sign °degree or Unknown", "note": ""},
      {"key": "Venus", "val": "Sign", "note": "Xth House"},
      {"key": "Mars", "val": "Sign", "note": "Xth House"},
      {"key": "Mercury", "val": "Sign", "note": "Xth House"},
      {"key": "Jupiter", "val": "Sign", "note": "Xth House"},
      {"key": "Saturn", "val": "Sign", "note": "Xth House"}
    ],
    "insights": [
      {"label": "Sun & Moon Combination", "text": "2-3 sentence interpretation of this specific sun-moon pairing", "style": "gold"},
      {"label": "Rising Sign Influence", "text": "2-3 sentence interpretation of rising sign", "style": "purple"},
      {"label": "Venus & Mars Dynamic", "text": "2-3 sentence interpretation of love and drive", "style": ""}
    ]
  },
  "vedic": {
    "placements": [
      {"key": "Sun (Rashi)", "val": "Sign", "note": ""},
      {"key": "Moon (Rashi)", "val": "Sign", "note": ""},
      {"key": "Lagna", "val": "Sign or Unknown", "note": ""},
      {"key": "Venus", "val": "Sign", "note": ""},
      {"key": "Mars", "val": "Sign", "note": ""},
      {"key": "Nakshatra", "val": "Moon nakshatra name", "note": "lunar mansion"}
    ],
    "insights": [
      {"label": "Vedic Soul Purpose", "text": "2-3 sentence interpretation of Vedic chart and soul karma", "style": "gold"},
      {"label": "Nakshatra Meaning", "text": "2-3 sentence interpretation of moon nakshatra", "style": ""}
    ]
  },
  "numerology": {
    "placements": [
      {"key": "Life Path", "val": "Number — Title", "note": "calculation shown"},
      {"key": "Destiny", "val": "Number", "note": "from full birth name"},
      {"key": "Soul Urge", "val": "Number", "note": "from vowels"},
      {"key": "Personality", "val": "Number", "note": "from consonants"},
      {"key": "Birth Day", "val": "Number", "note": "master number if 11, 22, 33"}
    ],
    "insights": [
      {"label": "Life Path Mission", "text": "2-3 sentence interpretation of life path number", "style": "gold"},
      {"label": "Name Numerology", "text": "2-3 sentence interpretation of destiny and soul urge", "style": "purple"}
    ]
  },
  "bazi": {
    "placements": [
      {"key": "Day Master", "val": "Element Name 天干", "note": "Yin or Yang"},
      {"key": "Year Pillar", "val": "Stem Branch — Animal", "note": ""},
      {"key": "Month Pillar", "val": "Stem Branch — Animal", "note": ""},
      {"key": "Day Pillar", "val": "Stem Branch — Animal", "note": ""},
      {"key": "Hour Pillar", "val": "Stem Branch — Animal or Unknown", "note": ""}
    ],
    "insights": [
      {"label": "Day Master Nature", "text": "2-3 sentence interpretation of Day Master element and personality", "style": "gold"},
      {"label": "Elemental Balance", "text": "2-3 sentence interpretation of overall chart balance", "style": ""}
    ]
  },
  "zodiac": {
    "placements": [
      {"key": "Year — Outer Self", "val": "Element Animal emoji", "note": ""},
      {"key": "Month — Social Self", "val": "Element Animal emoji", "note": ""},
      {"key": "Day — True Self", "val": "Element Animal emoji", "note": ""},
      {"key": "Hour — Hidden Drive", "val": "Element Animal emoji or Unknown", "note": ""}
    ],
    "insights": [
      {"label": "Four Animals Portrait", "text": "2-3 sentence interpretation weaving all four animals together", "style": "gold"}
    ]
  },
  "unified": "3-4 sentence unified soul summary weaving all five systems into one coherent portrait, deeply personalized to this specific person",
  "unifiedTagline": "final memorable closing phrase in quotes"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: data.error?.message || 'API error' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
