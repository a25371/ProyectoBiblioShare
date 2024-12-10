import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWatchedUsers } from '../utils/API';
import { ThemeContext } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';
import { useFocusEffect } from '@react-navigation/native';

const Social = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [watchedUsers, setWatchedUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setMessage('User ID not found');
        return;
      }
      const usersData = await getWatchedUsers(userId);
      setWatchedUsers(usersData);
    } catch (error) {
      setMessage('Error fetching data');
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleUserPress = (userId) => {
    navigation.navigate('UserProfile', { userId });
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      {message ? <LexendText style={[styles.message, theme === 'dark' && styles.darkText]}>{message}</LexendText> : null}
      <LexendBoldText style={[styles.headerText, theme === 'dark' && styles.darkText]}>Watched Users:</LexendBoldText>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={watchedUsers}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} // Handle undefined id
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item.id)}>
            <View style={[styles.listItem, theme === 'dark' && styles.darkListItem]}>
              <LexendText style={[styles.listName, theme === 'dark' && styles.darkText]}>• {item.username}</LexendText>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false} // Hide the scroll bar
      />
      {watchedUsers.length === 0 && (
        <View style={styles.emptyContainer}>
          <LexendText style={[styles.emptyText, theme === 'dark' && styles.darkText]}>You don't follow anyone!</LexendText>
          <LexendText style={[styles.emptyText, theme === 'dark' && styles.darkText]}>You can search users to start following them for easy access to their profiles with this button!</LexendText>
          <FontAwesome name="arrow-down" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
        </View>
      )}
      <TouchableOpacity style={[styles.button, theme === 'dark' && styles.darkButton]} onPress={() => navigation.navigate('UserSearchScreen')}>
        <LexendText style={styles.buttonText}>Search Users</LexendText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: StatusBar.currentHeight || 16, // Add padding to the top
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
  },
  darkText: {
    color: '#fff',
  },
  listItem: {
    flex: 1,
    padding: 16,
    margin: 8,
    backgroundColor: '#fff',
  },
  darkListItem: {
    backgroundColor: '#555',
  },
  listName: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#8b0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  darkButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: 'gray',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 10, // Add margin to create space between the text and the button
  },
});

export default Social;