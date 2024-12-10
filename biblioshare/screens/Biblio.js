import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity, TextInput, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserCustomLists, createCustomList, deleteCustomList } from '../utils/API';
import { ThemeContext } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';
import { useFocusEffect } from '@react-navigation/native';

const Biblio = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [customLists, setCustomLists] = useState([]);
  const [message, setMessage] = useState('');
  const [newListName, setNewListName] = useState('');

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setMessage('User ID not found');
        return;
      }
      const listsData = await getUserCustomLists(userId);
      setCustomLists(listsData);
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

  const handleListPress = (listId) => {
    navigation.navigate('ListDetails', { listId });
  };

  const handleCreateList = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setMessage('User ID not found');
        return;
      }
      const newList = await createCustomList(userId, newListName);
      setNewListName('');
      Alert.alert('List created successfully');
      fetchData(); // Fetch updated data after creating a new list
    } catch (error) {
      Alert.alert('Error creating list');
      console.error('Error creating list:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await deleteCustomList(listId);
              fetchData(); // Fetch updated data after deleting a list
            } catch (error) {
              Alert.alert('Error deleting list');
              console.error('Error deleting list:', error);
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
      <LexendBoldText style={[styles.headerText, theme === 'dark' && styles.darkText]}>Your booklists:</LexendBoldText>
      {customLists.length === 0 && (
        <View style={styles.emptyContainer}>
          <LexendText style={[styles.emptyText, theme === 'dark' && styles.darkText]}>You don't have any lists yet! Create a new one!</LexendText>
        </View>
      )}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={customLists}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} // Handle undefined id
        renderItem={({ item }) => (
          <View style={[styles.listItem, theme === 'dark' && styles.darkListItem]}>
            <TouchableOpacity onPress={() => handleListPress(item.id)} style={styles.listContent}>
              <LexendBoldText style={[styles.listName, theme === 'dark' && styles.darkText]}>• {item.name}</LexendBoldText>
              <LexendText style={[styles.listDetails, theme === 'dark' && styles.darkText]}>{item.bookCount || 0} books</LexendText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteList(item.id)} style={styles.deleteButton}>
              <FontAwesome name="times" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false} // Hide the scroll bar
      />
      <TextInput
        style={[styles.input, theme === 'dark' && styles.darkInput]}
        placeholder="New list name"
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#000'}
        value={newListName}
        onChangeText={setNewListName}
      />
      <Button title="Create List" onPress={handleCreateList} />
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
    flexDirection: 'row',
    alignItems: 'center',
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
  listContent: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
  },
  listDetails: {
    fontSize: 16,
    color: 'gray',
  },
  deleteButton: {
    padding: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  darkInput: {
    borderColor: '#555',
    backgroundColor: '#555',
    color: '#fff',
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
  },
});

export default Biblio;