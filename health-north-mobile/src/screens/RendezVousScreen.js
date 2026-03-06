import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { API_BASE_URL } from "../config/api";

export default function RendezVousScreen({ token, onBack }) {
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me/rendezvous`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRdvs(Array.isArray(data) ? data : []);
      } catch (e) {
        setRdvs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={{ padding: 20 }}>
      <Text onPress={onBack} style={{ marginBottom: 10, color: "blue" }}>
         ← Retour
      </Text>  
      <Text style={{ fontSize: 26, marginBottom: 12 }}>Mes rendez-vous</Text>

      {rdvs.length === 0 ? (
        <Text>Aucun rendez-vous trouvé.</Text>
      ) : (
        <FlatList
          data={rdvs}
          keyExtractor={(item) => String(item.idRdv)}
          renderItem={({ item }) => (
            <View style={{ padding: 12, borderWidth: 1, marginBottom: 10, borderRadius: 10 }}>
              <Text style={{ fontWeight: "bold" }}>
                {item.dateRdv} à {item.heureRdv}
              </Text>
              <Text>Type : {item.typeIntervention} ({item.statut})</Text>
              <Text>Spécialiste : {item.specialistePrenom} {item.specialisteNom} ({item.specialite})</Text>
              <Text>Lieu : {item.etablissementNom} - {item.ville}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}