import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import { createUser, getUserByEmail, User } from './firestore';

export const signUp = async (email: string, password: string, role: 'gig_worker' | 'vendor', fullName: string): Promise<UserCredential> => {
  try {
    console.log('Creating user with email:', email);
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Firebase user created:', userCredential.user.uid);
    
    // Create user document in Firestore
    await createUser({
      email,
      role,
      fullName
    });
    
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async (): Promise<void> => {
  return await signOut(auth);
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if user exists in Firestore, if not create them
    const existingUser = await getUserByEmail(result.user.email!);
    if (!existingUser) {
      // Create user document in Firestore with default role
      // User will be prompted to select role after first login
      await createUser({
        email: result.user.email!,
        role: 'gig_worker', // Default role, can be changed later
        fullName: result.user.displayName || result.user.email!.split('@')[0]
      });
    }
    
    return result;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUserData = async (): Promise<User | null> => {
  const user = getCurrentUser();
  if (!user) return null;
  
  return await getUserByEmail(user.email!);
};
