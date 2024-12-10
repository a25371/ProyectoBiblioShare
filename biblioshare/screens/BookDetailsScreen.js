import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { getBookDetails, saveReview, getUserReview, getUserCustomLists, getUserReadingStatus, updateUserReadingStatus, addBookToList, getListBooks } from '../utils/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const BookDetailsScreen = ({ route, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [message, setMessage] = useState('');
  const [readingStatus, setReadingStatus] = useState('');
  const [customLists, setCustomLists] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [listsContainingBook, setListsContainingBook] = useState([]);
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [collectionDropdownVisible, setCollectionDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const data = await getBookDetails(bookId);
        setBook(data);
      } catch (error) {
        setMessage('Error fetching book details');
        console.error('Error fetching book details:', error);
      }
    };

    const fetchUserReview = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const data = await getUserReview(userId, bookId);
        if (data) {
          setRating(data.rating || 0);
          setReview(data.review || '');
        }
      } catch (error) {
        console.error('Error fetching user review:', error);
      }
    };

    const fetchUserCustomLists = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const data = await getUserCustomLists(userId);
        setCustomLists(data);
      } catch (error) {
        console.error('Error fetching user custom lists:', error);
      }
    };

    const fetchUserReadingStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const data = await getUserReadingStatus(userId, bookId);
        setReadingStatus(data.status || '');
      } catch (error) {
        console.error('Error fetching user reading status:', error);
      }
    };

    const fetchListsContainingBook = async () => {
      try {
        const data = await getListBooks(bookId);
        setListsContainingBook(data.map(list => list.list_id));
      } catch (error) {
        console.error('Error fetching lists containing book:', error);
      }
    };

    fetchBookDetails();
    fetchUserReview();
    fetchUserCustomLists();
    fetchUserReadingStatus();
    fetchListsContainingBook();
  }, [bookId]);

  const renderRating = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <AntDesign name="book" size={24} color={i <= rating ? 'green' : 'grey'} />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handleSubmitReview = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await saveReview(userId, bookId, rating, review);
    } catch (error) {
      Alert.alert('Error submitting review');
      console.error('Error submitting review:', error);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await updateUserReadingStatus(userId, bookId, status);
      setReadingStatus(status);
      setStatusDropdownVisible(false);
    } catch (error) {
      console.error('Error updating reading status:', error);
    }
  };

  const handleAddBookToList = async (listId) => {
    try {
      await addBookToList(listId, bookId);
      setSelectedCollection(customLists.find(list => list.id === listId).name);
      setCollectionDropdownVisible(false);
    } catch (error) {
      Alert.alert('Error adding book to list');
      console.error('Error adding book to list:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={[styles.container, theme === 'dark' && styles.darkContainer]}>
        {message ? <LexendText style={[styles.message, theme === 'dark' && styles.darkText]}>{message}</LexendText> : null}
        {book && (
          <View style={styles.bookContainer}>
            <Image source={{ uri: book.Cover || 'https://via.placeholder.com/150x200' }} style={styles.coverImage} />
            <LexendBoldText style={[styles.bookTitle, theme === 'dark' && styles.darkText]}>{book.Title}</LexendBoldText>
            <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>{book.Author}</LexendText>
            <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>Published Year: {book.PublishedYear}</LexendText>
            <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>ISBN: {book.ISBN}</LexendText>
            <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>Pages: {book.PageNumber}</LexendText>
            <View style={styles.padding} />
            <TouchableOpacity onPress={() => setStatusDropdownVisible(!statusDropdownVisible)} style={[styles.dropdownButton, theme === 'dark' && styles.darkDropdownButton]}>
              <LexendText style={[styles.dropdownButtonText, theme === 'dark' && styles.darkText]}>{readingStatus || 'Select Status'}</LexendText>
            </TouchableOpacity>
            {statusDropdownVisible && (
              <View style={[styles.dropdownMenu, theme === 'dark' && styles.darkDropdownMenu]}>
                {['Select Status', 'Reading', 'Dropped', 'Waiting', 'Finished'].map((status) => (
                  <TouchableOpacity key={status} onPress={() => handleStatusChange(status)}>
                    <LexendText style={[styles.dropdownItem, theme === 'dark' && styles.darkText]}>{status}</LexendText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity onPress={() => setCollectionDropdownVisible(!collectionDropdownVisible)} style={[styles.dropdownButton, theme === 'dark' && styles.darkDropdownButton]}>
              <LexendText style={[styles.dropdownButtonText, theme === 'dark' && styles.darkText]}>{selectedCollection || 'Select Collection'}</LexendText>
            </TouchableOpacity>
            {collectionDropdownVisible && (
              <View style={[styles.dropdownMenu, theme === 'dark' && styles.darkDropdownMenu]}>
                {customLists.filter(list => !listsContainingBook.includes(list.id)).map((list) => (
                  <TouchableOpacity key={list.id} onPress={() => handleAddBookToList(list.id)}>
                    <LexendText style={[styles.dropdownItem, theme === 'dark' && styles.darkText]}>{list.name}</LexendText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.padding} />
            <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>Synopsis:</LexendText>
            <LexendText style={[styles.synopsisText, theme === 'dark' && styles.darkText]}>{book.Synopsis || 'Synopsis not available'}</LexendText>
            <View style={styles.ratingContainer}>{renderRating()}</View>
            <TextInput
              style={[styles.reviewInput, theme === 'dark' && styles.darkInput]}
              placeholder="Write a review"
              placeholderTextColor={theme === 'dark' ? '#ccc' : '#000'}
              value={review}
              onChangeText={setReview}
              multiline
            />
            <Button title="Submit Review" onPress={handleSubmitReview} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 40, // Add padding to the top of the screen
    paddingBottom: 32, // Add padding to the end of the page
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  bookContainer: {
    alignItems: 'center',
  },
  coverImage: {
    width: 150,
    height: 200,
    marginBottom: 16,
  },
  bookTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  bookDetails: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 4,
  },
  synopsisText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 16,
  },
  darkText: {
    color: '#fff',
  },
  padding: {
    height: 16,
  },
  dropdownButton: {
    height: 50,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
  },
  darkDropdownButton: {
    borderColor: '#555',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: 'gray',
  },
  dropdownMenu: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#fff',
    zIndex: 1,
    marginBottom: 16,
  },
  darkDropdownMenu: {
    borderColor: '#555',
    backgroundColor: '#555',
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  reviewInput: {
    height: 150, 
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%', 
    padding: 8,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  darkInput: {
    borderColor: '#555',
    backgroundColor: '#555',
    color: '#fff',
  },
});

export default BookDetailsScreen;