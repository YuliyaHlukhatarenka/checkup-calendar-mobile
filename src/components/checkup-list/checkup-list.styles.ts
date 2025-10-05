import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  listContainer: {
    marginVertical: 10,
    flex: 1,
    maxHeight: 150,
  },
  listTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
    color: '#2d4150',
  },
  listItem: {
    fontSize: 14,
    marginBottom: 3,
    paddingHorizontal: 5,
    color: '#333',
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
