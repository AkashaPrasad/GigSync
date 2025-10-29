// Demo data for showcasing the app functionality
export const demoJobRequests = [
  {
    id: "demo-request-1",
    workerId: "demo-worker-1",
    title: "Plumber for Kitchen Sink Repair",
    description: "Need an experienced plumber to fix a leaking kitchen sink. The faucet has been dripping for days and the drain is clogged. Looking for someone who can come today or tomorrow.",
    hours: 2,
    minPay: 800,
    maxPay: 1200,
    skills: ["Plumbing", "Kitchen Repair", "Drain Cleaning", "Faucet Repair"],
    location: "Mumbai, Maharashtra",
    urgency: "high" as const,
    status: "pending" as const,
    createdAt: {
      toDate: () => new Date('2024-01-15T10:30:00Z')
    } as any,
  },
  {
    id: "demo-request-2",
    workerId: "demo-worker-2",
    title: "Swiggy Delivery Partner",
    description: "Looking for delivery work in the evening hours. Have my own two-wheeler and valid driving license. Can work 4-6 hours daily from 6 PM to 10 PM.",
    hours: 4,
    minPay: 300,
    maxPay: 500,
    skills: ["Delivery", "Two-wheeler Driving", "Customer Service", "Time Management"],
    location: "Delhi, NCR",
    urgency: "medium" as const,
    status: "accepted" as const,
    acceptedBy: "demo-vendor-1",
    createdAt: {
      toDate: () => new Date('2024-01-14T15:45:00Z')
    } as any,
    acceptedAt: {
      toDate: () => new Date('2024-01-14T16:30:00Z')
    } as any,
  },
  {
    id: "demo-request-3",
    workerId: "demo-worker-3",
    title: "Home Cleaning Service",
    description: "Need a reliable cleaner for weekly house cleaning. 2BHK apartment, includes dusting, mopping, bathroom cleaning, and kitchen maintenance. Looking for someone trustworthy and punctual.",
    hours: 3,
    minPay: 400,
    maxPay: 600,
    skills: ["House Cleaning", "Dusting", "Mopping", "Bathroom Cleaning", "Kitchen Cleaning"],
    location: "Bangalore, Karnataka",
    urgency: "low" as const,
    status: "pending" as const,
    createdAt: {
      toDate: () => new Date('2024-01-13T09:20:00Z')
    } as any,
  },
  {
    id: "demo-request-4",
    workerId: "demo-worker-4",
    title: "Electrician for Wiring Issues",
    description: "House has electrical problems - some switches not working, lights flickering. Need a licensed electrician to diagnose and fix the issues. Safety is priority.",
    hours: 4,
    minPay: 1000,
    maxPay: 1500,
    skills: ["Electrical Work", "Wiring", "Switch Repair", "Safety Compliance", "Troubleshooting"],
    location: "Pune, Maharashtra",
    urgency: "high" as const,
    status: "pending" as const,
    createdAt: {
      toDate: () => new Date('2024-01-12T14:15:00Z')
    } as any,
  },
  {
    id: "demo-request-5",
    workerId: "demo-worker-5",
    title: "Carpenter for Furniture Repair",
    description: "Have a wooden dining table that needs repair - legs are loose and surface has scratches. Looking for a skilled carpenter who can restore it to good condition.",
    hours: 6,
    minPay: 1200,
    maxPay: 1800,
    skills: ["Carpentry", "Furniture Repair", "Wood Working", "Sanding", "Varnishing"],
    location: "Chennai, Tamil Nadu",
    urgency: "medium" as const,
    status: "accepted" as const,
    acceptedBy: "demo-vendor-2",
    createdAt: {
      toDate: () => new Date('2024-01-11T11:30:00Z')
    } as any,
    acceptedAt: {
      toDate: () => new Date('2024-01-11T14:15:00Z')
    } as any,
  }
];

