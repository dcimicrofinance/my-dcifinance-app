import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Platform, Share, Linking } from 'react-native';

// Screens
const HomeScreen = ({
  inputText,
  setInputText,
  cleanedText,
  cleanText,
  shareText,
  CustomButton,
  navigate,
}) => (
  <ScrollView style={styles.container}>
    <Image source={require('./assets/icon.jpeg')} style={styles.logo} resizeMode="contain" />
    <Text style={styles.description}>
      Converts GPT text by removing asterisks, em dashes, hashtags, tildes, and other symbols.{"\n"}
      Removes emojis and unwanted characters.{"\n"}
      Formats text for presentations or Word/PDF documents.
    </Text>
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
    <CustomButton title="Clean" onPress={cleanText} color="#007AFF" />
    <View style={styles.section}>
      <Text style={styles.label}>Output</Text>
      <View style={styles.outputContainer}>
        <ScrollView nestedScrollEnabled style={styles.outputScroll}>
          <Text style={styles.output}>{cleanedText || 'Cleaned text will appear here after processing.'}</Text>
        </ScrollView>
      </View>
    </View>
    {cleanedText ? <CustomButton title="Share" onPress={shareText} color="#34C759" /> : null}
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
      <CustomButton title="About" onPress={() => navigate('about')} color="#3333bb" />
      <CustomButton title="Privacy" onPress={() => navigate('privacy')} color="#3377bb" />
    </View>
  </ScrollView>
);

const AboutScreen = ({ navigate }) => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>About This App</Text>
    <Text style={styles.screenText}>
      This tool helps you convert ChatGPT outputs for professional use. It removes formatting symbols,
      emojis, and unwanted marks, so your text is clean for presentations, Word or PDF files.
    </Text>
    <TouchableOpacity style={styles.backButton} onPress={() => navigate('home')}>
      <Text style={styles.backButtonText}>Back to Home</Text>
    </TouchableOpacity>
  </View>
);

const PrivacyScreen = ({ navigate }) => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>Privacy Policy</Text>
    <Text style={styles.screenText}>
      You can read our privacy policy anytime at:
    </Text>
    <TouchableOpacity
      onPress={() => Linking.openURL('https://dcimicrofinance.github.io/privacy.html')}
    >
      <Text style={styles.privacyLink}>dcimicrofinance.github.io/privacy.html</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.backButton} onPress={() => navigate('home')}>
      <Text style={styles.backButtonText}>Back to Home</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  const [screen, setScreen] = useState('home');
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');

  const navigate = (route) => setScreen(route);

  const cleanText = () => {
    if (!inputText.trim()) {
      setCleanedText('');
      return;
    }
    // Emoji regex pattern for removal
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
    let processed = inputText
      .replace(/^\#+ /gm, '')
      .replace(/\[\d+\]/g, '')
      .replace(/—|–/g, ' ')
      .replace(/-/g, '')
      .replace(/\*/g, '')
      .replace(emojiRegex, '')
      .replace(/~/g, '')
      .replace(/\s+/g, ' ')
      .trim();
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

  // Simple navigation between screens
  if (screen === 'about') return <AboutScreen navigate={navigate} />;
  if (screen === 'privacy') return <PrivacyScreen navigate={navigate} />;
  return (
    <HomeScreen
      inputText={inputText}
      setInputText={setInputText}
      cleanedText={cleanedText}
      cleanText={cleanText}
      shareText={shareText}
      CustomButton={CustomButton}
      navigate={navigate}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000000' },
  logo: { width: 225, height: 75, marginBottom: 8, alignSelf: 'center' },
  description: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
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
    marginHorizontal: 6,
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

  // Screens styles
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#000000',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3498db',
    marginBottom: 16,
    textAlign: 'center',
  },
  screenText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  privacyLink: {
    color: '#4FC3F7',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3333bb',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
