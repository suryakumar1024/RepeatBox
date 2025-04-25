

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");

export default function PlaySong({ name = "", track, trackList = [], onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const spinValue = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);
  const isRepeatingRef = useRef(false);


  useEffect(() => {
    isRepeatingRef.current = isRepeating;
  }, [isRepeating]);


  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 15000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [isPlaying]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    if (trackList.length > 0) {
      const index = trackList.findIndex((t) => t === track);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [trackList, track]);

  const onPlaybackStatusUpdate = async (status) => {
    if (status.isLoaded && status.didJustFinish) {
      if (isRepeatingRef.current) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      } else {
        handleNext();
      }
    }
  };

  const getRandomTrackIndex = (current) => {
    if (trackList.length <= 1) return current;
    let newIndex = current;
    while (newIndex === current) {
      newIndex = Math.floor(Math.random() * trackList.length);
    }
    return newIndex;
  };

  const playTrack = async (trackUri) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: trackUri },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to play track:", error);
    }
  };

  useEffect(() => {
    const loadSound = async () => {
      if (track) {
        await playTrack(track);
      }
    };
    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [track]);

  const togglePlayback = async () => {
    try {
      if (soundRef.current) {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
        } else {
          await soundRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error("Playback toggle error:", error);
    }
  };

  const handleNext = () => {
    if (trackList.length <= 1) return;

    const nextIndex = isShuffled
      ? getRandomTrackIndex(currentIndex)
      : (currentIndex + 1) % trackList.length;

    onTrackChange(nextIndex);
  };

  const handlePrevious = () => {
    if (trackList.length <= 1) return;

    const prevIndex = isShuffled
      ? getRandomTrackIndex(currentIndex)
      : (currentIndex - 1 + trackList.length) % trackList.length;

    onTrackChange(prevIndex);
  };

  const onTrackChange = (index) => {
    setCurrentIndex(index);
    playTrack(trackList[index]);
  };

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.container}
    >
  
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-down" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={{ width: 30 }} />
      </View>

     
      <Animated.Image
  source={{ uri: "https://img.icons8.com/ios/452/music.png" }}
  style={{
    width: 280,
    height: 280,
    borderRadius: (width * 0.7) / 2,
    transform: [{ rotate: spin }],
  }}
/>

 
      <View style={styles.songInfoContainer}>
        <Text style={styles.songTitle}>{String(name)}</Text>
        <Text style={styles.artistName}>Artist</Text>
      </View>

     
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={() => setIsShuffled(!isShuffled)}>
          <Ionicons
            name="shuffle"
            size={28}
            color={isShuffled ? "#4cc9f0" : "#fff"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
          <Ionicons name="play-skip-back" size={36} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={36}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
          <Ionicons name="play-skip-forward" size={36} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRepeating(!isRepeating)}>
          <MaterialIcons
            name={isRepeating ? "repeat-on" : "repeat"}
            size={28}
            color={isRepeating ? "#4cc9f0" : "#fff"}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 40,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  albumArtContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  albumArt: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
  },
  songInfoContainer: {
    alignItems: "center",
     marginBottom: 20,
    paddingTop:100,
  },
  songTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
 
  },
  artistName: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 30,
  },


  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingTop:20,
    paddingHorizontal: 20,
  },
  playButton: {
    backgroundColor: "#4cc9f0",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4cc9f0",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  navButton: {
    padding: 10,
  },
});
