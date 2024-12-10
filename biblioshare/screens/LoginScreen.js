import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { loginUser } from '../utils/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const LoginScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      if (data.success) {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('userId', data.userId.toString());
        navigation.replace('RootTabs');
      } else {
        setMessage('Invalid username or password');
      }
    } catch (error) {
      setMessage('Error logging in');
      console.error('Error logging in:', error);
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Image source={{ uri: 'https://res.cloudinary.com/dtjdlphzv/image/upload/v1733762917/hcq4qutftrnstvz1rgt1.png' }} style={styles.logo} />
      <LexendBoldText style={[styles.title, theme === 'dark' && styles.darkText]}>Login</LexendBoldText>
      <TextInput
        style={[styles.input, theme === 'dark' && styles.darkInput]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#000'}
      />
      <TextInput
        style={[styles.input, theme === 'dark' && styles.darkInput]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#000'}
      />
      <TouchableOpacity style={[styles.button, theme === 'dark' && styles.darkButton]} onPress={handleLogin}>
        <LexendText style={styles.buttonText}>Login</LexendText>
      </TouchableOpacity>
      {message ? <LexendText style={[styles.message, theme === 'dark' && styles.darkText]}>{message}</LexendText> : null}
      <View style={styles.signupContainer}>
        <LexendText style={theme === 'dark' ? styles.darkText : null}>Don't have an account?</LexendText>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <LexendText style={[styles.signupText, theme === 'dark' && styles.darkSignupText]}>Sign up</LexendText>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  title: {
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
  button: {
    backgroundColor: '#8b0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  darkButton: {
    backgroundColor: '#2B4EFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  signupContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    color: '#8b0000',
    marginTop: 5,
  },
  darkSignupText: {
    color: '#2B4EFF',
  },
});

export default LoginScreen;