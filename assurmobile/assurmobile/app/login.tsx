import { UserContext } from "@/contexts/UserContext";
import fetchData from "@/hooks/fetchData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { View } from "react-native";
import { Button, Card, HelperText, Text, TextInput } from "react-native-paper";

// type JwtPayload = {
//   user: {};
// };

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const login = async () => {
    try {
      const { token, user } = await fetchData(
        "/auth/login",
        "POST",
        { email, password },
        false,
      );
      await AsyncStorage.setItem("token", token);
      //console.log("Token stored : ", token);
      //const { user } = jwtDecode<JwtPayload>(token);
      setUser(user);
      console.log("User set in context : ", user);
      setError(null);
      router.push({ pathname: "/" });
    } catch (err: any) {
      console.log("Login error ", err);
      setError(err.message);
    }
  };

  return (
    <View>
      <Card>
        <Card.Content>
          <Text>Connexion</Text>
          <TextInput label="Email" onChangeText={setEmail} />
          <TextInput
            label="Mot de passe"
            secureTextEntry
            onChangeText={setPassword}
          />
          <HelperText type="error" visible={Boolean(error)}>
            {error}
          </HelperText>
          <Button mode="contained" onPress={login}>
            Se connecter
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
