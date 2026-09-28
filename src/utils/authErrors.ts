export function getFirebaseAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is improperly formatted. Please enter a valid email.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account was found with this email address. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or use the reset password link.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please verify your email and password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Try logging in instead.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters with mixed letters and numbers.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to too many failed attempts. Please try again later or reset your password.';
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in popup was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'The Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/cancelled-popup-request':
      return 'Previous sign-in popup was cancelled.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in the Firebase Console. Please enable Email/Password or Google provider.';
    case 'auth/requires-recent-login':
      return 'This sensitive operation requires recent authentication. Please log in again before retrying.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection and try again.';
    default:
      return 'An authentication error occurred. Please try again.';
  }
}
