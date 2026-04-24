import { UserContext } from "@/contexts/UserContext";
import fetchData from "@/hooks/fetchData";
import { Redirect, useRootNavigationState, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";

type SinistreType = {
  id: number | string;
  plate?: string;
  sinister_datetime?: any;
  context?: string;
};

export default function Index() {
  const router = useRouter();
  const [sinistres, setSinistres] = useState<SinistreType[]>();
  const rootNavigationState = useRootNavigationState();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchData("/sinisters", "GET", {}, true)
      .then((data) => {
        const { sinisters } = data;
        setSinistres(sinisters);

        console.log("Sinistres loaded : ", sinisters);
      })
      .catch((err) => {
        console.log("Erreur " + err.message);
      });
  }, []);

  if (!user) {
    console.log("REDIRECT TO LOGIN....", user);
    return <Redirect href="/login" />;
  }

  if (rootNavigationState?.key) {
    return (
      <ScrollView>
        {sinistres?.map((sinistre: SinistreType) => (
          <Card key={sinistre.id} style={styles.card}>
            <Card.Title
              title={"Sinistre n°" + sinistre.id}
              subtitle={sinistre.context}
            />
            <Card.Content>
              <Text variant="titleLarge">Véhicule : {sinistre.plate}</Text>
              <Text variant="bodyMedium">
                Soumis le : {sinistre.sinister_datetime}
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
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#dbcae2",
  },
});
