import fetchData from "@/hooks/fetchData";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    ProgressBar,
    RadioButton,
    Text,
    TextInput,
} from "react-native-paper";

export default function NewSinisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // États du formulaire
  const [formData, setFormData] = useState({
    plate: "",
    driver_firstname: "",
    driver_lastname: "",
    sinister_datetime: new Date().toISOString().slice(0, 16), // Format YYYY-MM-DDTHH:mm
    context: "",
    driver_engaged_responsability: "0",
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const response = await fetchData(
        "/sinisters",
        "POST",
        {
          ...formData,
          driver_engaged_responsability: parseInt(
            formData.driver_engaged_responsability,
          ),
        },
        true,
      );

      Alert.alert("Succès", "Sinistre déclaré et dossier créé !");
      router.replace("/"); // Retour à la liste
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Déclaration de Sinistre
      </Text>

      <ProgressBar
        progress={step / totalSteps}
        color="#6200ee"
        style={styles.progress}
      />
      <Text style={styles.stepText}>
        Étape {step} sur {totalSteps}
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          {step === 1 && (
            <View>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Véhicule & Conducteur
              </Text>
              <TextInput
                label="Plaque d'immatriculation"
                value={formData.plate}
                onChangeText={(t) => setFormData({ ...formData, plate: t })}
                mode="outlined"
                placeholder="AB-123-CD"
                style={styles.input}
              />
              <TextInput
                label="Prénom du conducteur"
                value={formData.driver_firstname}
                onChangeText={(t) =>
                  setFormData({ ...formData, driver_firstname: t })
                }
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Nom du conducteur"
                value={formData.driver_lastname}
                onChangeText={(t) =>
                  setFormData({ ...formData, driver_lastname: t })
                }
                mode="outlined"
                style={styles.input}
              />
            </View>
          )}

          {step === 2 && (
            <View>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Circonstances
              </Text>
              <TextInput
                label="Date et Heure (ISO)"
                value={formData.sinister_datetime}
                onChangeText={(t) =>
                  setFormData({ ...formData, sinister_datetime: t })
                }
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Description des faits"
                value={formData.context}
                onChangeText={(t) => setFormData({ ...formData, context: t })}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
              />
              <Text style={{ marginTop: 10 }}>Responsabilité engagée ?</Text>
              <RadioButton.Group
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    driver_engaged_responsability: value,
                  })
                }
                value={formData.driver_engaged_responsability}
              >
                <RadioButton.Item label="Non (0%)" value="0" />
                <RadioButton.Item label="Partielle (50%)" value="50" />
                <RadioButton.Item label="Totale (100%)" value="100" />
              </RadioButton.Group>
            </View>
          )}

          {step === 3 && (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text variant="titleMedium">Récapitulatif & Documents</Text>
              <Text variant="bodyMedium" style={{ marginVertical: 10 }}>
                Véhicule : {formData.plate}
              </Text>
              <Button
                icon="camera"
                mode="outlined"
                onPress={() =>
                  Alert.alert("Note", "Nous intégrerons Expo Image Picker ici.")
                }
                style={styles.input}
              >
                Prendre photo du constat
              </Button>
              <Text variant="bodySmall" style={{ color: "gray" }}>
                Les documents pourront aussi être ajoutés plus tard dans le
                suivi du dossier.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.navButtons}>
        {step > 1 && (
          <Button mode="outlined" onPress={prevStep} style={styles.flexBtn}>
            Retour
          </Button>
        )}
        {step < totalSteps ? (
          <Button mode="contained" onPress={nextStep} style={styles.flexBtn}>
            Suivant
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.flexBtn, { backgroundColor: "green" }]}
          >
            Confirmer la déclaration
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  title: { margin: 20, textAlign: "center", fontWeight: "bold" },
  progress: { marginHorizontal: 20, height: 8, borderRadius: 5 },
  stepText: { textAlign: "center", marginVertical: 10, color: "#666" },
  card: { margin: 15, elevation: 3 },
  sectionTitle: { marginBottom: 15, color: "#6200ee" },
  input: { marginBottom: 12 },
  navButtons: { flexDirection: "row", padding: 15, gap: 10 },
  flexBtn: { flex: 1 },
});