export const demoJobPostings = [
  {
    id: "demo-job-1",
    vendorId: "demo-vendor-1",
    title: "Food Delivery Driver - Zomato",
    description: "Join our team as a food delivery partner! Flexible hours, good earnings, and the freedom to work when you want. Must have own two-wheeler and valid license.",
    workType: "Delivery",
    requiredSkills: ["Two-wheeler Driving", "Customer Service", "Time Management", "Navigation"],
    payMin: 250,
    payMax: 400,
    location: "Mumbai, Maharashtra",
    hours: 6,
    status: "open" as const,
    createdAt: {
      toDate: () => new Date('2024-01-10T08:00:00Z')
    } as any,
    updatedAt: {
      toDate: () => new Date('2024-01-10T08:00:00Z')
    } as any,
  },
  {
    id: "demo-job-2",
    vendorId: "demo-vendor-2",
    title: "House Cleaning Service Provider",
    description: "We need reliable cleaners for residential properties. Work includes dusting, mopping, bathroom cleaning, and general maintenance. Flexible scheduling available.",
    workType: "Cleaning",
    requiredSkills: ["House Cleaning", "Dusting", "Mopping", "Bathroom Cleaning", "Reliability"],
    payMin: 350,
    payMax: 550,
    location: "Delhi, NCR",
    hours: 4,
    status: "open" as const,
    createdAt: {
      toDate: () => new Date('2024-01-09T10:30:00Z')
    } as any,
    updatedAt: {
      toDate: () => new Date('2024-01-09T10:30:00Z')
    } as any,
  },
  {
    id: "demo-job-3",
    vendorId: "demo-vendor-3",
    title: "Plumbing Services - Emergency Repairs",
    description: "Join our emergency plumbing team! Handle urgent repairs, installations, and maintenance. Must have own tools and transportation. Good pay for experienced plumbers.",
    workType: "Plumbing",
    requiredSkills: ["Plumbing", "Emergency Repairs", "Tool Handling", "Problem Solving", "Customer Service"],
    payMin: 600,
    payMax: 1000,
    location: "Bangalore, Karnataka",
    hours: 8,
    status: "open" as const,
    createdAt: {
      toDate: () => new Date('2024-01-08T12:15:00Z')
    } as any,
    updatedAt: {
      toDate: () => new Date('2024-01-08T12:15:00Z')
    } as any,
  },
  {
    id: "demo-job-4",
    vendorId: "demo-vendor-4",
    title: "Electrician - Commercial Projects",
    description: "We're looking for skilled electricians for commercial electrical work. Projects include office wiring, lighting installation, and electrical maintenance. Must have proper certifications.",
    workType: "Electrical",
    requiredSkills: ["Electrical Work", "Commercial Wiring", "Lighting Installation", "Safety Compliance", "Certification"],
    payMin: 800,
    payMax: 1200,
    location: "Pune, Maharashtra",
    hours: 8,
    status: "open" as const,
    createdAt: {
      toDate: () => new Date('2024-01-07T14:45:00Z')
    } as any,
    updatedAt: {
      toDate: () => new Date('2024-01-07T14:45:00Z')
    } as any,
  },
  {
    id: "demo-job-5",
    vendorId: "demo-vendor-5",
    title: "Carpenter - Custom Furniture",
    description: "Join our custom furniture workshop! Work on bespoke pieces, repairs, and restoration projects. Must have experience with various wood types and finishing techniques.",
    workType: "Carpentry",
    requiredSkills: ["Carpentry", "Custom Furniture", "Wood Working", "Finishing", "Design Skills"],
    payMin: 1000,
    payMax: 1500,
    location: "Chennai, Tamil Nadu",
    hours: 8,
    status: "open" as const,
    createdAt: {
      toDate: () => new Date('2024-01-06T16:20:00Z')
    } as any,
    updatedAt: {
      toDate: () => new Date('2024-01-06T16:20:00Z')
    } as any,
  }
];

export const demoApplications = [
  {
    id: "demo-app-1",
    jobId: "demo-job-1",
    workerId: "demo-worker-1",
    status: "pending" as const,
    appliedAt: {
      toDate: () => new Date('2024-01-15T09:00:00Z')
    } as any,
  },
  {
    id: "demo-app-2",
    jobId: "demo-job-2",
    workerId: "demo-worker-2",
    status: "accepted" as const,
    appliedAt: {
      toDate: () => new Date('2024-01-14T11:30:00Z')
    } as any,
    acceptedAt: {
      toDate: () => new Date('2024-01-14T15:00:00Z')
    } as any,
  },
  {
    id: "demo-app-3",
    jobId: "demo-job-3",
    workerId: "demo-worker-3",
    status: "rejected" as const,
    appliedAt: {
      toDate: () => new Date('2024-01-13T14:15:00Z')
    } as any,
  }
];
