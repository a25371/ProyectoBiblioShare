import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { getListBooks, removeBookFromList, getListDetails } from '../utils/API';
import { ThemeContext } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const ListDetails = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const { listId } = route.params;
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [listName, setListName] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getListBooks(listId);
        setBooks(data);
      } catch (error) {
        setMessage('Error fetching books');
        console.error('Error fetching books:', error);
      }
    };

    const fetchListDetails = async () => {
      try {
        const data = await getListDetails(listId);
        setListName(data.name);
      } catch (error) {
        setMessage('Error fetching list details');
        console.error('Error fetching list details:', error);
      }
    };

    fetchBooks();
    fetchListDetails();
  }, [listId]);

  const handleRemoveBook = async (bookId) => {
    Alert.alert(
      'Remove Book',
      'Are you sure you want to remove this book from the list?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await removeBookFromList(listId, bookId);
              setBooks(books.filter(book => book.bookID !== bookId));
              Alert.alert('Book removed successfully');
            } catch (error) {
              Alert.alert('Error removing book');
              console.error('Error removing book:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      {message ? <LexendText style={[styles.message, theme === 'dark' && styles.darkText]}>{message}</LexendText> : null}
      <LexendBoldText style={[styles.headerText, theme === 'dark' && styles.darkText]}>{listName}</LexendBoldText>
      {books.length === 0 && (
        <View style={styles.emptyContainer}>
          <LexendText style={[styles.emptyText, theme === 'dark' && styles.darkText]}>This book list has no books :(</LexendText>
          <LexendText style={[styles.emptyText, theme === 'dark' && styles.darkText]}>You can make this list happier by adding books to it!</LexendText>
        </View>
      )}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={books}
        keyExtractor={(item) => item.bookID ? item.bookID.toString() : Math.random().toString()} // Handle undefined bookID
        renderItem={({ item }) => (
          <View style={[styles.bookContainer, theme === 'dark' && styles.darkBookContainer]}>
            <View style={styles.bookInfo}>
              <LexendBoldText style={[styles.bookName, theme === 'dark' && styles.darkText]}>{item.Title}</LexendBoldText>
              <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>- {item.Author}</LexendText>
              <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>- {item.PageNumber} pages</LexendText>
            </View>
            <TouchableOpacity onPress={() => handleRemoveBook(item.bookID)} style={styles.deleteButton}>
              <FontAwesome name="times" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false} // Hide the scroll bar
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  darkBookContainer: {
    borderColor: '#555',
    backgroundColor: '#555',
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 18,
  },
  bookDetails: {
    fontSize: 16,
    color: 'gray',
  },
  deleteButton: {
    padding: 8,
  },
  message: {
    fontSize: 16,
    color: 'gray',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
});

export default ListDetails;