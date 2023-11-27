import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../context/AuthProvider';
import userService from '../services/user.service.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = () => {
  const { setAuth } = useContext(AuthContext);
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (name, value) => {
    console.log('Entered handle input change.');
    if (name === 'email') {
     setEmail(value);
     console.log(value + ' ' + email);
    }
    if (name === 'password') {
    	setPassword(value);
    	console.log(value + ' ' + password);
    }
  };

  const handleSubmit = async () => {
    console.log('Entered login handle submit');
    setLoading(true);

    try {
      console.log('Entered try');
      const response = await userService.checkLogin(      JSON.stringify({ "email" : email, "password" : password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                });
      console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      setAuth({ email, password, accessToken });
      if (accessToken) AsyncStorage.setItem('user', JSON.stringify(response.data));
      console.log('password matches');
      navigation.navigate('Profile'); // Assuming 'Profile' is the screen name
    } catch (error) {
      console.log('Entered catch');
      console.log(error);
      console.log(email + ' ' + password);
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 400) {
        setError('Missing Username or Password');
      } else if (error.response?.status === 401) {
        setError('Password or Email is incorrect');
      } else if (error.response?.status === 500) {
        setError('Internal Server Error');
      } else {
        setError('Unknown Error');
      }
    }

    setLoading(false);
  };

  return (
    <View>
      <View>
        <Text>Your email</Text>
        <TextInput
          style={
            {
              /* Add your styles here */
            }
          }
          placeholder="name@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
      </View>
      <View>
        <Text>Password</Text>
        <TextInput
          style={
            {
              /* Add your styles here */
            }
          }
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
      </View>
      <Button title="SUBMIT" onPress={handleSubmit} />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Text>
        Don’t have an account yet?{' '}
        <Text
          style={{ color: 'blue' }}
          onPress={() => navigation.navigate('SignUp')} // Assuming 'SignUp' is the screen name
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
};

export default LoginForm;

