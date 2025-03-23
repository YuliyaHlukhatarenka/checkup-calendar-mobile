import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState({});
  const [showInput, setShowInput] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [markedDates, setMarkedDates] = useState({});

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

  const updateMarkedDates = (taskData) => {
    const marked = {};
    Object.keys(taskData).forEach(date => {
      marked[date] = { marked: true, dotColor: '#50cebb' };
    });
    setMarkedDates(marked);
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    if (tasks[day.dateString]) {
      setCurrentTask(tasks[day.dateString]);
    } else {
      setCurrentTask('');
    }
    setShowInput(true);
  };

  const saveTask = async () => {
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
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#2d4150',
          selectedDayBackgroundColor: '#50cebb',
          dotColor: '#50cebb',
        }}
      />

      <Modal
        visible={showInput}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Task for {selectedDate}</Text>
            <TextInput
              style={styles.input}
              value={currentTask}
              onChangeText={setCurrentTask}
              placeholder="Enter your task"
              multiline
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
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '40%',
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
  },
});

export default TaskCalendar;