import { View, Text } from "react-native";
import SongList from "./../app/SongScreen/SongList";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, textAlign: "center", marginTop: 20 }}>
        🎵 Song List
      </Text>
      <SongList />
    </View>
  );
}
