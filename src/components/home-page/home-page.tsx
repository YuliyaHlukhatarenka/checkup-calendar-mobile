import React, {useState, useEffect} from 'react';
import {View, TextInput, Modal, TouchableOpacity, Text} from 'react-native';
import {Calendar} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native';
import {styles} from './home-page.styles';
import {Questionary} from '../questionary/questionary';
import {CheckupList} from '../checkup-list/checkup-list';
import { AIkey } from '../../../config';

const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [tasks, setTasks] = useState<{[date: string]: string}>({});
  const [showInput, setShowInput] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<{
    [date: string]: {marked: boolean; dotColor: string};
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [points, setPoints] = useState<string[]>([]);
  console.log('tasks', tasks);

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
    const marked: {[key: string]: {marked: boolean; dotColor: string}} = {};
    Object.keys(taskData).forEach(date => {
      marked[date] = {marked: true, dotColor: '#50cebb'};
    });
    setMarkedDates(marked);
  };

  const handleDayPress = (day: {dateString: string}) => {
    setSelectedDate(day.dateString);
    if (tasks[day.dateString]) {
      setCurrentTask(tasks[day.dateString]);
    } else {
      setCurrentTask('');
    }
    setShowInput(true);
  };

  const generateCheckupListAI = async (
    age: string,
    gender: string,
    condition: string,
  ): Promise<string[]> => {
    const prompt = `Suggest a list of medical checkups for a ${age}-year-old ${gender} with the following condition(s): ${condition}. Return the list as bullet points.`;

    const info = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro?key=${AIkey}`,
      {method: 'GET'},
    );

    const dataInfo = await info.json();
    console.log('AI methods:', dataInfo);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${AIkey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{text: prompt}],
            },
          ],
        }),
      },
    );

    const data = await response.json();
    console.log('AI response:', data);
    // Gemini returns text in data.candidates[0].content.parts[0].text
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Split into array by line breaks or dashes
    const points = text
      .split('\n')
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 0);

    return points;
  };

  const handleGenerate = async (
    age: string,
    gender: 'male' | 'female' | '',
    condition: string,
  ) => {
    if (!age || !gender) return;
    setLoading(true);
    try {
      const generatedPoints = await generateCheckupListAI(
        age,
        gender,
        condition,
      );
      setPoints(generatedPoints);
    } catch (e) {
      setPoints(['Error generating checkup list.']);
    }
    setLoading(false);
  };

  const saveTask = async () => {
    if (!currentTask.trim()) {
      setShowInput(false);
      return;
    }

    try {
      const newTasks = {
        ...tasks,
        [selectedDate]: currentTask,
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
      <Questionary handleGenerate={handleGenerate} />
      <CheckupList points={points} loading={loading} />
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
          textDayHeaderFontSize: 14,
        }}
      />
      <Modal visible={showInput} transparent={true} animationType="slide">
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
                onPress={saveTask}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowInput(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskCalendar;
