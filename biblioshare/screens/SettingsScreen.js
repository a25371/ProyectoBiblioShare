import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Switch } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { updateUserProfile } from '../utils/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const SettingsScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleUpdateProfile = async () => {
    try {
      const currentUsername = await AsyncStorage.getItem('username');
      const data = await updateUserProfile(currentUsername, { username, pronouns, password });
      setResponseMessage('Profile updated successfully');
      console.log('Profile updated:', data);
    } catch (error) {
      setResponseMessage('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <LexendBoldText style={[styles.settingsText, theme === 'dark' && styles.darkText]}>Settings</LexendBoldText>
      <TextInput
        style={[styles.input, theme === 'dark' && styles.darkInput]}
        placeholder="Change Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, theme === 'dark' && styles.darkInput]}
        placeholder="Change Pronouns"
        value={pronouns}
        onChangeText={setPronouns}
      />
      <TextInput
        style={[styles.input, theme === 'dark' && styles.darkInput]}
        placeholder="Change Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
      <View style={styles.themeToggleContainer}>
        <LexendText style={[styles.themeToggleText, theme === 'dark' && styles.darkText]}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </LexendText>
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View>
      {responseMessage ? <LexendText style={styles.responseMessage}>{responseMessage}</LexendText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  settingsText: {
    fontSize: 24,
    marginBottom: 20,
  },
  darkText: {
    color: '#fff',
  },
  input: {
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  darkInput: {
    backgroundColor: '#555',
    color: '#fff',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  themeToggleText: {
    fontSize: 16,
    marginRight: 10,
  },
  responseMessage: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default SettingsScreen;