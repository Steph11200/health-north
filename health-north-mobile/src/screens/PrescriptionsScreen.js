import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { API_BASE_URL } from "../config/api";

export default function PrescriptionsScreen({ token, onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me/prescriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={{ padding: 20, flex: 1 }}>
        <Text onPress={onBack} style={{ marginBottom: 10, color: "blue" }}>
             ← Retour
        </Text>
      <Text style={{ fontSize: 26, marginBottom: 12 }}>Mes prescriptions</Text>

      {items.length === 0 ? (
        <Text>Aucune prescription.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(p) => String(p.idPrescription)}
          renderItem={({ item }) => (
            <View style={{ borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10 }}>
              <Text style={{ fontWeight: "700" }}>
                {item.datePrescription} • RDV #{item.rdv?.idRdv} • {item.rdv?.typeIntervention}
              </Text>
              <Text style={{ marginTop: 6 }}>{item.commentaire || "—"}</Text>

              <Text style={{ marginTop: 10, fontWeight: "700" }}>Médicaments :</Text>
              {item.medicaments?.length ? (
                item.medicaments.map((m) => (
                  <Text key={m.idMedicament} style={{ marginTop: 4 }}>
                    • {m.nom} {m.dosage || ""} — {m.posologie} ({m.dureeJours}j)
                  </Text>
                ))
              ) : (
                <Text style={{ marginTop: 4 }}>Aucun médicament associé.</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}