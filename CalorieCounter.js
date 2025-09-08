import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button, Modal, Portal, Provider as PaperProvider } from 'react-native-paper';

const foods = [
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'Rice (1 cup)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
  { name: 'Egg (boiled)', calories: 68, protein: 6.3, carbs: 0.6, fat: 4.8 },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Paneer (100g)', calories: 265, protein: 18, carbs: 1.2, fat: 20 },
  { name: 'Chapati (1 medium)', calories: 104, protein: 3, carbs: 21, fat: 0.4 },
  { name: 'Milk (1 cup)', calories: 103, protein: 8, carbs: 12, fat: 2.4 },
  { name: 'Almonds (10)', calories: 70, protein: 2.6, carbs: 2.5, fat: 6.1 },
  { name: 'Curd (100g)', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3 },
  // Add more foods as needed
];

function CalorieCounter() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [addedFoods, setAddedFoods] = useState([]);

  const handleFoodPress = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const handleAddFood = () => {
    setTotalCalories(totalCalories + selectedFood.calories);
    setAddedFoods([...addedFoods, selectedFood]);
    setModalVisible(false);
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#f3f6fa', flexGrow: 1 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 20, color: '#388e3c', textAlign: 'center' }}>
          Calorie Counter
        </Text>
        <Text style={{ fontSize: 18, marginBottom: 10, color: '#1976d2', textAlign: 'center' }}>
          Total Calories Today: {totalCalories}
        </Text>
        <View style={{ marginBottom: 20 }}>
          {addedFoods.length > 0 && (
            <Text style={{ fontWeight: 'bold', color: '#388e3c', marginBottom: 8 }}>Foods Added:</Text>
          )}
          {addedFoods.map((food, idx) => (
            <Text key={idx} style={{ color: '#4e342e', fontSize: 15 }}>
              • {food.name} ({food.calories} kcal)
            </Text>
          ))}
        </View>
        <Text style={{ fontSize: 16, marginBottom: 10, color: '#2e7d32' }}>Foods:</Text>
        {foods.map((food, idx) => (
          <Card key={idx} style={{ marginBottom: 12, borderRadius: 14 }} onPress={() => handleFoodPress(food)}>
            <Card.Title title={food.name} subtitle={`${food.calories} kcal`} />
          </Card>
        ))}
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 24, margin: 24, borderRadius: 16 }}>
            {selectedFood && (
              <View>
                <Text variant="titleLarge" style={{ color: '#388e3c', marginBottom: 10 }}>{selectedFood.name}</Text>
                <Text style={{ marginBottom: 6 }}>Calories: {selectedFood.calories} kcal</Text>
                <Text style={{ marginBottom: 6 }}>Protein: {selectedFood.protein} g</Text>
                <Text style={{ marginBottom: 6 }}>Carbs: {selectedFood.carbs} g</Text>
                <Text style={{ marginBottom: 6 }}>Fat: {selectedFood.fat} g</Text>
                <Button mode="contained" style={{ marginTop: 10 }} onPress={handleAddFood}>
                  Add to Calorie Count
                </Button>
                <Button mode="outlined" style={{ marginTop: 10 }} onPress={() => setModalVisible(false)}>
                  Cancel
                </Button>
              </View>
            )}
          </Modal>
        </Portal>
      </ScrollView>
    </PaperProvider>
  );
}

export default CalorieCounter;