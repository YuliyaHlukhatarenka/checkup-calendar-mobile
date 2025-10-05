import {View, TextInput, Modal, TouchableOpacity, Text} from 'react-native';
import {styles} from './questionary.styles';
import {useState} from 'react';

type QuestionaryProps = {
  handleGenerate: (
    age: string,
    gender: 'male' | 'female' | '',
    condition: string,
  ) => Promise<void>;
};

export const Questionary = ({handleGenerate}: QuestionaryProps) => {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [condition, setCondition] = useState<string>('');
  return (
    <>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, {flex: 1, minHeight: 40, marginRight: 8}]}
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
          onPress={() => setGender('male')}>
          <Text style={styles.genderButtonText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === 'female' && styles.genderButtonSelected,
          ]}
          onPress={() => setGender('female')}>
          <Text style={styles.genderButtonText}>Female</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[
          styles.input,
          {minHeight: 40, marginHorizontal: 16, marginBottom: 8},
        ]}
        placeholder="Enter conditions (e.g., гипотиреоз)"
        value={condition}
        onChangeText={setCondition}
      />
      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => handleGenerate(age, gender, condition)}>
        <Text style={styles.buttonText}>Go</Text>
      </TouchableOpacity>
    </>
  );
};
