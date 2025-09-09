import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Card, Button, Divider } from "react-native-paper";
import { supabase } from "./supabaseClient";

export default function DoctorDashboardScreen({ route, navigation }) {
  const doctorEmail = route.params?.profile?.email || "";
  const doctorName = route.params?.profile?.name || "";
  const [patients, setPatients] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // Fetch patients assigned to this doctor
  useEffect(() => {
    supabase
      .from("patients")
      .select("*")
      .eq("doctor_email", doctorEmail)
      .then(({ data }) => setPatients(data || []));
  }, [doctorEmail]);

  // Fetch today's schedule
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from("schedule")
      .select("*")
      .eq("doctor_email", doctorEmail)
      .eq("date", today)
      .then(({ data }) => setSchedule(data || []));
  }, [doctorEmail]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f9fafc",
      }}
    >
      {/* Header */}
      <Card style={{ marginBottom: 20, backgroundColor: "#1976d2" }}>
        <Card.Content>
          <Text
            variant="headlineMedium"
            style={{ color: "white", fontWeight: "bold" }}
          >
            Welcome, Dr. {doctorName}
          </Text>
          <Text style={{ color: "white", marginTop: 5, fontSize: 16 }}>
            You have {patients.length} patients under your care.
          </Text>
        </Card.Content>
      </Card>

      {/* Add Patient Button */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate("AddPatient", { doctorEmail })}
        style={{
          marginBottom: 20,
          backgroundColor: "#388e3c",
          borderRadius: 10,
          paddingVertical: 5,
        }}
        labelStyle={{ fontSize: 16 }}
      >
        ➕ Add New Patient
      </Button>

      {/* Schedule Section */}
      <Card style={{ marginBottom: 20, borderRadius: 12 }}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={{ fontWeight: "bold", marginBottom: 10 }}
          >
            📅 Today's Schedule
          </Text>
          <Divider style={{ marginBottom: 10 }} />
          {schedule.length === 0 ? (
            <Text>No appointments scheduled for today.</Text>
          ) : (
            schedule.map((item) => (
              <Card
                key={item.id}
                style={{
                  marginBottom: 10,
                  borderRadius: 10,
                  backgroundColor: "#e3f2fd",
                }}
              >
                <Card.Content>
                  <Text style={{ fontWeight: "bold" }}>🕒 {item.time}</Text>
                  <Text>👤 {item.patient_name}</Text>
                  <Text>📝 {item.notes}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Patients Section */}
      <Card style={{ marginBottom: 20, borderRadius: 12 }}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={{ fontWeight: "bold", marginBottom: 10 }}
          >
            👥 Patients List
          </Text>
          <Divider style={{ marginBottom: 10 }} />
          {patients.length === 0 ? (
            <Text>No patients assigned yet.</Text>
          ) : (
            patients.map((patient) => (
              <Card
                key={patient.id}
                style={{
                  marginBottom: 10,
                  borderRadius: 10,
                  backgroundColor: "#fff3e0",
                }}
              >
                <Card.Content>
                  <Text style={{ fontWeight: "bold" }}>
                    {patient.name}
                  </Text>
                  <Text>{patient.email}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
