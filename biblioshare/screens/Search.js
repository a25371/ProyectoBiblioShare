import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, TextInput, FlatList, StyleSheet, StatusBar, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { searchBooks } from '../utils/API';
import { ThemeContext } from '../context/ThemeContext';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const Search = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [searchBy, setSearchBy] = useState('Title');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const fetchBooks = async (query, searchBy) => {
    try {
      console.log(`Fetching books with query: ${query}, searchBy: ${searchBy}`);
      const data = await searchBooks(query, searchBy);
      setBooks(data);
    } catch (error) {
      setMessage('Error fetching books');
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchBooks(searchQuery, searchBy);
    } else {
      setBooks([]);
    }
  }, [searchQuery]);

  const handleBookPress = (bookId) => {
    navigation.navigate('BookDetails', { bookId });
  };

  const handleSearchByChange = (itemValue) => {
    setSearchBy(itemValue);
    setSearchQuery('');
    setBooks([]);
    setMessage('');
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        <LexendBoldText style={[styles.title, theme === 'dark' && styles.darkText]}>Book Search</LexendBoldText>
        <TextInput
          style={[styles.searchBar, theme === 'dark' && styles.darkInput]}
          placeholder="Search for books..."
          placeholderTextColor={theme === 'dark' ? '#ccc' : '#000'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={toggleDropdown} style={[styles.dropdown, theme === 'dark' && styles.darkDropdown]}>
          <LexendText style={[styles.dropdownText, theme === 'dark' && styles.darkText]}>{searchBy}</LexendText>
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={[styles.dropdownMenu, theme === 'dark' && styles.darkDropdownMenu]} ref={dropdownRef}>
            <TouchableOpacity onPress={() => handleSearchByChange('Title')}>
              <LexendText style={[styles.dropdownItem, theme === 'dark' && styles.darkText]}>Title</LexendText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSearchByChange('Author')}>
              <LexendText style={[styles.dropdownItem, theme === 'dark' && styles.darkText]}>Author</LexendText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSearchByChange('Release Year')}>
              <LexendText style={[styles.dropdownItem, theme === 'dark' && styles.darkText]}>Release Year</LexendText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSearchByChange('Genre')}>
              <LexendText style={[styles.dropdownItem, theme === 'dark' && styles.darkText]}>Genre</LexendText>
            </TouchableOpacity>
          </View>
        )}
        {message ? <LexendText style={[styles.message, theme === 'dark' && styles.darkText]}>{message}</LexendText> : null}
        {searchQuery === '' && (
          <View style={styles.emptyContainer}>
            <LexendText style={[styles.emptyText, theme === 'dark' && styles.darkText]}>Type on the search bar to find books!</LexendText>
          </View>
        )}
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={books}
          keyExtractor={(item) => item.BookID.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleBookPress(item.BookID)}>
              <View style={[styles.bookContainer, theme === 'dark' && styles.darkBookContainer]}>
                <LexendBoldText style={[styles.bookName, theme === 'dark' && styles.darkText]}>{item.Title}</LexendBoldText>
                <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>- {item.Author}</LexendText>
                <LexendText style={[styles.bookDetails, theme === 'dark' && styles.darkText]}>- {item.PageNumber} pages</LexendText>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: (StatusBar.currentHeight || 16),

  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
  darkText: {
    color: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  darkInput: {
    borderColor: '#555',
    backgroundColor: '#555',
    color: '#fff',
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
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
    position: 'absolute',
    top: 90,
    left: 16,
    right: 16,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#fff',
    zIndex: 1,
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
  listContainer: {
    paddingBottom: 16,
  },
  bookContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
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

export default Search;