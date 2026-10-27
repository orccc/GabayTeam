// קריאה ציבורית מ-Firestore דרך ה-REST API, בלי ה-SDK של Firebase (שומר על באנדל קטן).
// החוקים ב-firestore.rules מתירים לגולשים קריאה בלבד; הכתיבה נעשית רק מהבוט (Admin SDK).
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "gabayteam-6d556";
// לבדיקה מקומית מול האמולטור: VITE_FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
const emulatorHost = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST;
const baseUrl = emulatorHost ? `http://${emulatorHost}/v1` : "https://firestore.googleapis.com/v1";

// ה-REST מחזיר כל ערך עטוף בסוג שלו ({ stringValue: "..." } וכו')
function fromValue(value) {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(fromValue);
  if ("mapValue" in value) return fromFields(value.mapValue.fields || {});
  return null;
}

function fromFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, fromValue(value)]));
}

// מחזיר את כל המסמכים באוסף כמערך של אובייקטים רגילים, כל אחד עם id
export async function fetchCollection(name, { signal } = {}) {
  const url = `${baseUrl}/projects/${projectId}/databases/(default)/documents/${name}?pageSize=300`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Firestore ${res.status}`);
  const { documents = [] } = await res.json();
  return documents.map((doc) => ({ id: doc.name.split("/").pop(), ...fromFields(doc.fields || {}) }));
}
