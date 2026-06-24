import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { MiniPlayer } from '@/components/MiniPlayer';
import { usePlayer } from '@/context/PlayerContext';

function NativeTabLayout() {
  const { currentEpisode } = usePlayer();
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Icon sf={{ default: 'house', selected: 'house.fill' }} />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="search">
          <Icon sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }} />
          <Label>Search</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="library">
          <Icon sf={{ default: 'bookmark', selected: 'bookmark.fill' }} />
          <Label>Library</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="chat">
          <Icon sf={{ default: 'bubble.left.and.bubble.right', selected: 'bubble.left.and.bubble.right.fill' }} />
          <Label>ZX Chat</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf={{ default: 'person', selected: 'person.fill' }} />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
      {currentEpisode && <MiniPlayer />}
    </View>
  );
}

function ClassicTabLayout() {
  const { currentEpisode } = usePlayer();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#1DB954',
          tabBarInactiveTintColor: '#666666',
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: isIOS ? 'transparent' : '#000000',
            borderTopWidth: 1,
            borderTopColor: '#1A1A1A',
            elevation: 0,
            height: isWeb ? 84 : 60,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600' as const,
            marginBottom: isWeb ? 8 : 4,
          },
          tabBarBackground: () =>
            isIOS ? (
              <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
            ) : null,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="house" tintColor={color} size={22} />
              ) : (
                <Feather name="home" size={22} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="magnifyingglass" tintColor={color} size={22} />
              ) : (
                <Feather name="search" size={22} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="bookmark" tintColor={color} size={22} />
              ) : (
                <Feather name="bookmark" size={22} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'ZX Chat',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="bubble.left.and.bubble.right" tintColor={color} size={22} />
              ) : (
                <Feather name="message-circle" size={22} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="person" tintColor={color} size={22} />
              ) : (
                <Feather name="user" size={22} color={color} />
              ),
          }}
        />
      </Tabs>
      {currentEpisode && <MiniPlayer />}
    </View>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) return <NativeTabLayout />;
  return <ClassicTabLayout />;
}
