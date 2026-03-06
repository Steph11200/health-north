import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { API_BASE_URL } from "../config/api";

export default function LoginScreen({ onLogin }) {

  const [email, setEmail] = useState("stephanie@mail.com");
  const [motDePasse, setMotDePasse] = useState("password123");

  const login = async () => {

    try {

      const response = await fetch(`${API_BASE_URL}/auth/patient/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          motDePasse
        })
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erreur", data.message);
        return;
      }

      onLogin(data.token);

    } catch (error) {
      Alert.alert("Erreur réseau", "API non accessible");
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20 }}>

      <Text style={{ fontSize:28, marginBottom:20 }}>
        Connexion patient
      </Text>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth:1, padding:10, marginBottom:10 }}
      />

      <Text>Mot de passe</Text>
      <TextInput
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
        style={{ borderWidth:1, padding:10, marginBottom:20 }}
      />

      <Button title="Se connecter" onPress={login} />

    </View>
  );
}