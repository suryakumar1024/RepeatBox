import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { Audio } from "expo-av";

export default function PlaySong({ name, track }) {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    let timeoutId;
    const loadSound = async () => {
      if (track) {
        const { sound } = await Audio.Sound.createAsync({ uri: track });
        setSound(sound);
      }
    };
    loadSound();
    timeoutId = setTimeout(() => {
      if (track && name) {
        setShowPlayer(true);
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [track, name]);

  const togglePlayback = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {showPlayer ? (
        <View style={styles.container}>
          <View style={styles.card}>
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/500/music.png",
              }}
              style={styles.icon}
            />
            <Text style={styles.songName}>{name}</Text>
            <TouchableOpacity style={styles.button} onPress={togglePlayback}>
              <Text style={styles.buttonText}>
                {isPlaying ? "⏸ Pause" : "▶️ Play"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.loading}>Loading song... Please wait</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    fontSize: 18,
    color: "#555",
  },
  container: {
    flex: 1,
    backgroundColor: "#f1f2f6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  songName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2d3436",
    textAlign: "center",
  },
  trackText: {
    fontSize: 14,
    color: "#636e72",
    marginBottom: 25,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0984e3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },

});
