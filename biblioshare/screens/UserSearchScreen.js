import React, { useState, useContext } from 'react';
import { View, TextInput, FlatList, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { searchUsers } from '../utils/API';
import { ThemeContext } from '../context/ThemeContext';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const UserSearchScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchUsers = async (query) => {
    try {
      const data = await searchUsers(query);
      setUsers(data);
    } catch (error) {
      setMessage('Error fetching users');
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = () => {
    fetchUsers(searchQuery);
  };

  const handleUserPress = (userId) => {
    navigation.navigate('UserProfile', { userId });
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <LexendBoldText style={[styles.title, theme === 'dark' && styles.darkText]}>User Search</LexendBoldText>
      <TextInput
        style={[styles.searchBar, theme === 'dark' && styles.darkInput]}
        placeholder="Search for users..."
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#000'}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {message ? <LexendText style={[styles.message, theme === 'dark' && styles.darkText]}>{message}</LexendText> : null}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item.id)}>
            <View style={[styles.userContainer, theme === 'dark' && styles.darkUserContainer]}>
              <LexendText style={[styles.userName, theme === 'dark' && styles.darkText]}>{item.username}</LexendText>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: (StatusBar.currentHeight || 16),
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
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
    backgroundColor: '#fff',
  },
  darkInput: {
    borderColor: '#555',
    backgroundColor: '#555',
    color: '#fff',
  },
  userContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  darkUserContainer: {
    borderColor: '#555',
    backgroundColor: '#555',
  },
  userName: {
    fontSize: 18,
  },
  message: {
    fontSize: 16,
    color: 'gray',
  },
});

export default UserSearchScreen;