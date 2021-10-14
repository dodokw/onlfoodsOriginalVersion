import {Alert, Share} from 'react-native';

export default async function Sharing() {
	try {
		const result = await Share.share({
			message: `안드로이드 : https://play.google.com/store/apps/details?id=com.todayfoods
				iOS : https://itunes.apple.com/app/id1580651384`,
		});
		if (result.action === Share.sharedAction) {
			if (result.activityType) {
				// shared with activity type of result.activityType
			} else {
				// shared
			}
		} else if (result.action === Share.dismissedAction) {
			// dismissed
		}
	} catch (error) {
		Alert.alert(error.message);
	}
}
