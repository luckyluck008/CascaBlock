import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Cascadia Score Tracker Component
export default function CascadiaScoreTracker() {
  // Player names state
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  
  // Score data state - each player has data for animals, habitats, and nature tokens
  const [scores, setScores] = useState<Record<string, any>>({
    // Animal scores (Tier-Summe T)
    bear: ['', '', '', ''], // 5 animals per player
    deer: ['', '', '', ''],
    salmon: ['', '', '', ''],
    hawk: ['', '', '', ''],
    fox: ['', '', '', ''],
    
    // Habitat scores (Habitat-Summe G) - each has base and bonus
    forest: { base: ['', '', '', ''], bonus: ['', '', '', ''] },
    mountain: { base: ['', '', '', ''], bonus: ['', '', '', ''] },
    river: { base: ['', '', '', ''], bonus: ['', '', '', ''] },
    field: { base: ['', '', '', ''], bonus: ['', '', '', ''] },
    wetland: { base: ['', '', '', ''], bonus: ['', '', '', ''] },
    
    // Nature tokens
    natureTokens: ['', '', '', ''],
  });

  // Calculate totals
  const calculateTotals = () => {
    const totals: number[] = [];
    
    for (let playerIdx = 0; playerIdx < 4; playerIdx++) {
      // Calculate Tier-Summe (T) - sum of animal scores
      const tierSum = ['bear', 'deer', 'salmon', 'hawk', 'fox']
        .map(animal => parseInt(scores[animal][playerIdx] || 0))
        .reduce((sum, val) => sum + val, 0);
      
      // Calculate Habitat-Summe (G) - sum of habitat base + bonus
      const habitatSum = ['forest', 'mountain', 'river', 'field', 'wetland']
        .map(habitat => {
          const base = parseInt(scores[habitat].base[playerIdx] || 0);
          const bonus = parseInt(scores[habitat].bonus[playerIdx] || 0);
          return base + bonus;
        })
        .reduce((sum, val) => sum + val, 0);
      
      // Add nature tokens
      const natureTokens = parseInt(scores.natureTokens[playerIdx] || 0);
      
      // Total score = T + G + Nature Tokens
      totals.push(tierSum + habitatSum + natureTokens);
    }
    
    return totals;
  };

  const totals = calculateTotals();

  // Update player name
  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  // Update score for a specific field
  const updateScore = (category: string, subCategory: string | null, playerIndex: number, value: string) => {
    setScores(prev => {
      const newScores = { ...prev };
      
      if (subCategory) {
        // For habitats with base/bonus
        newScores[category] = {
          ...newScores[category],
          [subCategory]: newScores[category][subCategory].map((v: string, i: number) => 
            i === playerIndex ? value : v
          )
        };
      } else {
        // For animals and nature tokens
        newScores[category] = newScores[category].map((v: string, i: number) => 
          i === playerIndex ? value : v
        );
      }
      
      return newScores;
    });
  };

  // Reset all scores
  const resetScores = () => {
    Alert.alert(
      'Reset Scores',
      'Are you sure you want to reset all scores?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setScores({
              bear: ['', '', '', ''],
              deer: ['', '', '', ''],
              salmon: ['', '', '', ''],
              hawk: ['', '', '', ''],
              fox: ['', '', '', ''],
              forest: { base: ['', '', '', ''], bonus: ['', '', '', ''] },
              mountain: { base: ['', '', '', ''], bonus: ['', '', '', ''] },
              river: { base: ['', '', '', ''], bonus: ['', '', '', ''] },
              field: { base: ['', '', '', ''], bonus: ['', '', '', ''] },
              wetland: { base: ['', '', '', ''], bonus: ['', '', '', ''] },
              natureTokens: ['', '', '', ''],
            });
          }
        }
      ]
    );
  };



  // Render a row with icon/name and input fields for each player
  const renderRow = (icon: string, label: string, category: string, subCategory: string | null = null) => {
    return (
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Ionicons name={icon as any} size={24} color="#5D4037" />
          <Text style={styles.label}>{label}</Text>
        </View>
        {playerNames.map((_, playerIndex) => (
          <View key={playerIndex} style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={subCategory ? scores[category][subCategory][playerIndex] : scores[category][playerIndex]}
              onChangeText={(value) => updateScore(category, subCategory, playerIndex, value)}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        ))}
      </View>
    );
  };

  // Render a habitat row with base and bonus fields
  const renderHabitatRow = (icon: string, label: string, category: string) => {
    return (
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Ionicons name={icon as any} size={24} color="#5D4037" />
          <Text style={styles.label}>{label}</Text>
        </View>
        {playerNames.map((_, playerIndex) => (
          <View key={playerIndex} style={styles.doubleInputContainer}>
            <TextInput
              style={[styles.input, styles.habitatInput]}
              value={scores[category].base[playerIndex]}
              onChangeText={(value) => updateScore(category, 'base', playerIndex, value)}
              keyboardType="numeric"
              maxLength={2}
              placeholder="Base"
            />
            <TextInput
              style={[styles.input, styles.habitatInput]}
              value={scores[category].bonus[playerIndex]}
              onChangeText={(value) => updateScore(category, 'bonus', playerIndex, value)}
              keyboardType="numeric"
              maxLength={2}
              placeholder="Bonus"
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header with player names */}
          <View style={styles.header}>
            <View style={styles.leftColumn}>
              <Text style={styles.headerLabel}>Cascadia</Text>
            </View>
            {playerNames.map((name, index) => (
              <View key={index} style={styles.headerInputContainer}>
                <TextInput
                  style={styles.headerInput}
                  value={name}
                  onChangeText={(value) => updatePlayerName(index, value)}
                  placeholder={`Player ${index + 1}`}
                />
              </View>
            ))}
          </View>

          {/* Animal Rows */}
          {renderRow('paw', 'Bear', 'bear')}
          {renderRow('man', 'Deer', 'deer')}
          {renderRow('water', 'Salmon', 'salmon')}
          {renderRow('md-bird', 'Hawk', 'hawk')}
          {renderRow('md-leaf', 'Fox', 'fox')}

          {/* Habitat Rows */}
          {renderHabitatRow('md-leaf', 'Forest', 'forest')}
          {renderHabitatRow('md-hill', 'Mountain', 'mountain')}
          {renderHabitatRow('water', 'River', 'river')}
          {renderHabitatRow('md-grass', 'Field', 'field')}
          {renderHabitatRow('md-water', 'Wetland', 'wetland')}

          {/* Nature Tokens */}
          {renderRow('md-leaf', 'Nature Tokens', 'natureTokens')}

          {/* Totals */}
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.label}>Total</Text>
            </View>
            {totals.map((total, index) => (
              <View key={index} style={styles.totalContainer}>
                <Text style={styles.totalText}>{total}</Text>
              </View>
            ))}
          </View>

          {/* Reset Button */}
          <TouchableOpacity style={styles.resetButton} onPress={resetScores}>
            <Text style={styles.resetButtonText}>Reset Game</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // beige background like original Cascadia board
  },
  scrollContent: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#8B4513', // brown header
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  leftColumn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  headerLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  headerInputContainer: {
    flex: 1,
    paddingHorizontal: 2,
  },
  headerInput: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 3,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    marginLeft: 8,
    fontWeight: '500',
    color: '#333',
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 2,
  },
  doubleInputContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 2,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    textAlign: 'center',
    fontSize: 16,
  },
  habitatInput: {
    flex: 1,
    marginHorizontal: 1,
  },
  totalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  resetButton: {
    backgroundColor: '#8B4513',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});