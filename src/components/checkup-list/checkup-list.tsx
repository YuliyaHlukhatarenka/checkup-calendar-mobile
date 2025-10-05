import {ActivityIndicator, FlatList} from 'react-native';
import {View, Text} from 'react-native';
import {styles} from './checkup-list.styles';
import {useState} from 'react';

type CheckupListProps = {
  points: string[];
  loading: boolean;
};

export const CheckupList = ({points, loading}: CheckupListProps) => (
  <View style={styles.container}>
    <Text style={styles.header}>CheckUP Planner</Text>
    {loading && <ActivityIndicator size="small" color="#50cebb" />}
    {points.length > 0 && !loading && (
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          Points to be done:
        </Text>
        <FlatList
          data={points}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({item}) => <Text style={styles.listItem}>- {item}</Text>}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        />
      </View>
    )}
  </View>
);
