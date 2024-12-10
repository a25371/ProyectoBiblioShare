import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../utils/API';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const Profile = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  const fetchProfile = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      const data = await getUserProfile(id);
      setProfile(data);
    } catch (error) {
      setMessage('Error fetching profile');
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('userId');
    navigation.replace('Login');
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <LexendBoldText style={[styles.title, theme === 'dark' && styles.darkText]}>Profile</LexendBoldText>
      {message ? <LexendText>{message}</LexendText> : null}
      {profile && (
        <>
          <View style={styles.profileHeader}>
            <FontAwesome name="user" size={100} color={theme === 'dark' ? '#fff' : '#000'} style={styles.profileIcon} />
            <View style={styles.profileInfo}>
              <LexendBoldText style={[styles.profileName, theme === 'dark' && styles.darkText]}>{profile.username}</LexendBoldText>
              <LexendText style={[styles.profilePronouns, theme === 'dark' && styles.darkText]}>{profile.pronouns}</LexendText>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, theme === 'dark' && styles.darkButton]} onPress={() => navigation.navigate('BookListScreen', { userId })}>
              <LexendText style={styles.buttonText}>Your Booklists</LexendText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, theme === 'dark' && styles.darkButton]} onPress={() => navigation.navigate('ReadingStatusScreen', { userId })}>
              <LexendText style={styles.buttonText}>Books by Reading Status</LexendText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, theme === 'dark' && styles.darkButton]} onPress={() => navigation.navigate('ReviewScreen', { userId })}>
              <LexendText style={styles.buttonText}>Your Reviews</LexendText>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={[styles.settingsButton, theme === 'dark' && styles.darkButton]} onPress={() => navigation.navigate('Settings')}>
            <LexendText style={styles.settingsButtonText}>Settings</LexendText>
          </TouchableOpacity>
          <View style={styles.donateContainer}>
            <LexendBoldText style={styles.donateText}>Donate:</LexendBoldText>
            <View style={styles.donateIcons}>
              <Image source={{ uri: 'https://res.cloudinary.com/dtjdlphzv/image/upload/v1733485126/xnp7f8qyqbipnrhutg6u.png' }} style={styles.donateIcon} resizeMode="contain" />
              <Image source={{ uri: theme === 'dark' ? 'https://res.cloudinary.com/dtjdlphzv/image/upload/v1733485126/tmufw6watb22jgssnlv5.png' : 'https://res.cloudinary.com/dtjdlphzv/image/upload/v1733485186/gf5mceusrjdddpzbx78o.png' }} style={styles.donateIcon} resizeMode="contain" />
            </View>
            <LexendText style={styles.supportText}>Your money supports the developer and brings new content to Biblioshare.</LexendText>
          </View>
          <TouchableOpacity style={[styles.button, theme === 'dark' && styles.darkButton]} onPress={handleLogout}>
            <LexendText style={styles.buttonText}>Logout</LexendText>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
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
  profileName: {
    fontSize: 24,
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
  divider: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 20,
  },
  settingsButton: {
    backgroundColor: '#8b0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  donateContainer: {
    alignItems: 'center',
  },
  donateText: {
    fontSize: 18,
    marginBottom: 10,
  },
  donateIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  donateIcon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  supportText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});

export default Profile;