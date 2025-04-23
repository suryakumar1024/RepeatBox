import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import data from "./../../Data";
import PlaySong from "@/app/SongScreen/PlaySong";

export default function SongList() {
  const [listData, setListData] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  useEffect(() => {
    if (data?.songs.length > 0) {
      setListData(data.songs);
    }
  }, []);

  const handlePress = (name, track) => {
    setCurrentSong({ name, track });
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => handlePress(item.name, item.track)}
      style={({ pressed }) => [
        styles.itemContainer,
        { backgroundColor: pressed ? "#dfe6e9" : "#f9f9f9" },
      ]}
    >
      <View style={styles.songContent}>
        <Image
          source={{ uri: "https://img.icons8.com/ios/452/music.png" }}
          style={styles.icon}
        />
        <Text style={styles.songName}>{item.name}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {currentSong ? (
        <>
          <PlaySong
            name={currentSong.name}
            track={currentSong.track}
            songs={listData}
          />
        </>
      ) : (
        <>
          <FlatList
            data={listData}
            keyExtractor={(item, index) => item.name + index}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 13 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f1f2f6",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  songContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  songName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});
