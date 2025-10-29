// AI Service for job title and skill suggestions
// Using a mock AI service that simulates real AI responses

export interface JobTitleSuggestion {
  title: string;
  category: string;
  description: string;
}

export interface SkillSuggestion {
  skill: string;
  category: string;
  relevance: number;
}

// Mock AI service - in production, this would call a real AI API
export class AIService {
  private static jobTitles: JobTitleSuggestion[] = [
    // Technology
    { title: "Software Developer", category: "Technology", description: "Develop and maintain software applications" },
    { title: "Frontend Developer", category: "Technology", description: "Build user interfaces and client-side applications" },
    { title: "Backend Developer", category: "Technology", description: "Develop server-side applications and APIs" },
    { title: "Full Stack Developer", category: "Technology", description: "Work on both frontend and backend development" },
    { title: "Mobile App Developer", category: "Technology", description: "Create mobile applications for iOS/Android" },
    { title: "Data Scientist", category: "Technology", description: "Analyze data and build machine learning models" },
    { title: "DevOps Engineer", category: "Technology", description: "Manage infrastructure and deployment pipelines" },
    { title: "UI/UX Designer", category: "Technology", description: "Design user interfaces and user experiences" },
    { title: "Product Manager", category: "Technology", description: "Manage product development and strategy" },
    { title: "QA Engineer", category: "Technology", description: "Test software and ensure quality" },
    
    // Design & Creative
    { title: "Graphic Designer", category: "Design", description: "Create visual designs and graphics" },
    { title: "Web Designer", category: "Design", description: "Design websites and web applications" },
    { title: "Logo Designer", category: "Design", description: "Create logos and brand identities" },
    { title: "Video Editor", category: "Design", description: "Edit and produce video content" },
    { title: "Photographer", category: "Design", description: "Take professional photographs" },
    { title: "Illustrator", category: "Design", description: "Create illustrations and artwork" },
    { title: "Brand Designer", category: "Design", description: "Develop brand identities and guidelines" },
    { title: "Motion Graphics Designer", category: "Design", description: "Create animated graphics and videos" },
    
    // Writing & Content
    { title: "Content Writer", category: "Writing", description: "Write articles, blogs, and marketing content" },
    { title: "Copywriter", category: "Writing", description: "Write persuasive marketing copy" },
    { title: "Technical Writer", category: "Writing", description: "Write technical documentation" },
    { title: "Blog Writer", category: "Writing", description: "Write blog posts and articles" },
    { title: "Social Media Manager", category: "Writing", description: "Manage social media accounts and content" },
    { title: "SEO Specialist", category: "Writing", description: "Optimize content for search engines" },
    { title: "Email Marketing Specialist", category: "Writing", description: "Create and manage email campaigns" },
    { title: "Ghostwriter", category: "Writing", description: "Write content for others" },
    
    // Business & Marketing
    { title: "Digital Marketer", category: "Marketing", description: "Manage digital marketing campaigns" },
    { title: "Marketing Manager", category: "Marketing", description: "Plan and execute marketing strategies" },
    { title: "Sales Representative", category: "Sales", description: "Sell products or services" },
    { title: "Business Analyst", category: "Business", description: "Analyze business processes and data" },
    { title: "Project Manager", category: "Business", description: "Manage projects and teams" },
    { title: "Virtual Assistant", category: "Business", description: "Provide administrative support remotely" },
    { title: "Customer Service Representative", category: "Business", description: "Handle customer inquiries and support" },
    { title: "Account Manager", category: "Business", description: "Manage client relationships" },
    
    // Education & Training
    { title: "Online Tutor", category: "Education", description: "Provide online tutoring services" },
    { title: "Course Creator", category: "Education", description: "Create online courses and educational content" },
    { title: "Language Teacher", category: "Education", description: "Teach languages online" },
    { title: "Math Tutor", category: "Education", description: "Provide math tutoring services" },
    { title: "Music Teacher", category: "Education", description: "Teach music lessons online" },
    { title: "Fitness Instructor", category: "Education", description: "Provide fitness training and coaching" },
    
    // Essential Services & Trades
    { title: "Plumber", category: "Trades", description: "Install, repair, and maintain plumbing systems" },
    { title: "Electrician", category: "Trades", description: "Install, repair, and maintain electrical systems" },
    { title: "Delivery Driver", category: "Delivery", description: "Deliver packages and goods to customers" },
    { title: "Food Delivery Driver", category: "Delivery", description: "Deliver food orders from restaurants" },
    { title: "Swiggy Delivery Partner", category: "Delivery", description: "Deliver food orders through Swiggy platform" },
    { title: "Zomato Delivery Partner", category: "Delivery", description: "Deliver food orders through Zomato platform" },
    { title: "Uber Eats Driver", category: "Delivery", description: "Deliver food orders through Uber Eats" },
    { title: "Amazon Delivery Driver", category: "Delivery", description: "Deliver packages for Amazon" },
    { title: "Carpenter", category: "Trades", description: "Build and repair wooden structures and furniture" },
    { title: "Painter", category: "Trades", description: "Paint interior and exterior surfaces" },
    { title: "Mechanic", category: "Trades", description: "Repair and maintain vehicles and machinery" },
    { title: "HVAC Technician", category: "Trades", description: "Install and repair heating, ventilation, and air conditioning" },
    { title: "Welder", category: "Trades", description: "Join metal parts using welding techniques" },
    { title: "Mason", category: "Trades", description: "Build structures using bricks, stones, and concrete" },
    { title: "Roofer", category: "Trades", description: "Install and repair roofs and roofing systems" },
    { title: "Flooring Installer", category: "Trades", description: "Install various types of flooring materials" },
    { title: "Landscaper", category: "Trades", description: "Design and maintain outdoor spaces and gardens" },
    { title: "Cleaner", category: "Services", description: "Clean residential and commercial spaces" },
    { title: "Housekeeper", category: "Services", description: "Maintain cleanliness in homes and hotels" },
    { title: "Janitor", category: "Services", description: "Clean and maintain commercial buildings" },
    { title: "Security Guard", category: "Services", description: "Protect property and ensure safety" },
    { title: "Security Officer", category: "Services", description: "Monitor and protect facilities" },
    { title: "Receptionist", category: "Services", description: "Handle front desk operations and customer service" },
    { title: "Cashier", category: "Services", description: "Process payments and handle customer transactions" },
    { title: "Retail Associate", category: "Services", description: "Assist customers in retail stores" },
    { title: "Sales Associate", category: "Services", description: "Help customers and process sales" },
    { title: "Stock Clerk", category: "Services", description: "Manage inventory and stock shelves" },
    { title: "Warehouse Worker", category: "Services", description: "Handle and organize warehouse inventory" },
    { title: "Forklift Operator", category: "Services", description: "Operate forklifts to move materials" },
    { title: "Packaging Worker", category: "Services", description: "Package products for shipping" },
    { title: "Assembly Line Worker", category: "Services", description: "Assemble products in manufacturing" },
    { title: "Factory Worker", category: "Services", description: "Work in manufacturing and production" },
    { title: "Kitchen Helper", category: "Food Service", description: "Assist in food preparation and kitchen operations" },
    { title: "Dishwasher", category: "Food Service", description: "Wash dishes and maintain kitchen cleanliness" },
    { title: "Server", category: "Food Service", description: "Serve food and beverages to customers" },
    { title: "Waiter", category: "Food Service", description: "Take orders and serve customers in restaurants" },
    { title: "Waitress", category: "Food Service", description: "Take orders and serve customers in restaurants" },
    { title: "Bartender", category: "Food Service", description: "Prepare and serve alcoholic beverages" },
    { title: "Barista", category: "Food Service", description: "Prepare and serve coffee and beverages" },
    { title: "Cook", category: "Food Service", description: "Prepare meals in restaurants and kitchens" },
    { title: "Chef", category: "Food Service", description: "Plan and prepare meals in professional kitchens" },
    { title: "Line Cook", category: "Food Service", description: "Prepare food items on the cooking line" },
    { title: "Prep Cook", category: "Food Service", description: "Prepare ingredients for cooking" },
    { title: "Fast Food Worker", category: "Food Service", description: "Work in fast food restaurants" },
    { title: "Drive-Thru Operator", category: "Food Service", description: "Take orders at drive-thru windows" },
    { title: "Catering Assistant", category: "Food Service", description: "Assist with catering events and food service" },
    { title: "Caregiver", category: "Healthcare", description: "Provide care and assistance to elderly or disabled" },
    { title: "Home Health Aide", category: "Healthcare", description: "Provide in-home healthcare assistance" },
    { title: "Nursing Assistant", category: "Healthcare", description: "Assist nurses with patient care" },
    { title: "Medical Assistant", category: "Healthcare", description: "Assist with medical procedures and patient care" },
    { title: "Pharmacy Technician", category: "Healthcare", description: "Assist pharmacists with medication preparation" },
    { title: "Dental Assistant", category: "Healthcare", description: "Assist dentists with patient care" },
    { title: "Veterinary Assistant", category: "Healthcare", description: "Assist veterinarians with animal care" },
    { title: "Pet Groomer", category: "Services", description: "Groom and care for pets" },
    { title: "Dog Walker", category: "Services", description: "Walk and exercise dogs" },
    { title: "Pet Sitter", category: "Services", description: "Care for pets while owners are away" },
    { title: "Babysitter", category: "Services", description: "Care for children in their absence" },
    { title: "Nanny", category: "Services", description: "Provide full-time childcare services" },
    { title: "Elderly Caregiver", category: "Services", description: "Provide care and companionship for elderly" },
    { title: "Personal Care Assistant", category: "Services", description: "Assist with daily living activities" },
    { title: "House Sitter", category: "Services", description: "Watch over homes while owners are away" },
    { title: "Laundry Worker", category: "Services", description: "Wash, dry, and fold laundry" },
    { title: "Dry Cleaner", category: "Services", description: "Clean delicate garments using dry cleaning" },
    { title: "Tailor", category: "Services", description: "Alter and repair clothing" },
    { title: "Cobbler", category: "Services", description: "Repair and maintain shoes" },
    { title: "Key Maker", category: "Services", description: "Duplicate and repair keys" },
    { title: "Locksmith", category: "Services", description: "Install, repair, and open locks" },
    { title: "Appliance Repair Technician", category: "Trades", description: "Repair household appliances" },
    { title: "AC Repair Technician", category: "Trades", description: "Repair and maintain air conditioning units" },
    { title: "Refrigerator Repair Technician", category: "Trades", description: "Repair and maintain refrigerators" },
    { title: "Washing Machine Repair Technician", category: "Trades", description: "Repair and maintain washing machines" },
    { title: "TV Repair Technician", category: "Trades", description: "Repair and maintain televisions" },
    { title: "Computer Repair Technician", category: "Trades", description: "Repair and maintain computers" },
    { title: "Phone Repair Technician", category: "Trades", description: "Repair and maintain mobile phones" },
    { title: "Bicycle Mechanic", category: "Trades", description: "Repair and maintain bicycles" },
    { title: "Motorcycle Mechanic", category: "Trades", description: "Repair and maintain motorcycles" },
    { title: "Auto Mechanic", category: "Trades", description: "Repair and maintain automobiles" },
    { title: "Tire Technician", category: "Trades", description: "Install and repair tires" },
    { title: "Oil Change Technician", category: "Trades", description: "Perform oil changes and basic maintenance" },
    { title: "Car Wash Attendant", category: "Services", description: "Wash and clean vehicles" },
    { title: "Valet Parking Attendant", category: "Services", description: "Park and retrieve customer vehicles" },
    { title: "Taxi Driver", category: "Transportation", description: "Drive passengers to their destinations" },
    { title: "Uber Driver", category: "Transportation", description: "Drive passengers through Uber platform" },
    { title: "Ola Driver", category: "Transportation", description: "Drive passengers through Ola platform" },
    { title: "Auto Rickshaw Driver", category: "Transportation", description: "Drive auto rickshaws for passengers" },
    { title: "Bus Driver", category: "Transportation", description: "Drive buses for public or private transport" },
    { title: "Truck Driver", category: "Transportation", description: "Drive trucks to transport goods" },
    { title: "Tempo Driver", category: "Transportation", description: "Drive tempo vehicles for goods transport" },
    { title: "Construction Worker", category: "Construction", description: "Work on construction sites and building projects" },
    { title: "Laborer", category: "Construction", description: "Perform manual labor on construction sites" },
    { title: "Helper", category: "Construction", description: "Assist skilled workers on construction sites" },
    { title: "Scaffolding Worker", category: "Construction", description: "Erect and dismantle scaffolding structures" },
    { title: "Concrete Worker", category: "Construction", description: "Pour and finish concrete structures" },
    { title: "Steel Worker", category: "Construction", description: "Work with steel structures and reinforcement" },
    { title: "Crane Operator", category: "Construction", description: "Operate cranes for lifting heavy materials" },
    { title: "Excavator Operator", category: "Construction", description: "Operate excavators for digging and earthwork" },
    { title: "Loader Operator", category: "Construction", description: "Operate loaders for moving materials" },
    { title: "Demolition Worker", category: "Construction", description: "Demolish buildings and structures" },
    { title: "Debris Removal Worker", category: "Construction", description: "Remove construction debris and waste" },
    { title: "Gardener", category: "Services", description: "Maintain gardens and outdoor spaces" },
    { title: "Lawn Care Worker", category: "Services", description: "Maintain lawns and grass areas" },
    { title: "Tree Trimmer", category: "Services", description: "Trim and maintain trees" },
    { title: "Pest Control Technician", category: "Services", description: "Control and eliminate pests" },
    { title: "Exterminator", category: "Services", description: "Eliminate pests and insects" },
    { title: "Window Cleaner", category: "Services", description: "Clean windows in buildings" },
    { title: "Carpet Cleaner", category: "Services", description: "Clean carpets and rugs" },
    { title: "Upholstery Cleaner", category: "Services", description: "Clean furniture upholstery" },
    { title: "Pressure Washer", category: "Services", description: "Clean surfaces using pressure washing" },
    { title: "Gutter Cleaner", category: "Services", description: "Clean gutters and downspouts" },
    { title: "Chimney Sweep", category: "Services", description: "Clean chimneys and flues" },
    { title: "Duct Cleaner", category: "Services", description: "Clean air ducts and ventilation systems" },
    { title: "Translator", category: "Services", description: "Translate text between languages" },
    { title: "Transcriber", category: "Services", description: "Convert audio to text" },
    { title: "Data Entry Specialist", category: "Services", description: "Enter and manage data" },
    { title: "Bookkeeper", category: "Services", description: "Manage financial records" },
    { title: "Researcher", category: "Services", description: "Conduct research and analysis" },
    { title: "Consultant", category: "Services", description: "Provide expert advice and guidance" },
    { title: "Event Planner", category: "Services", description: "Plan and organize events" },
    { title: "Personal Shopper", category: "Services", description: "Shop for others based on their needs" }
  ];

