export const calculateCompatibility = (companion) => {
  if (!companion) {
    return {
      score: 0,
      breakdown: {
        vibeMatch: 0,
        interestMatch: 0,
        availabilityMatch: 0,
        overallScore: 0
      }
    };
  }

  let vibeScore = 0;
  let interestScore = 0;
  let availabilityScore = 0;

  // Vibe & Lifestyle (0-40 points)
  if (companion.rating) {
    vibeScore = (companion.rating / 5) * 40;
  }

  // Interests match (0-40 points)
  if (companion.interests && companion.interests.length > 0) {
    interestScore = Math.min(companion.interests.length * 8, 40);
  }

  // Availability (0-20 points)
  if (companion.availabilityStatus === "Available Now") {
    availabilityScore = 20;
  }

  const overallScore = Math.min(Math.round((vibeScore + interestScore + availabilityScore) / 3), 100);

  return {
    score: overallScore,
    breakdown: {
      vibeMatch: Math.round(vibeScore),
      interestMatch: Math.round(interestScore),
      availabilityMatch: Math.round(availabilityScore),
      overallScore: overallScore
    }
  };
};

export const getCompatibilityColor = (score) => {
  if (score >= 80) return "#28a745";
  if (score >= 60) return "#ffc107";
  if (score >= 40) return "#fd7e14";
  return "#dc3545";
};

export const getCompatibilityLabel = (score) => {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Fair Match";
  return "Low Match";
};
