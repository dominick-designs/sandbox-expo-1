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
    
    hour: 21,
    minute: 40,
    second: 3,

  }

});


export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);


  const data = [9, 10, 11]

  function PushToday () {
    let todayDate = new Date();
    const yesterday = new Date();
     yesterday.setDate(todayDate.getDate() - 1);
    const hoursNow = todayDate.getHours()
    const minNow = todayDate.getMinutes()
    const dayOfMonth = todayDate.getDate();
    if (data[0] === dayOfMonth - 1 && hoursNow == 15 && minNow == 45) {    
      return `${hoursNow}${minNow}`
    } else {
      return yesterday.toDateString()
    }

  }






  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      
      <Text>
        <PushToday />
      </Text>
      <Button
        title="Press to Send Notification"
        onPress={async () => {

          await Notifications.scheduleNotificationAsync(expoPushToken);
        }}
      />
    </View>
  );
}







const content = { title: 'I am a one, hasty notification.' };

// Notifications.scheduleNotificationAsync({ content, trigger: null });


interface CalendarNotificationTrigger {
  type: 'calendar';
  repeats: boolean;
  dateComponents: {
    era?: number;
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    weekday?: number;
    weekdayOrdinal?: number;
    quarter?: number;
    weekOfMonth?: number;
    weekOfYear?: number;
    yearForWeekOfYear?: number;
    nanosecond?: number;
    isLeapMonth: boolean;
    timeZone?: string;
    calendar?: string;
  };
}


const NewCal = (makeCal: CalendarNotificationTrigger) => {
  const month = new Date().getMonth();
  const dayOfMonth = new Date().getDate();

  if (month == makeCal.dateComponents.month) {
    console.log("it is ok")
    console.log(typeof month)
  } else {
    console.log('noasad')
  }
}


const trigger = {
  type: 'calendar',
  repeats: false,
  dateComponents: {
    hour: 20,
    month: 7,
    
  }
}

NewCal(trigger);







// async function sendPushNotification(expoPushToken) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }







// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Tomorrow is Ekadasi',
    body: 'Open the Ekadasi app now!',
    data: { data: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}