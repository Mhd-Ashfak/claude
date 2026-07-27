// Session catalog data grouped by category. Prices in LKR.
export const CATEGORIES = [
  {
    id: "floor",
    label: "General Gym Floor Access",
    filter: "Gym Floor Access",
  },
  {
    id: "classes",
    label: "Group Fitness Classes",
    filter: "Group Fitness Classes",
  },
  {
    id: "personal",
    label: "Personal Training (1-on-1)",
    filter: "Personal Training",
  },
];

export const SESSIONS = [
  {
    id: "peak-floor",
    category: "floor",
    title: "Peak Hours Floor Pass",
    description:
      "Reservation for dynamic weight training and cardio equipment during premium high-energy intervals.",
    price: 1500,
    duration: 90,
  },
  {
    id: "offpeak-floor",
    category: "floor",
    title: "Off-Peak Floor Pass",
    description:
      "Perfect for crowd-free workouts with total accessibility to all lifting racks and fitness gear.",
    price: 1000,
    duration: 120,
  },
  {
    id: "hiit-blast",
    category: "classes",
    title: "High Intensity HIIT Blast",
    description:
      "Metabolic conditioning, functional intervals, and explosive plyometrics orchestrated by elite instructors.",
    price: 2500,
    duration: 60,
  },
  {
    id: "elite-power",
    category: "personal",
    title: "Elite Power & Strength Coaching",
    description:
      "Custom programming focusing heavily on biomechanics, heavy lifting form, and progressive overloading vectors.",
    price: 5000,
    duration: 60,
  },
];

export const formatLKR = (amount) =>
  "LKR " + amount.toLocaleString("en-US");

export const getSession = (id) => SESSIONS.find((s) => s.id === id);
