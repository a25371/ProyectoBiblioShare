import axios from "axios";

const API_URL = "http://192.168.1.17:5000/"; // Change this on defense day!!!

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error in response interceptor:', error);
    return Promise.reject(error);
  }
);

// ------------------------------------------------------
//  users
// ------------------------------------------------------

export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error login: ", error.message);
    }
  }
};

export const sendUserData = async (username, password, pronouns) => {
  try {
    console.log("Sending request to create user:", { username, password, pronouns });
    const response = await api.post("/users", { username, password, pronouns });
    console.log("Response from create user:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await api.get('/search_users', { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// ------------------------------------------------------
//  profile
// ------------------------------------------------------

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/user_profile`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (currentUsername, { username, pronouns, password }) => {
  try {
    const response = await api.put('/profile', { currentUsername, username, pronouns, password });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// ------------------------------------------------------
//  books
// ------------------------------------------------------

export const searchBooks = async (query, searchBy) => {
  try {
    // console.log(`API request with query: ${query}, searchBy: ${searchBy}`);
    const response = await api.get('/books', { params: { query, searchBy } });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  }
};

export const getBookDetails = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  }catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  }
};

export const getBooksByReadingStatus = async (userId, status) => {
  try {
    const response = await api.get('/books_by_reading_status', { params: { userId, status } });
    return response.data;
  } catch (error) {
    console.error('Error fetching books by reading status:', error);
    throw error;
  }
};

// ------------------------------------------------------
//  Social features
// ------------------------------------------------------

export const getWatchedUsers = async (userId) => {
  try {
    const response = await api.get('/watched_users', { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching watched users:', error);
    throw error;
  }
};

export const getUserWatchStatus = async (currentUserId, userId) => {
  try {
    const response = await api.get('/user_watch_status', { params: { currentUserId, userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching user watch status:', error);
    throw error;
  }
};

export const updateUserWatchStatus = async (currentUserId, userId, isWatched) => {
  try {
    const response = await api.post('/update_watch_status', { currentUserId, userId, isWatched });
    return response.data;
  } catch (error) {
    console.error('Error updating user watch status:', error);
    throw error;
  }
};

// ------------------------------------------------------
//  custom_lists
// ------------------------------------------------------

export const getUserCustomLists = async (userId) => {
  try {
    const response = await api.get('/custom_lists', { params: { userId } });
    // console.log('API response for custom lists:', response.data); // Add logging to verify data structure
    return response.data;
  } catch (error) {
    console.error('Error fetching custom lists:', error);
    throw error;
  }
};

export const createCustomList = async (userId, name) => {
  try {
    const response = await api.post('/custom_lists', { userId, name });
    return response.data;
  } catch (error) {
    console.error('Error creating custom list:', error);
    throw error;
  }
};

export const deleteCustomList = async (listId) => {
  try {
    const response = await api.delete('/delete_custom_list', { data: { listId } });
    return response.data;
  } catch (error) {
    console.error('Error deleting custom list:', error);
    throw error;
  }
};

export const getListDetails = async (listId) => {
  try {
    const response = await api.get('/list_details', { params: { listId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching list details:', error);
    throw error;
  }
};

// ------------------------------------------------------
//  list_books
// ------------------------------------------------------

export const getListBooks = async (listId) => {
  try {
    const response = await api.get('/list_books', { params: { listId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching list books:', error);
    throw error;
  }
};

export const addBookToList = async (listId, bookId) => {
  try {
    const response = await api.post('/list_books', { list_id: listId, book_id: bookId });
    return response.data;
  } catch (error) {
    console.error('Error adding book to list:', error);
    throw error;
  }
};

export const removeBookFromList = async (listId, bookId) => {
  try {
    console.log(`API request with listId: ${listId}, bookId: ${bookId}`);
    const response = await api.delete('/list_books', { data: { list_id: listId, book_id: bookId } });
    return response.data;
  } catch (error) {
    console.error('Error removing book from list:', error);
    throw error;
  }
};

// ------------------------------------------------------
//  Reviews
// ------------------------------------------------------

export const saveReview = async (userId, bookId, rating, review) => {
  try {
    const response = await api.post('/save_review', { userId, bookId, rating, review });
    return response.data;
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
};

export const getUserReview = async (userId, bookId) => {
  try {
    const response = await api.get('/user_review', { params: { userId, bookId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching user review:', error);
    throw error;
  }
};

export const getUserReviewsAndBooks = async (userId) => {
  try {
    const response = await api.get('/user_reviewsAndBooks', { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

// ------------------------------------------------------
//  Reading status
// ------------------------------------------------------

export const getUserReadingStatus = async (userId, bookId) => {
  try {
    const response = await api.get('/user_reading_status', { params: { userId, bookId } });
    console.log("Requesting reading status for:", { userId, bookId });
    return response.data;
  } catch (error) {
    console.error('Error fetching user reading status:', error);
    throw error;
  }
};

export const updateUserReadingStatus = async (userId, bookId, status) => {
  try {
    const response = await api.post('/update_reading_status', { userId, bookId, status });
    return response.data;
  } catch (error) {
    console.error('Error updating user reading status:', error);
    throw error;
  }
};