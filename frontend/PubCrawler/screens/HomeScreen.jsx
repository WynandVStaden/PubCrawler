import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  // Function to navigate to the Login screen
  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>MarkDown Collaborator</Text>
        <Text style={styles.subtitle}>Work together on notes!</Text>
      </View>
      <View style={styles.maxWidthContainer}>
        <Button title="Go to Login" onPress={goToLogin} />
        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel
          suscipit turpis. Proin ac justo nec est cursus cursus.
        </Text>
        <Text style={styles.paragraph}>
          Nulla facilisi. In hac habitasse platea dictumst. Suspendisse potenti.
          Nunc id nisl in libero tristique fringilla.
        </Text>
        <Text style={styles.paragraph}>
          Curabitur eu purus ut sapien viverra bibendum nec eget tortor. Quisque
          nec quam eu nisl eleifend congue a sit amet arcu.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b82f6', // Equivalent to the gradient in your web code
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  maxWidthContainer: {
    maxWidth: 300,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 16,
    color: 'white',
    textAlign: 'center',
  },
});

export default HomeScreen;
