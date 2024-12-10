import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { sendUserData } from '../utils/API';
import { ThemeContext } from '../context/ThemeContext';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const CreateUserScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordTouched, setPasswordTouched] = useState(false);

  useEffect(() => {
    const isValid = (text) => /^[a-zA-Z0-9]*$/.test(text);
    setUsernameValid(isValid(username));
    setPasswordValid(isValid(password) && password.length >= 5);
    setIsButtonDisabled(!username || !password || !isValid(username) || !isValid(password) || password.length < 5);
  }, [username, password]);

  const handleSubmit = async () => {
    try {
      console.log('Creating user with:', { username, password, pronouns });
      const data = await sendUserData(username, password, pronouns);
      setResponseMessage(`User created with ID: ${data.id}`);
      console.log('User created:', data);
      Alert.alert(
        'Success',
        'User created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'), // Navigate back to the login screen
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      setResponseMessage('Error creating user');
      console.error('Error creating user:', error);
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <LexendBoldText style={[styles.title, theme === 'dark' && styles.darkText]}>Creating a new user:</LexendBoldText>
      <TextInput
        style={[styles.input, !usernameValid && styles.invalidInput, theme === 'dark' && styles.darkInput]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#000'}
      />
      <TextInput
        style={[styles.input, passwordTouched && !passwordValid && styles.invalidInput, theme === 'dark' && styles.darkInput]}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordTouched(true);
        }}
        secureTextEntry
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#000'}
      />
      <TextInput
        style={[styles.input, theme === 'dark' && styles.darkInput]}
        placeholder="Pronouns (Optional)"
        value={pronouns}
        onChangeText={setPronouns}
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#000'}
      />
      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.buttonDisabled, theme === 'dark' && styles.darkButton]}
        onPress={handleSubmit}
        disabled={isButtonDisabled}
      >
        <LexendText style={styles.buttonText}>Create User</LexendText>
      </TouchableOpacity>
      {responseMessage ? <LexendText style={[styles.responseMessage, theme === 'dark' && styles.darkText]}>{responseMessage}</LexendText> : null}
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
  invalidInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#8b0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  darkButton: {
    backgroundColor: '#555',
  },
  buttonDisabled: {
    backgroundColor: 'grey', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  responseMessage: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default CreateUserScreen;