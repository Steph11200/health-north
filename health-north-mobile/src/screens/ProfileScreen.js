import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { API_BASE_URL } from "../config/api";

export default function ProfileScreen({ token, onBack }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setPatient(data);
      } catch (e) {
        setPatient({ error: "Erreur réseau" });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  if (!patient || patient.error) {
    return (
      <View style={{ padding: 20 }}>
        <Text>{patient?.error || "Erreur chargement profil"}</Text>
      </View>
    );
  }

  return (
    
    <View style={{ padding: 20 }}>
      <Text onPress={onBack} style={{ marginBottom: 10, color: "blue" }}>
         ← Retour
      </Text>
      <Text style={{ fontSize: 26, marginBottom: 12 }}>Mon profil</Text>

      <Text>Nom : {patient.nom}</Text>
      <Text>Prénom : {patient.prenom}</Text>
      <Text>Email : {patient.email}</Text>
      <Text>Téléphone : {patient.telephone}</Text>
      <Text>Adresse : {patient.adressePostale}</Text>
    </View>
  );
}