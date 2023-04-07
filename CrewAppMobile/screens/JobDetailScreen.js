// screens/JobDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Linking } from 'react-native';
import axios from 'axios';
import {BACKEND_URL} from '@env'

const JobDetailScreen = ({ route, navigation }) => {
  const { jobId, crewId } = route.params;
  const [jobDetails, setJobDetails] = useState(null);
  const [crewNotes, setCrewNotes] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);
  const [assignedJobId, setAssignedJobId] = useState(null);
  const [checklist, setChecklist] = useState({
    mow: false,
    edge: false,
    blow: false,
  });
  const [initialChecklist, setInitialChecklist] = useState({
    mow: false,
    edge: false,
    blow: false,
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/schedules/jobs/${jobId}/`);
        const job = response.data;
        setJobDetails(job);
        const initialState = {
          mow: job.mow,
          edge: job.edge,
          blow: job.blow,
        };
        setInitialChecklist(initialState);
        setChecklist(initialState);

        if (job.status === 4) {
          const assignedJobResponse = await axios.get(`${BACKEND_URL}/schedules/assignedjobs/?job=${jobId}&crew=${crewId}`);
          const assignedJob = assignedJobResponse.data[0]; // assuming only one assigned job per jobId and crewId
          setAssignedJobId(assignedJob.id);
          setStartHour(new Date(assignedJob.start_hour));
          setEndHour(new Date(assignedJob.end_hour));
          setCrewNotes(assignedJob.crew_notes);
          setChecklist({
            mow: assignedJob.mow,
            edge: assignedJob.edge,
            blow: assignedJob.blow,
          });
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Failed to load job details', 'An error occurred while fetching job details.');
      }
    };

    fetchJobDetails();
  }, [jobId, crewId]);

  const handleStartJob = async () => {
    const startTime = new Date();
    setStartHour(startTime);
    setIsStarted(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/schedules/assignedjobs/`, {
        job: jobId,
        crew: crewId,
        start_hour: startTime,
        mow: checklist.mow,
        edge: checklist.edge,
        blow: checklist.blow,
        active: true,
      });
      setAssignedJobId(response.data.id); // Update assignedJobId from the response

      // Update job status to 'In Progress'
      await axios.patch(`${BACKEND_URL}/schedules/jobs/${jobId}/`, {
        status: 3, // In Progress
      });

      Alert.alert('Job started', 'The job has been started successfully.');
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to start job', 'An error occurred while starting the job.');
    }
  };

  const handleEndJob = async () => {
    const endTime = new Date();
    setEndHour(endTime);

    try {
      await axios.patch(`${BACKEND_URL}/schedules/assignedjobs/${assignedJobId}/`, {
        end_hour: endTime,
        crew_notes: crewNotes,
        mow: checklist.mow,
        edge: checklist.edge,
        blow: checklist.blow,
        active: false,
      });

      // Update job status to 'Done'
      await axios.patch(`${BACKEND_URL}/schedules/jobs/${jobId}/`, {
        status: 4, // Done
      });

      Alert.alert('Job ended', 'The job has been completed successfully.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to end job', 'An error occurred while ending the job.');
    }
  };

  const toggleChecklistItem = (item) => {
    if (initialChecklist[item]) {
      setChecklist((prevState) => ({
        ...prevState,
        [item]: !prevState[item],
      }));
    }
  };

  const renderChecklistItem = (label, value, stateKey) => {
    const isDisabled = !initialChecklist[stateKey];
    return (
      <TouchableOpacity
        style={[styles.checklistItem, isDisabled && styles.disabled]}
        key={label}
        onPress={() => toggleChecklistItem(stateKey)}
        disabled={isDisabled}
      >
        <View style={[styles.checkbox, value && styles.checkboxSelected]} />
        <Text style={styles.checklistText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const formatTime = (date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const calculateTotalTime = (start, end) => {
    if (!start || !end) return '';
    const timeDiff = (end - start) / 3600000; // difference in hours
    return timeDiff.toFixed(2);
  };

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    console.log('Opening Google Maps with URL:', url);
    Linking.openURL(url).catch((err) => console.error('Failed to open Google Maps', err));
  };

  if (!jobDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{jobDetails.customer_data.fullname}</Text>
      <TouchableOpacity onPress={() => openGoogleMaps(jobDetails.customer_data.latitude, jobDetails.customer_data.longitude)}>
        <Text style={[styles.subtitle, styles.link]}>{jobDetails.customer_data.address}</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Estimated time: {jobDetails.total_man_hours} hours</Text>
      <Text style={styles.subtitle}>Instructions for crew: {jobDetails.instructions_for_crew}</Text>

      <View style={styles.checklist}>
        <Text style={styles.checklistTitle}>Checklist:</Text>
        {renderChecklistItem('Mow', checklist.mow, 'mow')}
        {renderChecklistItem('Edge', checklist.edge, 'edge')}
        {renderChecklistItem('Blow', checklist.blow, 'blow')}
        {/* Add more checklist items as needed */}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Crew Notes"
        value={crewNotes}
        onChangeText={setCrewNotes}
        editable={jobDetails.status !== 4}
      />

      {startHour && <Text style={styles.timeText}>Start Time: {formatTime(startHour)}</Text>}
      {endHour && <Text style={styles.timeText}>End Time: {formatTime(endHour)}</Text>}
      {startHour && endHour && (
        <Text style={styles.timeText}>Total Time Spent: {calculateTotalTime(startHour, endHour)} hours</Text>
      )}

      {jobDetails.status === 4 ? (
        <Text style={styles.doneText}>The job is done</Text>
      ) : isStarted ? (
        <TouchableOpacity style={styles.endButton} onPress={handleEndJob}>
          <Text style={styles.buttonText}>End Job</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.startButton} onPress={handleStartJob}>
          <Text style={styles.buttonText}>Start Job</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#343a40',
  },
  subtitle: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 10,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  checklist: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  checklistTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007BFF',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#007BFF',
    marginRight: 12,
    borderRadius: 4,
  },
  checkboxSelected: {
    backgroundColor: '#007BFF',
  },
  disabled: {
    opacity: 0.5,
  },
  checklistText: {
    fontSize: 18,
    color: '#495057',
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  timeText: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 10,
  },
  doneText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  startButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  endButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JobDetailScreen;
