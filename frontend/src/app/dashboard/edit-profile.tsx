import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EditProfileHeader from '../../components/settings/EditProfileHeader';
import ProfilePhotoEdit from '../../components/settings/ProfilePhotoEdit';
import ProfileForm from '../../components/settings/ProfileForm';
import InterestsSection from '../../components/settings/InterestsSection';
import AccountSettingsList from '../../components/settings/AccountSettingsList';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface">
      <EditProfileHeader />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 80 + insets.top,
          paddingBottom: 40
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfilePhotoEdit />
        <ProfileForm />
        <InterestsSection />
        <AccountSettingsList />
      </ScrollView>
    </View>
  );
}
