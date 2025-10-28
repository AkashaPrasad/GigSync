import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Types
export interface User {
  id: string;
  email: string;
  role: 'gig_worker' | 'vendor';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  bio?: string;
  rating?: number;
  totalJobsCompleted?: number;
  expectedPayPerHour?: number;
  experienceLevel?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface VendorProfile {
  id: string;
  userId: string;
  fullName: string;
  companyName: string;
  phone?: string;
  bio?: string;
  website?: string;
  address?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Job {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  workType: string;
  requiredSkills: string[];
  payMin: number;
  payMax: number;
  status: 'open' | 'closed' | 'completed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: Timestamp;
  acceptedAt?: Timestamp;
}

// User operations
export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  const userRef = await addDoc(collection(db, 'users'), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return userRef.id;
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  }
  return null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }
  return null;
};

// Profile operations
export const createProfile = async (profileData: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => {
  const profileRef = await addDoc(collection(db, 'profiles'), {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return profileRef.id;
};

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const q = query(collection(db, 'profiles'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Profile;
  }
  return null;
};

export const updateProfile = async (profileId: string, updates: Partial<Profile>) => {
  const profileRef = doc(db, 'profiles', profileId);
  await updateDoc(profileRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

// Vendor Profile operations
export const createVendorProfile = async (profileData: Omit<VendorProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
  const profileRef = await addDoc(collection(db, 'vendorProfiles'), {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return profileRef.id;
};

export const getVendorProfile = async (userId: string): Promise<VendorProfile | null> => {
  const q = query(collection(db, 'vendorProfiles'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as VendorProfile;
  }
  return null;
};

export const updateVendorProfile = async (profileId: string, updates: Partial<VendorProfile>) => {
  const profileRef = doc(db, 'vendorProfiles', profileId);
  await updateDoc(profileRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

// Job operations
export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
  const jobRef = await addDoc(collection(db, 'jobs'), {
    ...jobData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return jobRef.id;
};

export const getJobs = async (): Promise<Job[]> => {
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
};

export const getJobsByVendor = async (vendorId: string): Promise<Job[]> => {
  const q = query(
    collection(db, 'jobs'), 
    where('vendorId', '==', vendorId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
};

export const getOpenJobs = async (): Promise<Job[]> => {
  const q = query(
    collection(db, 'jobs'), 
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
};

export const updateJob = async (jobId: string, updates: Partial<Job>) => {
  const jobRef = doc(db, 'jobs', jobId);
  await updateDoc(jobRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

// Job Application operations
export const createJobApplication = async (applicationData: Omit<JobApplication, 'id' | 'appliedAt'>) => {
  const applicationRef = await addDoc(collection(db, 'jobApplications'), {
    ...applicationData,
    appliedAt: serverTimestamp()
  });
  return applicationRef.id;
};

export const getJobApplications = async (workerId: string): Promise<JobApplication[]> => {
  const q = query(
    collection(db, 'jobApplications'), 
    where('workerId', '==', workerId),
    orderBy('appliedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
};

export const getJobApplicationsByJob = async (jobId: string): Promise<JobApplication[]> => {
  const q = query(
    collection(db, 'jobApplications'), 
    where('jobId', '==', jobId),
    orderBy('appliedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
};

export const updateJobApplication = async (applicationId: string, updates: Partial<JobApplication>) => {
  const applicationRef = doc(db, 'jobApplications', applicationId);
  await updateDoc(applicationRef, {
    ...updates,
    ...(updates.status === 'accepted' && { acceptedAt: serverTimestamp() })
  });
};

// Real-time listeners
export const subscribeToJobs = (callback: (jobs: Job[]) => void) => {
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
    callback(jobs);
  });
};

export const subscribeToUserJobs = (vendorId: string, callback: (jobs: Job[]) => void) => {
  const q = query(
    collection(db, 'jobs'), 
    where('vendorId', '==', vendorId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (querySnapshot) => {
    const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
    callback(jobs);
  });
};
