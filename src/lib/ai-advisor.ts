import { AnalysisResult } from './analyzer';

export interface AIAdvice {
  insight: string;
  actionable: string;
  type: 'critical' | 'warning' | 'positive' | 'info';
}

export const generateAIAdvice = (password: string, analysis: AnalysisResult): AIAdvice[] => {
  const advice: AIAdvice[] = [];

  if (!password) {
    return [{
      insight: "Ready to analyze your password.",
      actionable: "Start typing to receive real-time security insights.",
      type: 'info'
    }];
  }

  // Length heuristics
  if (password.length < 8) {
    advice.push({
      insight: "Your password is exceptionally short.",
      actionable: "Increase length to at least 12 characters. Length is the biggest factor in entropy.",
      type: 'critical'
    });
  } else if (password.length >= 16) {
    advice.push({
      insight: "Excellent length.",
      actionable: "Long passwords (passphrases) resist brute-force attacks exceptionally well.",
      type: 'positive'
    });
  }

  // Character diversity heuristics
  const missingTypes = [];
  if (!analysis.details.hasUppercase) missingTypes.push('uppercase letters');
  if (!analysis.details.hasLowercase) missingTypes.push('lowercase letters');
  if (!analysis.details.hasNumbers) missingTypes.push('numbers');
  if (!analysis.details.hasSymbols) missingTypes.push('symbols');

  if (missingTypes.length > 0 && password.length < 20) {
    advice.push({
      insight: `Low character diversity. Missing: ${missingTypes.join(', ')}.`,
      actionable: "Mix in different character types to exponentially increase the cracking difficulty.",
      type: 'warning'
    });
  }

  // zxcvbn feedback integration
  if (analysis.feedback.warning) {
    advice.push({
      insight: `Pattern detected: ${analysis.feedback.warning}`,
      actionable: analysis.feedback.suggestions[0] || "Avoid common patterns and dictionary words.",
      type: 'critical'
    });
  }

  // Entropy check
  if (analysis.entropy > 80) {
    advice.push({
      insight: "High cryptographic entropy achieved.",
      actionable: "This password has enough randomness to be secure against offline attacks.",
      type: 'positive'
    });
  } else if (analysis.entropy < 40 && password.length >= 8) {
    advice.push({
      insight: "Low entropy despite length.",
      actionable: "Avoid repetitive characters or predictable sequences (like '1234' or 'qwerty').",
      type: 'warning'
    });
  }

  // Overall recommendation
  if (analysis.classification === 'Elite') {
    advice.push({
      insight: "Military-grade security.",
      actionable: "Ensure you use a password manager to store this securely, and enable 2FA on your accounts.",
      type: 'info'
    });
  }

  return advice;
};
