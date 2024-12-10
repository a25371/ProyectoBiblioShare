import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { getBooksByReadingStatus, getUserProfile } from '../utils/API';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const ReadingStatusScreen = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const { userId } = route.params;
  const [status, setStatus] = useState('Reading');
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooksByReadingStatus(userId, status);
        setBooks(data);
      } catch (error) {
        setMessage('Error fetching books');
        console.error('Error fetching books:', error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(userId);
        setUsername(data.username);
      } catch (error) {
        setMessage('Error fetching user profile');
        console.error('Error fetching user profile:', error);
      }
    };

    const checkCurrentUser = async () => {
      try {
        const currentUserId = await AsyncStorage.getItem('userId');
        setIsCurrentUser(currentUserId === userId);
      } catch (error) {
        console.error('Error checking current user:', error);
      }
    };

    fetchBooks();
    fetchUserProfile();
    checkCurrentUser();
  }, [status, userId]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleStatusChange = (itemValue) => {
    setStatus(itemValue);
    setDropdownVisible(false);
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      {message ? <LexendText style={[styles.message, theme === 'dark' && styles.darkText]}>{message}</LexendText> : null}
      <LexendBoldText style={[styles.headerText, theme === 'dark' && styles.darkText]}>
        {isCurrentUser ? 'Your status:' : `${username}'s status:`}
      </LexendBoldText>
      <TouchableOpacity onPress={toggleDropdown} style={[styles.dropdown, theme === 'dark' && styles.darkDropdown]}>
        <LexendText style={[styles.dropdownText, theme === 'dark' && styles.darkText]}>{status}</LexendText>
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={[styles.dropdownMenu, theme === 'dark' && styles.darkDropdownMenu]}>
          <TouchableOpacity onPress={() => handleStatusChange('Reading')}>
            <LexendText style={[styles.dropdownItem, theme === 'dark' && styles.darkText]}>Reading</LexendText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStatusChange('Dropped')}>
            <LexendText style={[styles.dropdownItem, theme === 'dark' && styles.darkText]}>Dropped</LexendText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStatusChange('Waiting')}>
            <LexendText style={[styles.dropdownItem, theme === 'dark' && styles.darkText]}>Waiting</LexendText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStatusChange('Finished')}>
            <LexendText style={[styles.dropdownItem, theme === 'dark' && styles.darkText]}>Finished</LexendText>
          </TouchableOpacity>
        </View>
      )}
      {books.length === 0 && (
        <View style={styles.emptyContainer}>
          <LexendText style={[styles.emptyText, theme === 'dark' && styles.darkText]}>There are no books with this status...</LexendText>
        </View>
      )}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={books}
        keyExtractor={(item, index) => item.bookID ? item.bookID.toString() : index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.bookContainer, theme === 'dark' && styles.darkBookContainer]}>
            <LexendBoldText style={[styles.bookName, theme === 'dark' && styles.darkText]}>{item.Title}</LexendBoldText>
            <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>- {item.Author}</LexendText>
            <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>- {item.PageNumber} pages</LexendText>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: StatusBar.currentHeight || 16,
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
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  darkDropdown: {
    borderColor: '#555',
    backgroundColor: '#555',
  },
  dropdownText: {
    fontSize: 16,
    color: 'gray',
  },
  dropdownMenu: {
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#fff',
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
  bookContainer: {
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
  bookName: {
    fontSize: 18,
  },
  bookDetails: {
    fontSize: 16,
    color: 'gray',
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
  },
});

export default ReadingStatusScreen;