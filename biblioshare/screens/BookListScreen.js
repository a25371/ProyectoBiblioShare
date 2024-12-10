import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { getUserCustomLists, getUserProfile } from '../utils/API';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const BookListScreen = ({ route, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { userId } = route.params;
  const [customLists, setCustomLists] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listsData = await getUserCustomLists(userId);
        setCustomLists(listsData);
      } catch (error) {
        setMessage('Error fetching data');
        console.error('Error fetching data:', error);
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

    fetchData();
    fetchUserProfile();
    checkCurrentUser();
  }, [userId]);

  const handleListPress = (listId) => {
    navigation.navigate('ListDetails', { listId });
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      {message ? <LexendText style={[styles.message, theme === 'dark' && styles.darkText]}>{message}</LexendText> : null}
      <LexendBoldText style={[styles.headerText, theme === 'dark' && styles.darkText]}>
        {isCurrentUser ? 'Your booklists:' : `${username}'s booklists:`}
      </LexendBoldText>
      {customLists.length === 0 && (
        <View style={styles.emptyContainer}>
          <LexendText style={[styles.emptyText, theme === 'dark' && styles.darkText]}>This profile has no book lists...</LexendText>
        </View>
      )}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={customLists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleListPress(item.id)}>
            <View style={[styles.listItem, theme === 'dark' && styles.darkListItem]}>
              <LexendBoldText style={[styles.listName, theme === 'dark' && styles.darkText]}>• {item.name}</LexendBoldText>
              <LexendText style={[styles.listDetails, theme === 'dark' && styles.darkText]}>{item.bookCount} books</LexendText>
            </View>
          </TouchableOpacity>
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
  listItem: {
    flex: 1,
    padding: 6,
    margin: 8,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  darkListItem: {
    backgroundColor: '#555',
    borderColor: '#555',
  },
  listName: {
    fontSize: 18,
  },
  listDetails: {
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

export default BookListScreen;