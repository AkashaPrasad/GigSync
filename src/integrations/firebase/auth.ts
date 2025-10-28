import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { auth } from './config';
import { createUser, getUserByEmail, User } from './firestore';

export const signUp = async (email: string, password: string, role: 'gig_worker' | 'vendor', fullName: string): Promise<UserCredential> => {
  try {
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
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

export const getCurrentUserData = async (): Promise<User | null> => {
  const user = getCurrentUser();
  if (!user) return null;
  
  return await getUserByEmail(user.email!);
};
