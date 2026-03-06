import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import LoginScreen from "../../src/screens/LoginScreen";
import ProfileScreen from "../../src/screens/ProfileScreen";
import RendezVousScreen from "../../src/screens/RendezVousScreen";
import PrescriptionsScreen from "../../src/screens/PrescriptionsScreen";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [page, setPage] = useState<"menu" | "profil" | "rdv" | "presc">("menu");

  if (!token) return <LoginScreen onLogin={setToken} />;

  const goMenu = () => setPage("menu");

  if (page === "profil") return <ProfileScreen token={token} onBack={goMenu} />;
  if (page === "rdv") return <RendezVousScreen token={token} onBack={goMenu} />;
  if (page === "presc") return <PrescriptionsScreen token={token} onBack={goMenu} />;

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 10 }}>
        Espace patient
      </Text>

      <TouchableOpacity
        onPress={() => setPage("profil")}
        style={{ padding: 14, borderRadius: 10, borderWidth: 1 }}
      >
        <Text>Mon profil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setPage("rdv")}
        style={{ padding: 14, borderRadius: 10, borderWidth: 1 }}
      >
        <Text>Mes rendez-vous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setPage("presc")}
        style={{ padding: 14, borderRadius: 10, borderWidth: 1 }}
      >
        <Text>Mes prescriptions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setToken(null);
          setPage("menu");
        }}
        style={{ padding: 14, borderRadius: 10, borderWidth: 1, marginTop: 20 }}
      >
        <Text>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}