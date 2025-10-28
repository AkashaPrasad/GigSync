-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('gig_worker', 'vendor', 'admin');

-- Create profiles table for gig workers
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  skills TEXT[] DEFAULT '{}',
  availability_hours_per_day INTEGER,
  availability_days_per_week INTEGER,
  expected_pay_per_hour DECIMAL(10,2),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  languages_known TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  total_jobs_completed INTEGER DEFAULT 0,
  verified_id BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vendor profiles table
CREATE TABLE public.vendor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  work_type TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  duration_hours INTEGER,
  duration_days INTEGER,
  pay_min DECIMAL(10,2) NOT NULL,
  pay_max DECIMAL(10,2) NOT NULL,
  workers_needed INTEGER DEFAULT 1,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(job_id, worker_id)
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all worker profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for vendor_profiles
CREATE POLICY "Users can view all vendor profiles"
  ON public.vendor_profiles FOR SELECT
  USING (true);

CREATE POLICY "Vendors can update their own profile"
  ON public.vendor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Vendors can insert their own profile"
  ON public.vendor_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for jobs
CREATE POLICY "Anyone can view open jobs"
  ON public.jobs FOR SELECT
  USING (true);

CREATE POLICY "Vendors can insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendor_profiles
      WHERE vendor_profiles.id = jobs.vendor_id
      AND vendor_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can update their own jobs"
  ON public.jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM vendor_profiles
      WHERE vendor_profiles.id = jobs.vendor_id
      AND vendor_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for job_applications
CREATE POLICY "Workers and vendors can view relevant applications"
  ON public.job_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = job_applications.worker_id
      AND profiles.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM jobs
      JOIN vendor_profiles ON jobs.vendor_id = vendor_profiles.id
      WHERE jobs.id = job_applications.job_id
      AND vendor_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Workers can insert applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = job_applications.worker_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can update applications for their jobs"
  ON public.job_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      JOIN vendor_profiles ON jobs.vendor_id = vendor_profiles.id
      WHERE jobs.id = job_applications.job_id
      AND vendor_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for payments
CREATE POLICY "Workers and vendors can view relevant payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM job_applications
      JOIN profiles ON job_applications.worker_id = profiles.id
      WHERE job_applications.id = payments.application_id
      AND profiles.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM job_applications
      JOIN jobs ON job_applications.job_id = jobs.id
      JOIN vendor_profiles ON jobs.vendor_id = vendor_profiles.id
      WHERE job_applications.id = payments.application_id
      AND vendor_profiles.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_vendor_profiles_updated_at
  BEFORE UPDATE ON public.vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();