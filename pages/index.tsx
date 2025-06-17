import React, { useState } from 'react';
import { Heart, MapPin, User, Calendar, Sparkles, Clock, ChevronRight, MessageCircle } from 'lucide-react';

interface UserData {
  age: string;
  location: string;
  interests: string[];
  personalDescription: string;
}

interface DateIdea {
  title: string;
  description: string;
  category: string;
  time: string;
  cost: string;
}

const INTERESTS = [
  'Food & Dining', 'Outdoor Activities', 'Arts & Culture', 'Entertainment',
  'Sports', 'Nightlife', 'Shopping', 'Adventure', 'Museums', 'Music',
  'Photography', 'Nature', 'Coffee', 'Wine & Cocktails', 'Dancing',
  'Movies', 'Live Shows', 'Markets', 'Architecture', 'History'
];

function Home() {
  const [userData, setUserData] = useState<UserData>({
    age: '',
    location: '',
    interests: [],
    personalDescription: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dateIdeas, setDateIdeas] = useState<DateIdea[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState<{age?: string; location?: string}>({});

  const handleInterestToggle = (interest: string) => {
    setUserData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateForm = () => {
    const newErrors: {age?: string; location?: string} = {};
    
    if (!userData.age || parseInt(userData.age) < 18 || parseInt(userData.age) > 100) {
      newErrors.age = 'Please enter a valid age between 18-100';
    }
    
    if (!userData.location.trim()) {
      newErrors.location = 'Please enter your location';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateDateIdeas = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call your backend API
      // which would then call OpenAI API with your secure API key
      const response = await fetch('/api/generate-date-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: userData.age,
          location: userData.location,
          interests: userData.interests,
          personalDescription: userData.personalDescription
        })
      });
      
      if (response.ok) {
        const ideas = await response.json();
        setDateIdeas(ideas);
        setShowResults(true);
      } else {
        // For demo purposes, show mock data
        generateMockDateIdeas();
      }
    } catch (error) {
      // For demo purposes, show mock data when API isn't available
      generateMockDateIdeas();
    }
    
    setIsLoading(false);
  };

  const generateMockDateIdeas = () => {
    // Mock data for demonstration
    setTimeout(() => {
      const mockIdeas: DateIdea[] = [
        {
          title: "Sunset Picnic at Central Park",
          description: "Pack some artisanal sandwiches and watch the sunset together in this beautiful green space.",
          category: "Outdoor",
          time: "This Weekend",
          cost: "$20-40"
        },
        {
          title: "Wine Tasting at Local Vineyard",
          description: "Discover new flavors together at this charming vineyard just outside the city.",
          category: "Food & Drink",
          time: "Saturday 2-5 PM",
          cost: "$60-80"
        },
        {
          title: "Art Gallery Opening",
          description: "Explore contemporary art at the new exhibition opening this week.",
          category: "Culture",
          time: "Friday 6-9 PM",
          cost: "Free"
        },
        {
          title: "Cooking Class for Couples",
          description: "Learn to make authentic Italian pasta together in this hands-on class.",
          category: "Food & Learning",
          time: "Sunday 3-6 PM",
          cost: "$120-150"
        }
      ];
      setDateIdeas(mockIdeas);
      setShowResults(true);
      setIsLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setShowResults(false);
    setDateIdeas([]);
    setUserData({ age: '', location: '', interests: [], personalDescription: '' });
    setErrors({});
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Your Personalized Date Ideas
              </h1>
              <p className="text-gray-600 mb-4">
                Based on your preferences for {userData.location}
              </p>
              <button
                onClick={resetForm}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Create New Search
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {dateIdeas.map((idea, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {idea.title}
                      </h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {idea.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {idea.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {idea.time}
                    </div>
                    <div className="font-medium text-green-600">
                      {idea.cost}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Find Perfect Date Ideas
            </h1>
            <p className="text-xl text-gray-600">
              Get personalized date suggestions based on your location and interests
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Age and Location */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={userData.age}
                  onChange={(e) => setUserData(prev => ({ ...prev, age: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.age ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your age"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={userData.location}
                  onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your city"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Personal Description */}
            <div className="mb-8">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MessageCircle className="w-4 h-4 mr-2" />
                Tell us about yourself (Optional)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Share anything about your personality, preferences, or what makes you unique to get more tailored suggestions
              </p>
              <textarea
                value={userData.personalDescription}
                onChange={(e) => setUserData(prev => ({ ...prev, personalDescription: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                rows={4}
                placeholder="e.g., I love trying new cuisines, I'm an introvert who enjoys quiet activities, I'm adventurous and love surprises..."
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                  This helps us create more personalized recommendations
                </p>
                <p className="text-xs text-gray-400">
                  {userData.personalDescription.length}/500
                </p>
              </div>
            </div>

            {/* Interests */}
            <div className="mb-8">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Interests (Optional)
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Select any interests to get more personalized suggestions
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      userData.interests.includes(interest)
                        ? 'bg-blue-500 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              
              {userData.interests.length > 0 && (
                <p className="text-sm text-gray-600 mt-3">
                  {userData.interests.length} interest{userData.interests.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={generateDateIdeas}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5 mr-2" />
                  Get My Date Ideas
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>

          {/* API Note */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">
                  OpenAI Integration Ready
                </h3>
                <p className="text-blue-600 text-sm">
                  This app is designed to integrate with OpenAI's API through a secure backend. 
                  For demo purposes, it shows sample data. In production, add your OpenAI API key to a backend service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
