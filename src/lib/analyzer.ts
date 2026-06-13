import zxcvbn from 'zxcvbn';

export type StrengthClassification = 'Critical' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Elite';

export interface AnalysisResult {
  score: number; // 0-100
  zxcvbnScore: number; // 0-4
  classification: StrengthClassification;
  entropy: number;
  crackTimeDisplay: string;
  crackTimeSeconds: number;
  feedback: {
    warning: string;
    suggestions: string[];
  };
  details: {
    length: number;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
    charPoolSize: number;
  };
}

export const calculateEntropy = (password: string, poolSize: number): number => {
  if (password.length === 0 || poolSize === 0) return 0;
  return Math.max(0, password.length * Math.log2(poolSize));
};

export const getCharPoolSize = (password: string): number => {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32; // basic symbols
  if (/[^\x00-\x7F]/.test(password)) pool += 1000; // rough unicode estimate
  return pool;
};

export const analyzePassword = (password: string): AnalysisResult => {
  if (!password) {
    return {
      score: 0,
      zxcvbnScore: 0,
      classification: 'Critical',
      entropy: 0,
      crackTimeDisplay: 'Instant',
      crackTimeSeconds: 0,
      feedback: { warning: '', suggestions: [] },
      details: {
        length: 0,
        hasUppercase: false,
        hasLowercase: false,
        hasNumbers: false,
        hasSymbols: false,
        charPoolSize: 0,
      },
    };
  }

  const zResult = zxcvbn(password);
  
  const poolSize = getCharPoolSize(password);
  const entropy = calculateEntropy(password, poolSize);
  
  // Custom score blending zxcvbn (which is 0-4) and entropy
  // A good password should have entropy > 60 and zxcvbn score 4
  let score = (zResult.score / 4) * 50; // max 50 points from zxcvbn
  let entropyScore = Math.min(50, (entropy / 80) * 50); // max 50 points from entropy
  let totalScore = Math.min(100, Math.round(score + entropyScore));

  let classification: StrengthClassification = 'Critical';
  if (totalScore >= 90) classification = 'Elite';
  else if (totalScore >= 75) classification = 'Strong';
  else if (totalScore >= 50) classification = 'Good';
  else if (totalScore >= 25) classification = 'Fair';
  else if (totalScore > 0) classification = 'Weak';

  return {
    score: totalScore,
    zxcvbnScore: zResult.score,
    classification,
    entropy: Math.round(entropy * 10) / 10,
    crackTimeDisplay: zResult.crack_times_display.offline_slow_hashing_1e4_per_second,
    crackTimeSeconds: zResult.crack_times_seconds.offline_slow_hashing_1e4_per_second,
    feedback: {
      warning: zResult.feedback.warning,
      suggestions: zResult.feedback.suggestions,
    },
    details: {
      length: password.length,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSymbols: /[^a-zA-Z0-9]/.test(password),
      charPoolSize: poolSize,
    },
  };
};
