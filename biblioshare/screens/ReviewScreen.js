import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet, StatusBar } from 'react-native';
import { getUserReviewsAndBooks, getUserProfile } from '../utils/API';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import LexendText from '../components/Texts/LexendText';
import LexendBoldText from '../components/Texts/LexendBoldText';

const ReviewScreen = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const { userId } = route.params;
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getUserReviewsAndBooks(userId);
        setReviews(data);
      } catch (error) {
        setMessage('Error fetching reviews');
        console.error('Error fetching reviews:', error);
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

    fetchReviews();
    fetchUserProfile();
    checkCurrentUser();
  }, [userId]);

  const renderRating = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <AntDesign key={i} name="book" size={24} color={i <= rating ? 'green' : 'grey'} />
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      {message ? <LexendText style={[styles.message, theme === 'dark' && styles.darkText]}>{message}</LexendText> : null}
      <LexendBoldText style={[styles.headerText, theme === 'dark' && styles.darkText]}>
        {isCurrentUser ? 'Your reviews:' : `${username}'s reviews:`}
      </LexendBoldText>
      {reviews.length === 0 && (
        <View style={styles.emptyContainer}>
          <LexendText style={[styles.emptyText, theme === 'dark' && styles.darkText]}>This profile has no reviews...</LexendText>
        </View>
      )}
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.reviewContainer, theme === 'dark' && styles.darkReviewContainer]}>
            <View style={styles.bookInfo}>
              <LexendBoldText style={[styles.bookName, theme === 'dark' && styles.darkText]}>{item.bookName}</LexendBoldText>
              <View style={styles.ratingContainer}>{renderRating(item.rating)}</View>
              <LexendText style={[styles.reviewText, theme === 'dark' && styles.darkText]}>{item.review}</LexendText>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,

  },
  darkContainer: {
    backgroundColor: '#333',
  },
  headerText: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  reviewContainer: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    marginBottom: 12,
  },
  darkReviewContainer: {
    borderColor: '#555',
    backgroundColor: '#555',
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  reviewText: {
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

export default ReviewScreen;