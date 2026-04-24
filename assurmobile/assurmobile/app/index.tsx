import { UserContext } from "@/contexts/UserContext";
import fetchData from "@/hooks/fetchData";
import { Redirect, useRootNavigationState, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, FAB, Text } from "react-native-paper";

type SinistreType = {
  id: number | string;
  plate?: string;
  sinister_datetime?: any;
  context?: string;
};

export default function Index() {
  const router = useRouter();
  const [sinistres, setSinistres] = useState<SinistreType[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const rootNavigationState = useRootNavigationState();
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Recupération des sinistres
    if (user) {
      fetchData("/sinisters", "GET", {}, true)
        .then((data) => {
          const { sinisters } = data;
          setSinistres(sinisters);
          console.log("Sinistres loaded : ", sinisters);
        })
        .catch((err) => {
          console.log("Erreur " + err.message);
        })
        .finally(() => setLoadingData(false));
    }
  }, [user]); // Re-déclenche si le user change

  if (!rootNavigationState?.key) {
    return null;
  }

  // Redirection vers login si pas connecté
  if (!user) {
    console.log("REDIRECT TO LOGIN....");
    return <Redirect href="/login" />;
  }

  // Affichage si connecté
  if (loadingData && sinistres.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Mes Sinistres
        </Text>
        {sinistres.map((sinistre: SinistreType) => (
          <Card key={sinistre.id} style={styles.card}>
            <Card.Title
              title={"Sinistre n°" + sinistre.id}
              subtitle={sinistre.context}
            />
            <Card.Content>
              <Text variant="titleLarge">Véhicule : {sinistre.plate}</Text>
              <Text variant="bodyMedium">
                Soumis le :{" "}
                {new Date(sinistre.sinister_datetime).toLocaleDateString()}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() =>
                  router.push({
                    pathname: "/sinistre/[id]",
                    params: { id: sinistre.id },
                  })
                }
              >
                Accéder au sinistre
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        label="Déclarer un sinistre"
        style={styles.fab}
        onPress={() => router.push("/sinistre/new")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    margin: 20,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 15,
    marginHorizontal: 10,
    backgroundColor: "#dbcae2",
    elevation: 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
});
