import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const createCommit = (payload) =>
  axios.post(`${BASE_URL}/commit`, payload);

export const getTodayCommits = (userId) =>
  axios.get(`${BASE_URL}/commit/today/${userId}`);

export const markCommitComplete = (id) =>
  axios.patch(`${BASE_URL}/commit/${id}/complete`);

export const deleteCommit = (id) =>
  axios.delete(`${BASE_URL}/commit/${id}`);

export const updateCommit = (id, payload) =>
  axios.patch(`${BASE_URL}/commit/${id}`, payload);

export const updateRegret = (id, regret) =>
  axios.patch(`${BASE_URL}/commit/regret/${id}`, { regret });
