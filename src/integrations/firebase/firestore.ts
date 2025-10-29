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

export interface JobRequest {
  id: string;
  workerId: string;
  title: string;
  description: string;
  hours: number;
  minPay: number;
  maxPay: number;
  skills: string[];
  location?: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'rejected';
  acceptedBy?: string; // vendorId who accepted
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
}

// User operations
export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log('Creating user in Firestore:', userData);
    const userRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('User created in Firestore with ID:', userRef.id);
    return userRef.id;
  } catch (error) {
    console.error('Error creating user in Firestore:', error);
    throw error;
  }
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
  // Get all jobs and filter/sort in memory to avoid index requirement
  const q = query(collection(db, 'jobs'));
  const querySnapshot = await getDocs(q);
  const jobs = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Job))
    .filter(job => job.vendorId === vendorId)
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  return jobs;
};

export const getOpenJobs = async (): Promise<Job[]> => {
  // First get all jobs, then filter and sort in memory to avoid index requirement
  const q = query(collection(db, 'jobs'));
  const querySnapshot = await getDocs(q);
  const jobs = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Job))
    .filter(job => job.status === 'open')
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  return jobs;
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
  // Get all applications and filter/sort in memory to avoid index requirement
  const q = query(collection(db, 'jobApplications'));
  const querySnapshot = await getDocs(q);
  const applications = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as JobApplication))
    .filter(app => app.workerId === workerId)
    .sort((a, b) => b.appliedAt.toMillis() - a.appliedAt.toMillis());
  return applications;
};

export const getJobApplicationsByJob = async (jobId: string): Promise<JobApplication[]> => {
  // Get all applications and filter/sort in memory to avoid index requirement
  const q = query(collection(db, 'jobApplications'));
  const querySnapshot = await getDocs(q);
  const applications = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as JobApplication))
    .filter(app => app.jobId === jobId)
    .sort((a, b) => b.appliedAt.toMillis() - a.appliedAt.toMillis());
  return applications;
};

export const updateJobApplication = async (applicationId: string, updates: Partial<JobApplication>) => {
  const applicationRef = doc(db, 'jobApplications', applicationId);
  await updateDoc(applicationRef, {
    ...updates,
    ...(updates.status === 'accepted' && { acceptedAt: serverTimestamp() })
  });
};

// Job Request operations
export const createJobRequest = async (requestData: Omit<JobRequest, 'id' | 'createdAt' | 'acceptedAt'>) => {
  const requestRef = await addDoc(collection(db, 'jobRequests'), {
    ...requestData,
    createdAt: serverTimestamp()
  });
  return requestRef.id;
};

export const getJobRequests = async (): Promise<JobRequest[]> => {
  const q = query(collection(db, 'jobRequests'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobRequest));
};

export const getJobRequestsByWorker = async (workerId: string): Promise<JobRequest[]> => {
  const q = query(collection(db, 'jobRequests'));
  const querySnapshot = await getDocs(q);
  const requests = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as JobRequest))
    .filter(request => request.workerId === workerId)
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  return requests;
};

export const getPendingJobRequests = async (): Promise<JobRequest[]> => {
  const q = query(collection(db, 'jobRequests'));
  const querySnapshot = await getDocs(q);
  const requests = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as JobRequest))
    .filter(request => request.status === 'pending')
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  return requests;
};

export const updateJobRequest = async (requestId: string, updates: Partial<JobRequest>) => {
  const requestRef = doc(db, 'jobRequests', requestId);
  await updateDoc(requestRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const acceptJobRequest = async (requestId: string, vendorId: string) => {
  const requestRef = doc(db, 'jobRequests', requestId);
  await updateDoc(requestRef, {
    status: 'accepted',
    acceptedBy: vendorId,
    acceptedAt: serverTimestamp()
  });
};

export const rejectJobRequest = async (requestId: string) => {
  const requestRef = doc(db, 'jobRequests', requestId);
  await updateDoc(requestRef, {
    status: 'rejected'
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
  // Use simple query and filter in memory to avoid index requirement
  const q = query(collection(db, 'jobs'));
  return onSnapshot(q, (querySnapshot) => {
    const jobs = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Job))
      .filter(job => job.vendorId === vendorId)
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    callback(jobs);
  });
};
