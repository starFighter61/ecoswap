/**
 * Calculate CO2 savings based on item category and condition
 * @param {String} category - Item category
 * @param {String} condition - Item condition
 * @returns {Number} CO2 saved in kg
 */
const calculateCO2Savings = (category, condition) => {
  // CO2 factors by category (in kg)
  const co2Factors = {
    'clothing': 10,
    'electronics': 50,
    'furniture': 100,
    'books': 5,
    'toys': 8,
    'sports': 15,
    'kitchen': 20,
    'garden': 25,
    'automotive': 200,
    'other': 10
  };
  
  // Condition factors (multipliers)
  const conditionFactors = {
    'new': 1.0,
    'like-new': 0.9,
    'good': 0.7,
    'fair': 0.5,
    'poor': 0.3
  };
  
  // Calculate CO2 saved
  return co2Factors[category] * conditionFactors[condition];
};

/**
 * Calculate waste reduction based on CO2 savings
 * @param {Number} co2Saved - CO2 saved in kg
 * @returns {Number} Waste reduced in kg
 */
const calculateWasteReduction = (co2Saved) => {
  // Simple formula: waste is approximately 20% of CO2 impact
  return co2Saved * 0.2;
};

/**
 * Calculate total environmental impact for a swap
 * @param {Object} initiatorItem - Initiator's item
 * @param {Object} receiverItem - Receiver's item
 * @returns {Object} Environmental impact object
 */
const calculateSwapImpact = (initiatorItem, receiverItem) => {
  const totalCO2Saved = 
    initiatorItem.environmentalImpact.co2Saved + 
    receiverItem.environmentalImpact.co2Saved;
  
  const totalWasteReduced = 
    initiatorItem.environmentalImpact.wasteReduced + 
    receiverItem.environmentalImpact.wasteReduced;
  
  return {
    co2Saved: totalCO2Saved,
    wasteReduced: totalWasteReduced
  };
};

/**
 * Generate a human-readable environmental impact statement
 * @param {Object} impact - Environmental impact object
 * @returns {String} Human-readable impact statement
 */
const generateImpactStatement = (impact) => {
  const co2Saved = Math.round(impact.co2Saved * 10) / 10; // Round to 1 decimal place
  const wasteReduced = Math.round(impact.wasteReduced * 10) / 10;
  
  // Equivalent metrics for better understanding
  const treeDays = Math.round(co2Saved / 0.5); // A tree absorbs ~0.5kg CO2 per day
  const carKm = Math.round(co2Saved * 4); // ~250g CO2 per km in average car
  
  return {
    summary: `This swap saved ${co2Saved}kg of CO2 and reduced waste by ${wasteReduced}kg.`,
    equivalents: [
      `Equivalent to a tree absorbing CO2 for ${treeDays} days.`,
      `Equivalent to reducing car travel by ${carKm} kilometers.`
    ]
  };
};

module.exports = {
  calculateCO2Savings,
  calculateWasteReduction,
  calculateSwapImpact,
  generateImpactStatement
};