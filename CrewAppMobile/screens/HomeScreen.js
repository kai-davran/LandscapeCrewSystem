// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import {BACKEND_URL} from '@env'

// Function to get today's date and day of the week
const getTodayInfo = () => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  const day = daysOfWeek[today.getDay()];
  const date = today.toISOString().split('T')[0];
  return { day, date };
};

const HomeScreen = ({ navigation, route }) => {
  const [jobs, setJobs] = useState([]);
  const { crewId, crewName } = route.params; // Get crewId and crewName from route params
  const [dateInfo, setDateInfo] = useState(getTodayInfo());

  console.log("Date", dateInfo.date)
  console.log("Crew", crewId)


  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/schedules/jobs/?date=${dateInfo.date}&crew=${crewId}`);
      setJobs(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to load jobs', 'An error occurred while fetching job data.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
    }, [dateInfo, crewId])
  );

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Scheduled';
      case 3:
        return 'In Progress';
      case 4:
        return 'Done';
      default:
        return 'Unknown';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 4:
        return { color: 'red', fontWeight: 'bold' };
      case 3:
        return { color: '#4CAF50', fontWeight: 'bold' };
      case 1:
      default:
        return { color: 'gray', fontWeight: 'bold' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>{crewName}</Text>
        <Text style={styles.subtitle}>{`${dateInfo.day} - ${dateInfo.date}`}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clockButton} onPress={() => {}}>
          <Text style={styles.clockButtonText}>Clock In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.clockButton, styles.clockOutButton]} onPress={() => {}}>
          <Text style={[styles.clockButtonText, styles.clockOutButtonText]}>Clock Out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('JobDetail', { jobId: item.id, crewId })}>
            <View style={styles.jobCard}>
              <Text style={styles.jobName}>#{item.id} {item.customer_data.fullname}</Text>
              <Text style={styles.jobDetailText}>{item.customer_data.address}</Text>
              <Text style={styles.jobDetailText}>Last visit date: {item.last_visit_date || 'N/A'}</Text>
              <Text style={styles.jobDetailText}>${item.gross_revenue}</Text>
              <Text style={[styles.jobStatus, getStatusStyle(item.status)]}>{getStatusText(item.status)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.assistantButton} onPress={() => navigation.navigate('Chatbot')}>
        <Image source={require('../assets/chatbot-logo.png')} style={styles.assistantLogo} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
  },
  subtitle: {
    fontSize: 20,
    color: '#495057',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  clockButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  clockOutButton: {
    backgroundColor: '#f44336',
  },
  clockButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clockOutButtonText: {
    color: 'white',
  },
  jobCard: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  jobName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  jobDetailText: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 4,
  },
  jobStatus: {
    marginTop: 8,
    fontSize: 18,
  },
  assistantButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  assistantLogo: {
    width: 50,
    height: 50,
  },
});

export default HomeScreen;
