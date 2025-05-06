import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { GOOGLE_LOCATION_KEY } from '../../utils/api';

const GOOGLE_API_KEY = 'AIzaSyB5D8cCcugZPm2WiQh106c-K1-2dmSEiv0'; // Replace with your actual API key

const GooglePlacesAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch autocomplete results
  const fetchPlaces = async (input: string) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://places.googleapis.com/v1/places:autocomplete',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'X-Goog-Api-Key': GOOGLE_LOCATION_KEY,
            'X-Goog-Api-Key': GOOGLE_API_KEY,
          },
          body: JSON.stringify({ input }),
        },
      );

      console.log("----- response in the google places ====", response);


      const data = await response.json();
      const results =
        data.suggestions?.map((s: any) => s.placePrediction.text.text) || [];

      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching places:', error);
    }

    setLoading(false);
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    if (text.length >= 2) {
      fetchPlaces(text);
    } else {
      setSuggestions([]); // Clear suggestions if input is too short
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a place..."
        value={query}
        onChangeText={handleInputChange}
      />

      {loading && (
        <ActivityIndicator size="small" color="gray" style={styles.loader} />
      )}

      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => setQuery(item)}>
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
  },
  loader: {
    marginVertical: 10,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
  },
});

export default GooglePlacesAutocomplete;
