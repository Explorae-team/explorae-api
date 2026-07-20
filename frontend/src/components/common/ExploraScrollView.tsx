import React from 'react';
import { ScrollView, RefreshControl, ScrollViewProps } from 'react-native';
import { colors } from '../../constants/colors';

interface ExploraScrollViewProps extends ScrollViewProps {
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
}

export const ExploraScrollView: React.FC<ExploraScrollViewProps> = ({
  children,
  onRefresh,
  refreshing = false,
  ...rest
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={rest.showsVerticalScrollIndicator ?? false}
      {...rest}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
};

export default ExploraScrollView;
