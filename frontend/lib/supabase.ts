// CampusLink Supabase Client & Demo Auth State

export interface UserProfile {
  id: string;
  name: string;
  college_email: string;
  year: number;
  is_mentor: boolean;
  skills: string[];
  interests: string;
  slots: string[];
}

export const DEMO_FRESHER: UserProfile = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Aarav Sharma",
  college_email: "aarav.cs27@college.edu",
  year: 1,
  is_mentor: false,
  skills: ["python", "c", "html", "css"],
  interests: "learning web dev, open source, hackathons",
  slots: ["wkday_aft", "wkend_aft"],
};

export const DEMO_MENTOR: UserProfile = {
  id: "00000000-0000-0000-0000-000000000002",
  name: "Ananya Roy",
  college_email: "ananya.cs24@college.edu",
  year: 3,
  is_mentor: true,
  skills: ["python", "machine learning", "scikit-learn", "pandas", "deep learning"],
  interests: "kaggle, nlp, research papers, mentorship",
  slots: ["wkday_eve", "wkend_morn"],
};

const STORAGE_KEY = "campuslink_current_user";
const USERS_STORAGE_KEY = "campuslink_registered_users";

export function getRegisteredUsers(): UserProfile[] {
  if (typeof window === "undefined") return [DEMO_FRESHER, DEMO_MENTOR];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [DEMO_FRESHER, DEMO_MENTOR];
}

export function saveRegisteredUser(user: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    const users = getRegisteredUsers();
    const filtered = users.filter(
      (u) => u.college_email.toLowerCase() !== user.college_email.toLowerCase()
    );
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([user, ...filtered]));
  } catch (e) {}
}

export function findRegisteredUser(email: string): UserProfile | null {
  const users = getRegisteredUsers();
  return (
    users.find(
      (u) => u.college_email.toLowerCase() === email.trim().toLowerCase()
    ) || null
  );
}

export function getCurrentUser(): UserProfile {
  if (typeof window === "undefined") return DEMO_FRESHER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return DEMO_FRESHER;
}

export function setCurrentUser(user: UserProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    saveRegisteredUser(user);
  }
}

export function clearCurrentUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getAuthToken(): string {
  // In demo mode or production, generate a mock or live Bearer token
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.demo_signature";
}

