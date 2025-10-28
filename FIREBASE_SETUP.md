# Firebase Setup Instructions

This project has been migrated to use Firebase Firestore instead of Supabase. Follow these steps to set up Firebase for your project.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "gigflow-digilocker")
4. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication

## 3. Create Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database

## 4. Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web" (</> icon)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 5. Update Environment Variables

Update your `.env` file with the Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

## 6. Set Up Firestore Security Rules

In the Firestore Database section, go to "Rules" tab and add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own profile
    match /profiles/{profileId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Users can read/write their own vendor profile
    match /vendorProfiles/{profileId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Jobs are readable by all authenticated users
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.vendorId == request.auth.uid);
    }
    
    // Job applications are readable by the worker who applied or the job owner
    match /jobApplications/{applicationId} {
      allow read, write: if request.auth != null && 
        (resource.data.workerId == request.auth.uid || 
         exists(/databases/$(database)/documents/jobs/$(resource.data.jobId)) &&
         get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.vendorId == request.auth.uid);
    }
  }
}
```

## 7. Database Collections Structure

The following collections will be created automatically:

- `users` - User accounts and roles
- `profiles` - Worker profiles
- `vendorProfiles` - Vendor/company profiles
- `jobs` - Job postings
- `jobApplications` - Job applications

## 8. Run the Application

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open http://localhost:8080 in your browser

## Features Added

✅ **Homepage Navigation**: All dashboards now have a "Home" button to navigate back to the homepage
✅ **Firebase Authentication**: Complete authentication system using Firebase Auth
✅ **Firestore Database**: All data operations now use Firestore
✅ **Real-time Updates**: Firestore provides real-time data synchronization
✅ **Type Safety**: Full TypeScript support for all Firestore operations

## Migration Notes

- The app now uses Firebase instead of Supabase
- Authentication is handled by Firebase Auth
- All data is stored in Firestore collections
- Real-time listeners are available for live updates
- The UI remains the same, but the backend is now Firebase-powered

## Troubleshooting

If you encounter issues:

1. Make sure all environment variables are correctly set
2. Check that Firebase Authentication is enabled
3. Verify Firestore security rules are properly configured
4. Check the browser console for any error messages
5. Ensure your Firebase project is in the correct region
