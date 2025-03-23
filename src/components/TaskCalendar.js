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
      <Text style={styles.header}>Task Calendar</Text>
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
});

export default TaskCalendar;