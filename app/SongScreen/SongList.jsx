import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import data from "./../../Data";
import PlaySong from "@/app/SongScreen/PlaySong";

export default function SongList() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    if (data?.songs.length > 0) {
      setSongs(data.songs);
    }
  }, []);

  const handleSongSelect = (index) => {
    setCurrentSong({
      name: songs[index].name,
      track: songs[index].track,
      index: index,
    });
  };

  const handleBackToList = () => {
    setCurrentSong(null);
  };
  const handleTrackChange = (index) => {
    setCurrentSong({
      name: songs[index].name,
      track: songs[index].track,
      index: index,
    });
  };

  const renderItem = ({ item, index }) => (
    <Pressable
      onPress={() => handleSongSelect(index)}
      style={({ pressed }) => [styles.songItem, { opacity: pressed ? 0.8 : 1 }]}
    >
      <Image
        source={{ uri: "https://img.icons8.com/ios/452/music.png" }}
        style={styles.songImage}
      />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.songArtist}>Unknown Artist</Text>
      </View>
      <MaterialIcons name="play-arrow" size={28} color="#fff" />
    </Pressable>
  );

  return currentSong ? (
    <PlaySong
      name={currentSong.name}
      track={currentSong.track}
      trackList={songs.map((song) => song.track)}
      initialIndex={currentSong.index}
      onBack={handleBackToList}
    />
  ) : (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Music Library</Text>
        </View>

        <Text style={styles.sectionTitle}>All Songs</Text>
        <FlatList
          data={songs}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  headerTitle: {
    color: "#fff",

    fontSize: 28,
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    marginTop: 20,
  },
  recentContainer: {
    marginBottom: 20,
  },
  recentItem: {
    width: 150,
    marginRight: 15,
  },
  recentImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  recentTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 100,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  songArtist: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
});
