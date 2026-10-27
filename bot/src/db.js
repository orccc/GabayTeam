import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// בשרת ההרשאות מגיעות מקובץ ה-service account שב-GOOGLE_APPLICATION_CREDENTIALS.
// מול האמולטור (FIRESTORE_EMULATOR_HOST) לא צריך הרשאות בכלל.
export function connectFirestore(projectId) {
  return getFirestore(initializeApp({ projectId }));
}

// האוסף testimonials. כל מסמך:
//   name, rating (1-5), testimonial, image (נתיב באתר או data URL), videoUrl, order, createdAt, updatedAt
// האתר מציג לפי order מהקטן לגדול.
export function testimonialsRepo(db) {
  const collection = db.collection("testimonials");
  const now = () => FieldValue.serverTimestamp();

  async function list() {
    const snap = await collection.orderBy("order").get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async function get(id) {
    const doc = await collection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  // המלצה חדשה נכנסת ראשונה באתר
  async function create(data) {
    const first = await collection.orderBy("order").limit(1).get();
    const order = first.empty ? 0 : first.docs[0].get("order") - 1;
    const ref = await collection.add({ image: null, videoUrl: null, ...data, order, createdAt: now(), updatedAt: now() });
    return ref.id;
  }

  async function update(id, data) {
    await collection.doc(id).update({ ...data, updatedAt: now() });
  }

  async function remove(id) {
    await collection.doc(id).delete();
  }

  // מחליף מקום עם השכנה (direction: 1- למעלה, 1 למטה). מחזיר false אם אין לאן לזוז.
  async function move(id, direction) {
    const items = await list();
    const index = items.findIndex((item) => item.id === id);
    const other = items[index + direction];
    if (index < 0 || !other) return false;

    const batch = db.batch();
    batch.update(collection.doc(id), { order: other.order, updatedAt: now() });
    batch.update(collection.doc(other.id), { order: items[index].order });
    await batch.commit();
    return true;
  }

  // העתקה חד-פעמית של ההמלצות המקוריות מהקוד, באותו סדר
  async function importDefaults(defaults) {
    const batch = db.batch();
    defaults.forEach((item, order) => {
      batch.set(collection.doc(), {
        name: item.name,
        rating: item.rating,
        testimonial: item.testimonial,
        image: item.image ?? null,
        videoUrl: item.videoUrl ?? null,
        order,
        createdAt: now(),
        updatedAt: now(),
      });
    });
    await batch.commit();
  }

  return { list, get, create, update, remove, move, importDefaults };
}
