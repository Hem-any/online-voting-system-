import api from "./axiosConfig";

// ==========================
// Public APIs
// ==========================

// Get all elections
export async function getElections() {
  const response = await api.get("/elections");
  return response.data;
}

// Get election results
export async function getResults() {
  const response = await api.get("/elections/results");
  return response.data;
}

// Cast a vote
export async function castVote(electionId, candidateId) {
  const response = await api.post("/vote", {
    electionId,
    candidateId,
  });
  return response.data;
}

// ==========================
// Admin APIs - Elections
// ==========================

// Create a new election
export async function createElection(data) {
  const response = await api.post("/admin/elections", data);
  return response.data;
}

// Activate or end an election
export async function toggleElection(id) {
  const response = await api.patch(`/admin/elections/${id}/toggle`);
  return response.data;
}

// Get dashboard statistics
export async function getAdminStats() {
  const response = await api.get("/admin/stats");
  return response.data;
}

// ==========================
// Admin APIs - Candidates
// ==========================

// Get candidates for an election
export async function getCandidatesByElection(electionId) {
  const response = await api.get(`/admin/candidates/election/${electionId}`);
  return response.data;
}

// Create a new candidate
export async function createCandidate(candidateData) {
  const response = await api.post("/admin/candidates", candidateData);
  return response.data;
}

// ==========================
// Admin APIs - Users
// ==========================

// Get all users
export async function getAllUsers() {
  const response = await api.get("/admin/users");
  return response.data;
}

// Create a new user
export async function createUser(userData) {
  const response = await api.post("/admin/users", userData);
  return response.data;
}

// Delete a user
export async function deleteUser(id) {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
}

// Delete an election
export async function deleteElection(id) {
  const response = await api.delete(`/admin/elections/${id}`);
  return response.data;
}