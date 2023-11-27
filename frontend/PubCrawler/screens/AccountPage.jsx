import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import * as DocumentPicker from 'expo-document-picker';

const Profile = ({ navigation }) => {
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState({ username: '' });
  const [updatedUser, setUpdatedUser] = useState({
    username: '',
    email: '',
    password: '',
    avatar: '',
  });
  const [editing, setEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        const currentUser = JSON.parse(userString);
        const updatedUser = {
          username: currentUser.username,
          email: currentUser.email,
          password: currentUser.password,
          avatar: currentUser.avatar,
        };

        if (!currentUser) {
          navigation.navigate('Home'); // Navigate to the home screen if the user is not available
          return;
        }

        let url = 'http://localhost:6969/api/files/' + currentUser.avatar;

        setCurrentUser(currentUser);
        setUpdatedUser(updatedUser);
        setFileURL(url);
        setPassword(await AsyncStorage.getItem('password'));
      } catch (error) {
        console.error(error);
        setError('Error fetching profile data');
      }
    };

    fetchData();
  }, [navigation]);

  const toggleEdit = () => {
    setEditing((prevEditing) => !prevEditing);
  };

  const handleDelete = async () => {
    try {
      const username = currentUser.username;
      const token = currentUser.accessToken;

      console.log('token for delete profile: ' + token);

      // Implement userService.deleteProfile for React Native

      console.log('deleting profile...');

      AsyncStorage.removeItem('user'); // remove user data from local storage
      navigation.navigate('Home'); // navigate to the home screen
    } catch (error) {
      console.error(error);
      setError('Error deleting profile');
    }
  };

  const handleAvatarChange = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === 'success') {
        const file = {
          name: result.name,
          uri: result.uri,
        };

        setNewAvatar(file);

        let url = 'http://localhost:6969/api/files/' + file.name;
        setFileURL(url);
        console.log(file);
      }
    } catch (error) {
      console.error(error);
      setError('Error selecting avatar');
    }
  };

  return (
    <View>
      <Text>Profile Screen</Text>
      {/* Render your UI components using the state variables */}
      <Image source={{ uri: fileURL }} style={{ width: 200, height: 200, marginBottom: 10 }} />
      <Button title="Choose Avatar" onPress={handleAvatarChange} />
      {newAvatar && (
        <Image source={{ uri: newAvatar.uri }} style={{ width: 200, height: 200, marginBottom: 0 }} />
      )}
      <Button title="Save" onPress={() => console.log('Save button pressed')} />
      <Button title="Toggle Edit" onPress={toggleEdit} />
      <Button title="Delete Profile" onPress={handleDelete} />
      <Text>Error: {error}</Text>
    </View>
  );
};

export default Profile;

