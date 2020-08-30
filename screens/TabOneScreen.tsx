import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef, Component } from 'react';
import { Text, View, Button, Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const month = new Date().getMonth();

Notifications.scheduleNotificationAsync({
  content: {
    title: "calendar trigger august 29!",
    body: `${month}`,
  },

  trigger: {
    repeats: false,

    hour: 11,
    minute: 1,
    second: 3,

  }

});

export default function App() {

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>You should not see anything here. You should see local calendar triggered notification.</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
   
      </View>
      
   
    </View>
  );
}



