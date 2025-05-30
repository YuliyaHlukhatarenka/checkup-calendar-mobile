import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native';

const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [tasks, setTasks] = useState<{ [date: string]: string }>({});
  const [showInput, setShowInput] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean; dotColor: string } }>({});
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [points, setPoints] = useState<string[]>([]);
  console.log('tasks', tasks)

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
        updateMarkedDates(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const updateMarkedDates = (taskData: any) => {
    const marked: { [key: string]: { marked: boolean; dotColor: string } } = {};
    Object.keys(taskData).forEach(date => {
      marked[date] = { marked: true, dotColor: '#50cebb' };
    });
    setMarkedDates(marked);
  };

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    if (tasks[day.dateString]) {
      setCurrentTask(tasks[day.dateString]);
    } else {
      setCurrentTask('');
    }
    setShowInput(true);
  };

  const handleGenerate = () => {
    // Example logic: you can replace this with your own
    const generatedPoints: string[] = [];
    if (!age || !gender) return;
    if (gender === 'male') {
      generatedPoints.push('Check blood pressure');
      if (parseInt(age) > 40) generatedPoints.push('Prostate exam');
    } else if (gender === 'female') {
      generatedPoints.push('Mammogram');
      if (parseInt(age) > 21) generatedPoints.push('Pap smear');
    }
    setPoints(generatedPoints);
  };

  const saveTask = async () => {
    if (!currentTask.trim()) {
      setShowInput(false);
      return;
    }
    
    try {
      const newTasks = {
        ...tasks,
        [selectedDate]: currentTask
      };
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      setTasks(newTasks);
      updateMarkedDates(newTasks);
      setShowInput(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CheckUP Planner</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, minHeight: 40, marginRight: 8 }]}
          placeholder="Enter age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === 'male' && styles.genderButtonSelected,
          ]}
          onPress={() => setGender('male')}
        >
          <Text style={styles.genderButtonText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === 'female' && styles.genderButtonSelected,
          ]}
          onPress={() => setGender('female')}
        >
          <Text style={styles.genderButtonText}>Female</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Go</Text>
      </TouchableOpacity>
      {points.length > 0 && (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Points to be done:</Text>
          <FlatList
            data={points}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => <Text>- {item}</Text>}
          />
        </View>
      )}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#2d4150',
          selectedDayBackgroundColor: '#50cebb',
          dotColor: '#50cebb',
          arrowColor: '#50cebb',
          monthTextColor: '#2d4150',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14
        }}
      />

      <Modal
        visible={showInput}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {tasks[selectedDate] ? 'View/Edit Task' : 'Add New Task'}
            </Text>
            <Text style={styles.dateText}>{selectedDate}</Text>
            <TextInput
              style={styles.input}
              value={currentTask}
              onChangeText={setCurrentTask}
              placeholder="Enter your task"
              multiline
              autoFocus
              onSubmitEditing={saveTask}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={saveTask}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setShowInput(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#2d4150',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#2d4150',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 100,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    width: '45%',
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#50cebb',
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  genderButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#50cebb',
    marginLeft: 4,
    backgroundColor: '#fff',
  },
  genderButtonSelected: {
    backgroundColor: '#50cebb',
  },
  genderButtonText: {
    color: '#2d4150',
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#50cebb',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
});

export default TaskCalendar;