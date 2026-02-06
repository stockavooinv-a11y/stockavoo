/**
 * LOCATION SERVICE
 *
 * Service for fetching countries and states from external API.
 * Uses REST Countries API and a fallback for states.
 */

const COUNTRIES_API = 'https://restcountries.com/v3.1/all';

// Fallback Nigerian states (in case API fails)
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

/**
 * Fetch all countries
 * @returns {Promise<Array>} List of countries with name and code
 */
export const fetchCountries = async () => {
  try {
    const response = await fetch(COUNTRIES_API);
    if (!response.ok) throw new Error('Failed to fetch countries');

    const data = await response.json();

    // Format countries: sort by common name
    const countries = data
      .map(country => ({
        name: country.name.common,
        code: country.cca2,
        flag: country.flag,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    // Return fallback countries
    return [
      { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
      { name: 'United States', code: 'US', flag: '🇺🇸' },
      { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
      { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
      { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
    ];
  }
};

/**
 * Fetch states for a specific country
 * Currently optimized for Nigeria with fallback data
 * @param {string} countryCode - ISO country code (e.g., 'NG')
 * @returns {Promise<Array>} List of states
 */
export const fetchStates = async (countryCode) => {
  // For Nigeria, return our predefined list
  if (countryCode === 'NG' || countryCode === 'Nigeria') {
    return NIGERIAN_STATES.map(state => ({ name: state, code: state }));
  }

  // For other countries, we'll use a third-party API or return empty
  // You can integrate with apis like countrystatecity.in if needed
  try {
    // Placeholder for future API integration
    // const response = await fetch(`https://api.example.com/states/${countryCode}`);
    // const data = await response.json();
    // return data.states;

    return []; // Return empty for non-Nigerian countries for now
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

/**
 * Get Nigerian states (synchronous helper)
 * @returns {Array<string>} List of Nigerian states
 */
export const getNigerianStates = () => NIGERIAN_STATES;
