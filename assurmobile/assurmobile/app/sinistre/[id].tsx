import fetchData, { fetchDocument } from "@/hooks/fetchData";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import {
  Button,
  Card,
  HelperText,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";

type SinistreType = {
  id: number | string;
  plate?: string;
  sinister_datetime?: any;
  context?: string;
  driver_firstname?: string;
  driver_lastname?: string;
  call_datetime?: any;
  driver_responsability?: boolean;
  driver_is_insured?: boolean;
  driver_engaged_responsability?: number;
  validated?: boolean;
};

export default function SinistreDetailScreen() {
  // implémenter un state local pour charger le sinistre localement
  const [sinistre, setSinistre] = useState<SinistreType>();
  // Store contenant le document temporaire avant envoi du formulaire
  const [pickedFile, setPickedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  // store pour le libellé du document
  const [documentLabel, setDocumentLabel] = useState("");
  // gestion de mes erreurs
  const [error, setError] = useState<string | null>(null);

  // récupérer le paramètre d'URL
  const { id } = useLocalSearchParams<{ id: string }>();

  // fonction de chargement d'un fichier
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });
    if (result.canceled) {
      return;
    }
    // TODO : revoir la structure du result
    setPickedFile(result.assets[0]);
  };

  // Soumission du formulaire
  const submitForm = () => {
    const formData = new FormData();
    formData.append("label", documentLabel);
    if (pickedFile) {
      if (Platform.OS === "web") {
        // cas de la version web
        const webfile = (
          pickedFile as DocumentPicker.DocumentPickerAsset & { file?: File }
        ).file;
        if (webfile) formData.append("file", webfile);
      } else {
        // toutes les autres plateformes
        formData.append("file", {
          uri: pickedFile.uri,
          name: pickedFile.name,
          type: pickedFile.mimeType || "application/octet-stream",
        } as unknown as Blob);
      }
      setError(null);
      fetchDocument("/sinisters/" + id + "/document", "POST", formData, true)
        .then((response) => console.log(response))
        .catch((error) => {
          (console.log(error), setError(error.message));
        });
    } else {
      setError("Pas de fichier sélectionné");
    }
  };

  // fetch récupérer le sinistre courant
  useEffect(() => {
    fetchData("/sinisters/" + id, "GET", {}, true)
      .then((data) => {
        const { sinistre } = data;
        setSinistre(sinistre);
      })
      .catch((err) => {
        console.log("Error on get sinistre " + err.message);
      });
  }, [id]);

  if (!sinistre) {
    return (
      <View>
        <Text>Le sinistre est introuvable !</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Card key={sinistre.id}>
        <Card.Title title="Mon sinistre" />
        <Card.Content>
          <Text>Plaque : {sinistre.plate}</Text>
          <Text>Date du sinistre : {sinistre.sinister_datetime}</Text>
          <Text>
            Date de signalement du sinistre : {sinistre.call_datetime}
          </Text>
          <Text>Nom du conducteur : {sinistre.driver_lastname}</Text>
          <Text>Prénom du conducteur : {sinistre.driver_firstname}</Text>
          <Text>Contexte du sinistre : {sinistre.context}</Text>
          <Text>Responsabilité conducteur : </Text>
          <Switch disabled value={sinistre.driver_responsability} />
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">Envoyer un document :</Text>
          <TextInput
            label="Libellé du document"
            onChangeText={setDocumentLabel}
          />
          <Button mode="outlined" onPress={pickDocument}>
            Fichier : ...
          </Button>
          <HelperText type="error" visible={Boolean(error)}>
            {error}
          </HelperText>
          <Button onPress={submitForm}>Envoyer le document</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
