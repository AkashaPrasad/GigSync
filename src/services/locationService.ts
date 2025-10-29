// Location Service for Google Maps integration
// Note: In production, you would need to add your Google Maps API key

export interface LocationSuggestion {
  place_id: string;
  description: string;
  formatted_address: string;
  types: string[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export class LocationService {
  private static apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with actual API key
  private static baseUrl = "https://maps.googleapis.com/maps/api/place";

  // Mock location suggestions for development
  private static mockLocations: LocationSuggestion[] = [
    {
      place_id: "1",
      description: "New York, NY, USA",
      formatted_address: "New York, NY, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 40.7128, lng: -74.0060 } }
    },
    {
      place_id: "2", 
      description: "Los Angeles, CA, USA",
      formatted_address: "Los Angeles, CA, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 34.0522, lng: -118.2437 } }
    },
    {
      place_id: "3",
      description: "Chicago, IL, USA", 
      formatted_address: "Chicago, IL, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 41.8781, lng: -87.6298 } }
    },
    {
      place_id: "4",
      description: "Houston, TX, USA",
      formatted_address: "Houston, TX, USA", 
      types: ["locality", "political"],
      geometry: { location: { lat: 29.7604, lng: -95.3698 } }
    },
    {
      place_id: "5",
      description: "Phoenix, AZ, USA",
      formatted_address: "Phoenix, AZ, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 33.4484, lng: -112.0740 } }
    },
    {
      place_id: "6",
      description: "Philadelphia, PA, USA",
      formatted_address: "Philadelphia, PA, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 39.9526, lng: -75.1652 } }
    },
    {
      place_id: "7",
      description: "San Antonio, TX, USA",
      formatted_address: "San Antonio, TX, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 29.4241, lng: -98.4936 } }
    },
    {
      place_id: "8",
      description: "San Diego, CA, USA",
      formatted_address: "San Diego, CA, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 32.7157, lng: -117.1611 } }
    },
    {
      place_id: "9",
      description: "Dallas, TX, USA",
      formatted_address: "Dallas, TX, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 32.7767, lng: -96.7970 } }
    },
    {
      place_id: "10",
      description: "San Jose, CA, USA",
      formatted_address: "San Jose, CA, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 37.3382, lng: -121.8863 } }
    },
    {
      place_id: "11",
      description: "Austin, TX, USA",
      formatted_address: "Austin, TX, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 30.2672, lng: -97.7431 } }
    },
    {
      place_id: "12",
      description: "Jacksonville, FL, USA",
      formatted_address: "Jacksonville, FL, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 30.3322, lng: -81.6557 } }
    },
    {
      place_id: "13",
      description: "Fort Worth, TX, USA",
      formatted_address: "Fort Worth, TX, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 32.7555, lng: -97.3308 } }
    },
    {
      place_id: "14",
      description: "Columbus, OH, USA",
      formatted_address: "Columbus, OH, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 39.9612, lng: -82.9988 } }
    },
    {
      place_id: "15",
      description: "Charlotte, NC, USA",
      formatted_address: "Charlotte, NC, USA",
      types: ["locality", "political"],
      geometry: { location: { lat: 35.2271, lng: -80.8431 } }
    },
    {
      place_id: "16",
      description: "Remote",
      formatted_address: "Remote Work",
      types: ["establishment"],
      geometry: { location: { lat: 0, lng: 0 } }
    },
    {
      place_id: "17",
      description: "London, UK",
      formatted_address: "London, UK",
      types: ["locality", "political"],
      geometry: { location: { lat: 51.5074, lng: -0.1278 } }
    },
    {
      place_id: "18",
      description: "Toronto, ON, Canada",
      formatted_address: "Toronto, ON, Canada",
      types: ["locality", "political"],
      geometry: { location: { lat: 43.6532, lng: -79.3832 } }
    },
    {
      place_id: "19",
      description: "Sydney, NSW, Australia",
      formatted_address: "Sydney, NSW, Australia",
      types: ["locality", "political"],
      geometry: { location: { lat: -33.8688, lng: 151.2093 } }
    },
    {
      place_id: "20",
      description: "Berlin, Germany",
      formatted_address: "Berlin, Germany",
      types: ["locality", "political"],
      geometry: { location: { lat: 52.5200, lng: 13.4050 } }
    }
  ];

  // Get location suggestions based on input
  static async getLocationSuggestions(input: string): Promise<LocationSuggestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!input.trim()) {
      return this.mockLocations.slice(0, 10); // Return first 10 for initial load
    }

    const filtered = this.mockLocations.filter(location =>
      location.description.toLowerCase().includes(input.toLowerCase()) ||
      location.formatted_address.toLowerCase().includes(input.toLowerCase())
    );

    return filtered.slice(0, 8); // Return top 8 matches
  }

  // Get current location using browser geolocation
  static async getCurrentLocation(): Promise<LocationSuggestion | null> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // In production, you would reverse geocode using Google Maps API
          // For now, return a mock location
          const mockLocation: LocationSuggestion = {
            place_id: "current",
            description: "Current Location",
            formatted_address: "Current Location",
            types: ["establishment"],
            geometry: {
              location: {
                lat: latitude,
                lng: longitude
              }
            }
          };
          
          resolve(mockLocation);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  // Real Google Maps API integration (for production)
  static async getLocationSuggestionsFromGoogle(input: string): Promise<LocationSuggestion[]> {
    if (!this.apiKey || this.apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      console.warn("Google Maps API key not configured, using mock data");
      return this.getLocationSuggestions(input);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/autocomplete/json?input=${encodeURIComponent(input)}&key=${this.apiKey}&types=geocode`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }
      
      const data = await response.json();
      
      return data.predictions.map((prediction: any) => ({
        place_id: prediction.place_id,
        description: prediction.description,
        formatted_address: prediction.structured_formatting?.main_text || prediction.description,
        types: prediction.types || []
      }));
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      return this.getLocationSuggestions(input); // Fallback to mock data
    }
  }

  // Get place details from Google Maps API
  static async getPlaceDetails(placeId: string): Promise<LocationSuggestion | null> {
    if (!this.apiKey || this.apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      console.warn("Google Maps API key not configured, using mock data");
      return this.mockLocations.find(loc => loc.place_id === placeId) || null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/details/json?place_id=${placeId}&key=${this.apiKey}&fields=place_id,formatted_address,geometry,types`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch place details');
      }
      
      const data = await response.json();
      
      if (data.result) {
        return {
          place_id: data.result.place_id,
          description: data.result.formatted_address,
          formatted_address: data.result.formatted_address,
          types: data.result.types || [],
          geometry: data.result.geometry
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return this.mockLocations.find(loc => loc.place_id === placeId) || null;
    }
  }
}
