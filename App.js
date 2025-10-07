import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Platform, Share } from 'react-native';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');

  const colors = {
    background: '#000000',
    surface: '#2C2C2E',
    text: '#FFFFFF',
    buttonPrimary: '#007AFF',
    buttonSecondary: '#34C759',
  };

  const cleanText = () => {
    if (!inputText.trim()) {
      setCleanedText('');
      return;
    }
    let processed = inputText
      .replace(/^\#+ /gm, '')
      .replace(/\[\d+\]/g, '')
      .replace(/—|–/g, '-')
      .replace(/\*/g, '');
    setCleanedText(processed);
  };

  const shareText = async () => {
    if (!cleanedText.trim()) {
      Alert.alert('No Output', 'Please clean some text first.');
      return;
    }

    const shareOptions = { message: cleanedText, title: 'Cleaned ChatGPT Text' };

    try {
      if (Platform.OS === 'web' && navigator.share) {
        await navigator.share(shareOptions);
      } else if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(cleanedText);
        Alert.alert('Shared', 'Text copied to clipboard!');
      } else {
        await Share.share(shareOptions);
      }
    } catch {
      await navigator.clipboard.writeText(cleanedText);
      Alert.alert('Fallback Shared', 'Text copied to clipboard for manual sharing.');
    }
  };

  const CustomButton = ({ title, onPress, color }) => (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={require('./assets/icon.jpeg')} style={styles.logo} resizeMode="contain" />
      <View style={styles.section}>
        <TextInput
          style={styles.input}
          placeholder="Paste your ChatGPT text here..."
          placeholderTextColor="#8E8E93"
          multiline
          value={inputText}
          onChangeText={setInputText}
          maxLength={5000}
        />
      </View>
      <CustomButton title="Clean" onPress={cleanText} color={colors.buttonPrimary} />
      <View style={styles.section}>
        <Text style={styles.label}>Output</Text>
        <View style={styles.outputContainer}>
          <ScrollView nestedScrollEnabled style={styles.outputScroll}>
            <Text style={styles.output}>{cleanedText || 'Cleaned text will appear here after processing.'}</Text>
          </ScrollView>
        </View>
      </View>
      {cleanedText ? <CustomButton title="Share" onPress={shareText} color={colors.buttonSecondary} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000000' },
  logo: { width: 225, height: 75, marginBottom: 32, alignSelf: 'center' },
  section: { marginBottom: 20 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#FFFFFF' },
  input: {
    height: 120,
    borderColor: '#3A3A3C',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#2C2C2E',
    fontSize: 16,
    color: '#FFFFFF',
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  outputContainer: { height: 120, borderColor: '#3A3A3C', borderWidth: 1, borderRadius: 20 },
  outputScroll: { flex: 1, padding: 16 },
  output: { fontSize: 16, lineHeight: 22, color: '#FFFFFF' },
});