  private static skills: SkillSuggestion[] = [
    // Technology Skills
    { skill: "JavaScript", category: "Programming", relevance: 0.95 },
    { skill: "Python", category: "Programming", relevance: 0.9 },
    { skill: "React", category: "Frontend", relevance: 0.9 },
    { skill: "Node.js", category: "Backend", relevance: 0.85 },
    { skill: "TypeScript", category: "Programming", relevance: 0.85 },
    { skill: "HTML", category: "Frontend", relevance: 0.8 },
    { skill: "CSS", category: "Frontend", relevance: 0.8 },
    { skill: "SQL", category: "Database", relevance: 0.8 },
    { skill: "Git", category: "Tools", relevance: 0.75 },
    { skill: "Docker", category: "DevOps", relevance: 0.7 },
    { skill: "AWS", category: "Cloud", relevance: 0.7 },
    { skill: "Machine Learning", category: "AI/ML", relevance: 0.65 },
    
    // Design Skills
    { skill: "Adobe Photoshop", category: "Design", relevance: 0.9 },
    { skill: "Adobe Illustrator", category: "Design", relevance: 0.9 },
    { skill: "Figma", category: "Design", relevance: 0.85 },
    { skill: "Sketch", category: "Design", relevance: 0.8 },
    { skill: "Adobe XD", category: "Design", relevance: 0.8 },
    { skill: "Canva", category: "Design", relevance: 0.75 },
    { skill: "UI Design", category: "Design", relevance: 0.9 },
    { skill: "UX Design", category: "Design", relevance: 0.85 },
    { skill: "Branding", category: "Design", relevance: 0.8 },
    { skill: "Typography", category: "Design", relevance: 0.75 },
    
    // Writing Skills
    { skill: "Content Writing", category: "Writing", relevance: 0.9 },
    { skill: "Copywriting", category: "Writing", relevance: 0.9 },
    { skill: "SEO Writing", category: "Writing", relevance: 0.85 },
    { skill: "Technical Writing", category: "Writing", relevance: 0.8 },
    { skill: "Blog Writing", category: "Writing", relevance: 0.8 },
    { skill: "Email Marketing", category: "Marketing", relevance: 0.75 },
    { skill: "Social Media", category: "Marketing", relevance: 0.75 },
    { skill: "Research", category: "Writing", relevance: 0.7 },
    
    // Business Skills
    { skill: "Project Management", category: "Business", relevance: 0.9 },
    { skill: "Data Analysis", category: "Business", relevance: 0.85 },
    { skill: "Excel", category: "Business", relevance: 0.8 },
    { skill: "PowerPoint", category: "Business", relevance: 0.75 },
    { skill: "Sales", category: "Business", relevance: 0.8 },
    { skill: "Customer Service", category: "Business", relevance: 0.75 },
    { skill: "Communication", category: "Soft Skills", relevance: 0.9 },
    { skill: "Leadership", category: "Soft Skills", relevance: 0.8 },
    
    // Language Skills
    { skill: "English", category: "Language", relevance: 0.9 },
    { skill: "Spanish", category: "Language", relevance: 0.7 },
    { skill: "French", category: "Language", relevance: 0.6 },
    { skill: "German", category: "Language", relevance: 0.6 },
    { skill: "Chinese", category: "Language", relevance: 0.5 },
    { skill: "Japanese", category: "Language", relevance: 0.5 },
    
    // Trades & Technical Skills
    { skill: "Plumbing", category: "Trades", relevance: 0.95 },
    { skill: "Electrical Work", category: "Trades", relevance: 0.95 },
    { skill: "Carpentry", category: "Trades", relevance: 0.9 },
    { skill: "Painting", category: "Trades", relevance: 0.85 },
    { skill: "Welding", category: "Trades", relevance: 0.9 },
    { skill: "HVAC", category: "Trades", relevance: 0.9 },
    { skill: "Masonry", category: "Trades", relevance: 0.85 },
    { skill: "Roofing", category: "Trades", relevance: 0.85 },
    { skill: "Flooring Installation", category: "Trades", relevance: 0.8 },
    { skill: "Landscaping", category: "Trades", relevance: 0.8 },
    { skill: "Auto Repair", category: "Trades", relevance: 0.9 },
    { skill: "Motorcycle Repair", category: "Trades", relevance: 0.85 },
    { skill: "Bicycle Repair", category: "Trades", relevance: 0.8 },
    { skill: "Appliance Repair", category: "Trades", relevance: 0.85 },
    { skill: "AC Repair", category: "Trades", relevance: 0.85 },
    { skill: "Phone Repair", category: "Trades", relevance: 0.8 },
    { skill: "Computer Repair", category: "Trades", relevance: 0.8 },
    { skill: "Locksmithing", category: "Trades", relevance: 0.85 },
    { skill: "Key Making", category: "Trades", relevance: 0.8 },
    { skill: "Tailoring", category: "Trades", relevance: 0.8 },
    { skill: "Shoe Repair", category: "Trades", relevance: 0.8 },
    
    // Delivery & Transportation
    { skill: "Driving", category: "Transportation", relevance: 0.95 },
    { skill: "Delivery", category: "Transportation", relevance: 0.9 },
    { skill: "Food Delivery", category: "Transportation", relevance: 0.9 },
    { skill: "Package Delivery", category: "Transportation", relevance: 0.85 },
    { skill: "Ride Sharing", category: "Transportation", relevance: 0.85 },
    { skill: "Taxi Driving", category: "Transportation", relevance: 0.85 },
    { skill: "Truck Driving", category: "Transportation", relevance: 0.9 },
    { skill: "Bus Driving", category: "Transportation", relevance: 0.85 },
    { skill: "Forklift Operation", category: "Transportation", relevance: 0.8 },
    { skill: "Crane Operation", category: "Transportation", relevance: 0.8 },
    { skill: "Excavator Operation", category: "Transportation", relevance: 0.8 },
    { skill: "GPS Navigation", category: "Transportation", relevance: 0.7 },
    { skill: "Route Planning", category: "Transportation", relevance: 0.7 },
    { skill: "Vehicle Maintenance", category: "Transportation", relevance: 0.8 },
    
    // Food Service
    { skill: "Cooking", category: "Food Service", relevance: 0.9 },
    { skill: "Food Preparation", category: "Food Service", relevance: 0.9 },
    { skill: "Kitchen Operations", category: "Food Service", relevance: 0.85 },
    { skill: "Serving", category: "Food Service", relevance: 0.85 },
    { skill: "Bartending", category: "Food Service", relevance: 0.8 },
    { skill: "Coffee Making", category: "Food Service", relevance: 0.8 },
    { skill: "Food Safety", category: "Food Service", relevance: 0.9 },
    { skill: "Menu Knowledge", category: "Food Service", relevance: 0.7 },
    { skill: "Customer Service", category: "Food Service", relevance: 0.8 },
    { skill: "Cash Handling", category: "Food Service", relevance: 0.7 },
    { skill: "Order Taking", category: "Food Service", relevance: 0.8 },
    { skill: "Dishwashing", category: "Food Service", relevance: 0.7 },
    { skill: "Cleaning", category: "Food Service", relevance: 0.8 },
    
    // Cleaning & Maintenance
    { skill: "Housekeeping", category: "Cleaning", relevance: 0.9 },
    { skill: "Janitorial", category: "Cleaning", relevance: 0.9 },
    { skill: "Window Cleaning", category: "Cleaning", relevance: 0.8 },
    { skill: "Carpet Cleaning", category: "Cleaning", relevance: 0.8 },
    { skill: "Pressure Washing", category: "Cleaning", relevance: 0.8 },
    { skill: "Gutter Cleaning", category: "Cleaning", relevance: 0.7 },
    { skill: "Chimney Sweeping", category: "Cleaning", relevance: 0.7 },
    { skill: "Duct Cleaning", category: "Cleaning", relevance: 0.7 },
    { skill: "Laundry", category: "Cleaning", relevance: 0.8 },
    { skill: "Dry Cleaning", category: "Cleaning", relevance: 0.8 },
    { skill: "Pest Control", category: "Cleaning", relevance: 0.8 },
    { skill: "Extermination", category: "Cleaning", relevance: 0.8 },
    
    // Healthcare & Caregiving
    { skill: "Caregiving", category: "Healthcare", relevance: 0.9 },
    { skill: "Elderly Care", category: "Healthcare", relevance: 0.9 },
    { skill: "Childcare", category: "Healthcare", relevance: 0.9 },
    { skill: "Pet Care", category: "Healthcare", relevance: 0.8 },
    { skill: "Pet Grooming", category: "Healthcare", relevance: 0.8 },
    { skill: "Dog Walking", category: "Healthcare", relevance: 0.7 },
    { skill: "Pet Sitting", category: "Healthcare", relevance: 0.8 },
    { skill: "Babysitting", category: "Healthcare", relevance: 0.8 },
    { skill: "Nursing Assistance", category: "Healthcare", relevance: 0.85 },
    { skill: "Medical Assistance", category: "Healthcare", relevance: 0.85 },
    { skill: "First Aid", category: "Healthcare", relevance: 0.8 },
    { skill: "CPR", category: "Healthcare", relevance: 0.8 },
    { skill: "Patient Care", category: "Healthcare", relevance: 0.85 },
    { skill: "Medication Management", category: "Healthcare", relevance: 0.8 },
    
    // Construction & Labor
    { skill: "Construction", category: "Construction", relevance: 0.9 },
    { skill: "Manual Labor", category: "Construction", relevance: 0.9 },
    { skill: "Concrete Work", category: "Construction", relevance: 0.8 },
    { skill: "Steel Work", category: "Construction", relevance: 0.8 },
    { skill: "Scaffolding", category: "Construction", relevance: 0.8 },
    { skill: "Demolition", category: "Construction", relevance: 0.8 },
    { skill: "Debris Removal", category: "Construction", relevance: 0.7 },
    { skill: "Heavy Lifting", category: "Construction", relevance: 0.8 },
    { skill: "Safety Protocols", category: "Construction", relevance: 0.9 },
    { skill: "Tool Operation", category: "Construction", relevance: 0.8 },
    { skill: "Equipment Operation", category: "Construction", relevance: 0.8 },
    
    // Retail & Customer Service
    { skill: "Retail Sales", category: "Retail", relevance: 0.9 },
    { skill: "Customer Service", category: "Retail", relevance: 0.9 },
    { skill: "Cash Handling", category: "Retail", relevance: 0.8 },
    { skill: "Point of Sale", category: "Retail", relevance: 0.8 },
    { skill: "Inventory Management", category: "Retail", relevance: 0.8 },
    { skill: "Stock Management", category: "Retail", relevance: 0.8 },
    { skill: "Merchandising", category: "Retail", relevance: 0.7 },
    { skill: "Product Knowledge", category: "Retail", relevance: 0.7 },
    { skill: "Upselling", category: "Retail", relevance: 0.7 },
    { skill: "Returns Processing", category: "Retail", relevance: 0.7 },
    
    // Security & Safety
    { skill: "Security", category: "Security", relevance: 0.9 },
    { skill: "Surveillance", category: "Security", relevance: 0.8 },
    { skill: "Access Control", category: "Security", relevance: 0.8 },
    { skill: "Patrol", category: "Security", relevance: 0.8 },
    { skill: "Emergency Response", category: "Security", relevance: 0.8 },
    { skill: "First Aid", category: "Security", relevance: 0.7 },
    { skill: "Conflict Resolution", category: "Security", relevance: 0.8 },
    { skill: "Report Writing", category: "Security", relevance: 0.7 },
    
    // Administrative & Office
    { skill: "Reception", category: "Administrative", relevance: 0.9 },
    { skill: "Phone Handling", category: "Administrative", relevance: 0.8 },
    { skill: "Data Entry", category: "Administrative", relevance: 0.8 },
    { skill: "Filing", category: "Administrative", relevance: 0.7 },
    { skill: "Scheduling", category: "Administrative", relevance: 0.8 },
    { skill: "Appointment Setting", category: "Administrative", relevance: 0.8 },
    { skill: "Mail Handling", category: "Administrative", relevance: 0.7 },
    { skill: "Office Cleaning", category: "Administrative", relevance: 0.7 },
    
    // Other Skills
    { skill: "Video Editing", category: "Media", relevance: 0.8 },
    { skill: "Photography", category: "Media", relevance: 0.75 },
    { skill: "Translation", category: "Services", relevance: 0.8 },
    { skill: "Transcription", category: "Services", relevance: 0.7 },
    { skill: "Virtual Assistant", category: "Services", relevance: 0.7 },
    { skill: "Tutoring", category: "Education", relevance: 0.8 },
    { skill: "Teaching", category: "Education", relevance: 0.8 },
    { skill: "Time Management", category: "Soft Skills", relevance: 0.8 },
    { skill: "Physical Fitness", category: "Soft Skills", relevance: 0.7 },
    { skill: "Reliability", category: "Soft Skills", relevance: 0.9 },
    { skill: "Punctuality", category: "Soft Skills", relevance: 0.9 },
    { skill: "Attention to Detail", category: "Soft Skills", relevance: 0.8 },
    { skill: "Problem Solving", category: "Soft Skills", relevance: 0.8 },
    { skill: "Teamwork", category: "Soft Skills", relevance: 0.8 },
    { skill: "Work Ethic", category: "Soft Skills", relevance: 0.9 }
  ];

