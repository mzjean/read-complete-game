// ============================================================
// Firebase Configuration
// ============================================================
// HOW TO SET UP:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use an existing one)
// 3. Go to Project Settings > General > Your apps > Add web app
// 4. Copy the firebaseConfig object and paste it below
// 5. Enable Authentication:
//    - Go to Authentication > Sign-in method
//    - Enable "Email link (passwordless sign-in)"
//    - Under "Authorized domains", add your hosting domain
//      (e.g. yourusername.github.io)
// 6. Enable Firestore:
//    - Go to Firestore Database > Create database
//    - Start in test mode (or set up rules below)
//
// RECOMMENDED FIRESTORE RULES (paste in Firestore > Rules):
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     // Users can read/write their own data
//     match /users/{userId} {
//       allow read, write: if request.auth != null && request.auth.uid == userId;
//     }
//     // Game results: users write their own, everyone reads for leaderboard
//     match /gameResults/{resultId} {
//       allow read: if request.auth != null;
//       allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
//     }
//     // Leaderboard: readable by all authenticated users
//     match /leaderboard/{userId} {
//       allow read: if request.auth != null;
//       allow write: if request.auth != null && userId == request.auth.uid;
//     }
//   }
// }
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
