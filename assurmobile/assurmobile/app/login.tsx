import { UserContext } from "@/contexts/UserContext";
import fetchData from "@/hooks/fetchData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { View } from "react-native";
import { Button, Card, HelperText, Text, TextInput } from "react-native-paper";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Ajout d'un état loading
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const login = async () => {
    setLoading(true);
    try {
      const data = await fetchData(
        "/auth/login",
        "POST",
        { email, password },
        false,
      );

      const { token, user } = data;

      // Stockage du token
      await AsyncStorage.setItem("token", token);

      // Mise à jour du contexte avec les infos de l'utilisateur
      setUser(user);
      console.log("User set in context : ", user);

      setError(null);

      // Redirection vers la page d'accueil
      router.replace("/");
    } catch (err: any) {
      console.log("Login error ", err);
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Card>
        <Card.Content>
          <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
            Connexion
          </Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Mot de passe"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            mode="outlined"
            style={{ marginBottom: 10 }}
          />
          {error && (
            <HelperText type="error" visible={Boolean(error)}>
              {error}
            </HelperText>
          )}
          <Button
            mode="contained"
            onPress={login}
            loading={loading}
            disabled={loading}
          >
            Se connecter
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