  // Simulate AI-powered job title suggestions
  static async getJobTitleSuggestions(query: string = ""): Promise<JobTitleSuggestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query.trim()) {
      return this.jobTitles.slice(0, 20); // Return first 20 for initial load
    }
    
    const filtered = this.jobTitles.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.category.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.slice(0, 15); // Return top 15 matches
  }

  // Simulate AI-powered skill suggestions
  static async getSkillSuggestions(query: string = "", jobTitle: string = ""): Promise<SkillSuggestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filtered = this.skills;
    
    // If we have a job title, prioritize relevant skills
    if (jobTitle) {
      const titleLower = jobTitle.toLowerCase();
      filtered = this.skills.map(skill => {
        let relevance = skill.relevance;
        
        // Boost relevance based on job title keywords
        if (titleLower.includes('developer') && skill.category === 'Programming') {
          relevance += 0.2;
        }
        if (titleLower.includes('designer') && skill.category === 'Design') {
          relevance += 0.2;
        }
        if (titleLower.includes('writer') && skill.category === 'Writing') {
          relevance += 0.2;
        }
        if (titleLower.includes('marketing') && skill.category === 'Marketing') {
          relevance += 0.2;
        }
        if (titleLower.includes('manager') && skill.category === 'Business') {
          relevance += 0.2;
        }
        
        return { ...skill, relevance: Math.min(relevance, 1.0) };
      }).sort((a, b) => b.relevance - a.relevance);
    }
    
    // Filter by query if provided
    if (query.trim()) {
      filtered = filtered.filter(skill => 
        skill.skill.toLowerCase().includes(query.toLowerCase()) ||
        skill.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return filtered.slice(0, 12); // Return top 12 matches
  }

  // Get popular job titles by category
  static async getPopularJobTitles(category?: string): Promise<JobTitleSuggestion[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (category) {
      return this.jobTitles
        .filter(job => job.category === category)
        .slice(0, 10);
    }
    
    // Return most popular across all categories
    const categories = [...new Set(this.jobTitles.map(job => job.category))];
    const popular: JobTitleSuggestion[] = [];
    
    categories.forEach(cat => {
      const categoryJobs = this.jobTitles.filter(job => job.category === cat);
      popular.push(...categoryJobs.slice(0, 3));
    });
    
    return popular.slice(0, 15);
  }
}
