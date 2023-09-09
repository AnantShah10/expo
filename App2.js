import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Voice from 'react-native-voice';

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      const recognized = event.value[0];
      setRecognizedText(recognized);
    };

    return () => {
      Voice.removeAllListeners();
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={isListening ? stopListening : startListening}>
        <Text style={{ fontSize: 20, color: 'blue' }}>
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Text>
      </TouchableOpacity>

      {recognizedText !== '' && (
        <Text style={{ fontSize: 24, marginTop: 20 }}>
          Recognized Text: {recognizedText}
        </Text>
      )}
    </View>
  );
}
