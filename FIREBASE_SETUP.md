# Firebase Chatroom Setup Guide

## 🔥 Firebase Configuration

Your chatroom now uses Firebase Firestore for real-time messaging! Here's how to set it up:

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `your-chatroom-name`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore Database

1. In your Firebase project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for now)
4. Select a location close to you
5. Click "Done"

### Step 3: Get Configuration

1. Click the gear icon → Project settings
2. Scroll down to "Your apps"
3. Click "Add app" → Web (</>) icon
4. Enter app nickname: `chatroom-web`
5. Click "Register app"
6. Copy the Firebase configuration object

### Step 4: Update Your Code

Replace the placeholder config in `index.html` (lines 369-377) with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

### Step 5: Set Database Rules (Security)

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomCode} {
      allow read, write: if true;
      match /messages/{messageId} {
        allow read, write: if true;
      }
      match /users/{userId} {
        allow read, write: if true;
      }
      match /typing/{userId} {
        allow read, write: if true;
      }
    }
  }
}
```

### Step 6: Deploy to GitHub Pages

```bash
git add .
git commit -m "Add Firebase chatroom"
git push origin main
```

## 🎉 You're Done!

Your chatroom will now work perfectly on GitHub Pages with:
- ✅ Real-time messaging via Firestore
- ✅ Room creation/joining
- ✅ User management
- ✅ Typing indicators
- ✅ Automatic persistence
- ✅ Better querying and indexing

## 🔒 Security Notes

- The current rules allow anyone to read/write
- For production, implement user authentication
- Consider rate limiting for message frequency
- Monitor usage in Firebase Console

## 📊 Firestore Free Tier Limits

- **Storage**: 1GB
- **Bandwidth**: 10GB/month
- **Document reads**: 50K/day
- **Document writes**: 20K/day
- **Document deletes**: 20K/day

Perfect for personal chatrooms!

## 🚀 Advanced Features (Optional)

- **Authentication**: Add Google/Facebook login
- **File sharing**: Upload images/files
- **Push notifications**: Notify when offline
- **Message history**: Pagination for large chats
- **Emoji reactions**: React to messages

Your Firebase chatroom is now ready to use! 🎉
