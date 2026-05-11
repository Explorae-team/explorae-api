import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';


import EditProfileHeader from '../../components/settings/EditProfileHeader';
import ProfilePhotoEdit from '../../components/settings/ProfilePhotoEdit';
import ProfileForm from '../../components/settings/ProfileForm';
import InterestsSection from '../../components/settings/InterestsSection';
import AccountSettingsList from '../../components/settings/AccountSettingsList';

export default function EditProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <EditProfileHeader />

      <ScrollView
        className="flex-1 pt-20"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfilePhotoEdit />
        <ProfileForm />
        <InterestsSection />
        <AccountSettingsList />
      </ScrollView>
    </SafeAreaView>
  );
}
