// ─── COMPONENT DATA ──────────────────────────────────────────────────────────
// All portfolio content lives here — edit this file to update the world

window.PORTFOLIO_DATA = [
  // ── BIG ICs (EXPERIENCE / EDUCATION) ─────────────────────────────────────
  {
    id: 'uw_madison',
    type: 'ic_large',
    x: 4, z: 4,
    w: 3.2, d: 3.2, h: 0.38,
    data: {
      tag: '// EDUCATION',
      title: 'UW–Madison',
      sub: 'B.S. ELECTRICAL ENGINEERING · CLASS OF 2029',
      desc: 'Electrical Engineering at one of the top public engineering programs in the US. Courses spanning circuits, embedded systems, signal processing, and MATLAB.',
      tags: ['EE', 'Circuits', 'MATLAB', 'Signal Processing', 'C++', 'UW-Madison']
    }
  },
  {
    id: 'artpark',
    type: 'ic_large',
    x: -5, z: 3,
    w: 2.6, d: 2.6, h: 0.34,
    data: {
      tag: '// WORK EXPERIENCE',
      title: 'ARTPARK @ IISc',
      sub: 'EMBEDDED SYSTEMS INTERN · AUG 2024 — JAN 2025',
      desc: 'Worked at India\'s leading tech innovation park building AI-powered robotics and autonomous systems. Wrote firmware in C++, deployed TensorFlow models on edge hardware, used ROS and ArduPilot.',
      tags: ['ROS', 'C++', 'Python', 'TensorFlow', 'ArduPilot', 'Linux', 'ML']
    }
  },
  {
    id: 'fsae',
    type: 'ic_large',
    x: -6, z: -4,
    w: 2.4, d: 2.4, h: 0.30,
    data: {
      tag: '// WORK EXPERIENCE',
      title: 'Wisconsin Racing',
      sub: 'ELECTRICAL ENGINEER · FSAE · 2025–PRESENT',
      desc: 'Electrical sub-team at Wisconsin Racing — designing, building, testing and racing a formula-style race car for international FSAE competition. PCBs, firmware, CAN bus.',
      tags: ['PCB Design', 'CAN Bus', 'Firmware', 'Embedded', 'C++', 'FSAE']
    }
  },
  {
    id: 'jalaposhan',
    type: 'ic_large',
    x: 5.5, z: -4.5,
    w: 2.8, d: 2.8, h: 0.36,
    data: {
      tag: '// PROJECT',
      title: 'Jala Poshan App',
      sub: 'LEAD APP DEVELOPER · 2024–PRESENT',
      desc: 'Cross-platform volunteer management app for Jakkur Lake conservation. Replaced cumbersome WhatsApp workflows with structured registration, event tracking, and real-time contribution logs.',
      tags: ['Flutter', 'React Native', 'Firebase', 'JavaScript', 'Mobile Design']
    }
  },

  // ── CAPACITORS (HARDWARE PROJECTS) ───────────────────────────────────────
  {
    id: 'esp32',
    type: 'capacitor',
    x: -2.5, z: 5.5,
    data: {
      tag: '// PROJECT',
      title: 'ESP32 RFID Access',
      sub: 'HARDWARE BUILD',
      desc: 'Smart access control — pre-registered RFID cards trigger a relay. Unknown cards denied instantly. Custom C++ firmware on ESP32 with real-time serial feedback.',
      tags: ['ESP32', 'RFID', 'C++', 'Relay', 'Hardware']
    }
  },
  {
    id: 'drone',
    type: 'capacitor',
    x: 2.5, z: -6.5,
    data: {
      tag: '// PROJECT',
      title: 'Arduino FPV Drone',
      sub: 'HARDWARE BUILD',
      desc: 'Full FPV quadcopter built from scratch — started as a LEGO prototype, evolved into a flying machine with GPS and ArduPilot autonomous navigation.',
      tags: ['Arduino', 'ArduPilot', 'GPS', 'FPV', 'Hardware', 'Drones']
    }
  },
  {
    id: 'spot_welder',
    type: 'capacitor',
    x: -3.5, z: -7,
    data: {
      tag: '// PROJECT',
      title: 'Arduino Spot Welder',
      sub: 'HARDWARE BUILD',
      desc: 'Repurposed a microwave oven transformer into a precision spot welder. Custom Arduino control circuit, digital pulse timing, safety relay. Recycling hardware with digital precision.',
      tags: ['Arduino', 'Power Electronics', 'Hardware', 'High Voltage']
    }
  },

  // ── LEDs (RESEARCH / INTERNSHIP) ─────────────────────────────────────────
  {
    id: 'research_1',
    type: 'led',
    x: 7.5, z: -2,
    data: {
      tag: '// PUBLISHED RESEARCH',
      title: 'AI-Powered Robotics',
      sub: 'IJCSPUB · JUNE 2, 2024',
      desc: '"The Transformative Landscape of AI-Powered Robotics: Innovations, Challenges and Ethical Considerations" — Published in the International Journal of Current Sciences.',
      tags: ['Published', 'AI', 'Robotics', 'Research', 'IJCSPUB']
    }
  },
  {
    id: 'research_2',
    type: 'led',
    x: -8.5, z: 0.5,
    data: {
      tag: '// PUBLISHED RESEARCH',
      title: 'AMD vs Intel Analysis',
      sub: 'IJCSPUB · MAY 2, 2024',
      desc: '"Comparison & Analysis of AMD Chips & Intel Chips" — Performance benchmarking, architectural analysis, and market positioning comparison. Published in IJCSPUB.',
      tags: ['Published', 'Hardware', 'CPU', 'Research', 'IJCSPUB']
    }
  },
  {
    id: 'bial',
    type: 'led',
    x: 0, z: 7.5,
    data: {
      tag: '// WORK EXPERIENCE',
      title: 'BIAL Internship',
      sub: 'ENGINEERING & MAINTENANCE · JUN — JUL 2024',
      desc: 'Bangalore International Airport Ltd — analysed air pollution and noise management systems at Kempegowda International Airport. Produced a formal enhancement report for E&M division.',
      tags: ['Research', 'Environmental', 'Compliance', 'Impact Assessment', 'Airport']
    }
  },

  // ── RESISTORS (ROBOTICS PROJECTS) ────────────────────────────────────────
  {
    id: 'ev3',
    type: 'resistor',
    x: -8.5, z: -7,
    rotation: 0,
    data: {
      tag: '// PROJECT',
      title: 'EV3 Self-Balancing Robot',
      sub: 'ROBOTICS BUILD',
      desc: 'Two-wheeled self-balancing LEGO EV3 robot with PID control. Detects objects in its path, balances dynamically on two wheels, and reads "emotions" from color sensor input.',
      tags: ['LEGO EV3', 'PID Control', 'Sensors', 'Robotics', 'Balancing']
    }
  },
  {
    id: 'sumobot',
    type: 'resistor',
    x: 8.5, z: 6,
    rotation: Math.PI / 2,
    data: {
      tag: '// PROJECT',
      title: 'Sumo Bot V2',
      sub: 'ROBOPARADE COMPETITION',
      desc: 'Competition-grade sumo robot — front lifting mechanism, tank-style tracks, superior grip pads. Built for and competed at Roboparade robotics competition.',
      tags: ['Competition', 'Arduino', 'Mechanical Design', 'Robotics', 'Sumo']
    }
  },

  // ── CONNECTOR (CONTACT) ───────────────────────────────────────────────────
  {
    id: 'contact',
    type: 'connector',
    x: -0.5, z: -8.5,
    data: {
      tag: '// CONTACT',
      title: 'Get In Touch',
      sub: 'aadityabharatsingh81@gmail.com',
      desc: 'Open to internships, research collaborations, FSAE connections, and cool hardware/software projects. Based in Madison, WI — let\'s build something real.',
      tags: ['LinkedIn', 'Instagram', '@aadityabsingh', 'Madison WI', 'Email']
    }
  }
];

// ─── ZONE MAP ─────────────────────────────────────────────────────────────────
window.ZONES = [
  { x: 0,  z: 4,   r: 5,   name: 'CPU CLUSTER' },
  { x: -5, z: -4,  r: 4,   name: 'POWER RAIL' },
  { x: 5,  z: -4,  r: 4,   name: 'DATA BUS' },
  { x: 0,  z: -8,  r: 3,   name: 'I/O CONNECTOR' },
  { x: -8, z: 0,   r: 3.5, name: 'SIGNAL ARRAY' },
  { x: 8,  z: 0,   r: 3.5, name: 'OUTPUT STAGE' },
];

// ─── STATUS MESSAGES (shown during loading) ───────────────────────────────────
window.LOADING_MSGS = [
  '// CALIBRATING HYPERDRIVE',
  '// INITIALISING PCB WORLD',
  '// LOADING COPPER TRACES',
  '// SPAWNING SOLDER ROBOT',
  '// COMPILING PORTFOLIO DATA',
  '// CHARGING CAPACITORS',
  '// KESSEL RUN IN 12 PARSECS',
  '// READY FOR TAKEOFF',
];
