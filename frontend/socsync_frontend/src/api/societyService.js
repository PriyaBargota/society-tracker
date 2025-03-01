import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getSocieties = async () => {
  try {
    const response = await axios.get(`${API_URL}/societies/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching societies:', error);
    throw error;
  }
};

export const getSocietyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/society/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching society with ID ${id}:`, error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/event/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};

export const getSocietyEvents = async (societyId) => {
  try {
    const response = await axios.get(`${API_URL}/society/${societyId}/events/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching events for society ${societyId}:`, error);
    throw error;
  }
};

export const getUniversities = async () => {
  try {
    const response = await axios.get(`${API_URL}/universities/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching universities:', error);
    throw error;
  }
};
