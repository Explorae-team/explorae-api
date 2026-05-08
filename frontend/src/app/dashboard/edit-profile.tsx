import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';


import EditProfileHeader from '../../components/EditProfileHeader';
import ProfilePhotoEdit from '../../components/ProfilePhotoEdit';
import ProfileForm from '../../components/ProfileForm';
import InterestsSection from '../../components/InterestsSection';
import AccountSettingsList from '../../components/AccountSettingsList';

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
