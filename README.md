# Tesbihat (PWA)

Statik HTML/CSS/JS ile çalışan (build step yok) tesbihat uygulaması.

## Yerel önizleme

- `npx serve .`
- veya `python3 -m http.server 3000`
- ardından `http://localhost:3000`

## Ortak Dua (Firebase) kurulumu

“Ortak Dua” (Ortak Hatim / Ortak Cevşen) özelliği için Firebase kullanılır (Firestore + Anonymous Auth). Hosting yine GitHub Pages’tir.

1) Firebase Console’dan proje oluşturun.

2) Authentication → Sign-in method:
- “Anonymous” girişini etkinleştirin.

3) Firestore Database oluşturun.

4) `firebase-config.js` içindeki `window.FIREBASE_CONFIG` değerlerini kendi projenizin web config’i ile doldurun.

5) Firestore Security Rules:
- `firestore.rules` içeriğini Firebase Console → Firestore → Rules bölümüne yapıştırın (veya Firebase CLI ile deploy edin).

