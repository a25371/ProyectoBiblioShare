import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import { getUserProfile, updateUserWatchStatus, getUserWatchStatus } from '../utils/API';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const UserProfile = ({ route, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { userId } = route.params;
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userId);
        console.log('Fetched profile data:', data); // Debug logging
        setProfile(data);
      } catch (error) {
        setMessage('Error fetching profile');
        console.error('Error fetching profile:', error);
      }
    };

    const fetchWatchStatus = async () => {
      try {
        const currentUserId = await AsyncStorage.getItem('userId');
        const status = await getUserWatchStatus(currentUserId, userId);
        setIsWatched(status.isWatched);
      } catch (error) {
        console.error('Error fetching watch status:', error);
      }
    };

    fetchProfile();
    fetchWatchStatus();
  }, [userId]);

  const handleWatchToggle = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem('userId');
      await updateUserWatchStatus(currentUserId, userId, !isWatched);
      setIsWatched(!isWatched);
    } catch (error) {
      console.error('Error updating watch status:', error);
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      {message ? <LexendText>{message}</LexendText> : null}
      {profile && (
        <>
          <View style={styles.profileHeader}>
            <FontAwesome name="user" size={100} color={theme === 'dark' ? '#fff' : '#000'} style={styles.profileIcon} />
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <LexendBoldText style={[styles.profileName, theme === 'dark' && styles.darkText]}>{profile.username}</LexendBoldText>
                <TouchableOpacity onPress={handleWatchToggle}>
                  <FontAwesome name="eye" size={24} color={isWatched ? 'blue' : 'grey'} style={styles.watchIcon} />
                </TouchableOpacity>
              </View>
              <LexendText style={[styles.profilePronouns, theme === 'dark' && styles.darkText]}>{profile.pronouns}</LexendText>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, theme === 'dark' && styles.darkButton]} onPress={() => navigation.navigate('BookListScreen', { userId })}>
              <LexendText style={styles.buttonText}>User's Booklists</LexendText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, theme === 'dark' && styles.darkButton]} onPress={() => navigation.navigate('ReadingStatusScreen', { userId })}>
              <LexendText style={styles.buttonText}>Books by Reading Status</LexendText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, theme === 'dark' && styles.darkButton]} onPress={() => navigation.navigate('ReviewScreen', { userId })}>
              <LexendText style={styles.buttonText}>User's Reviews</LexendText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40, // Add top padding to avoid the status bar
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    marginRight: 8,
  },
  watchIcon: {
    marginLeft: 8,
  },
  profilePronouns: {
    fontSize: 16,
    color: 'gray',
  },
  darkText: {
    color: '#fff',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8b0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  darkButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserProfile;