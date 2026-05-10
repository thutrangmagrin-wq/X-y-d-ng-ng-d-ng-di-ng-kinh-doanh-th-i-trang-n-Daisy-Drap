import { View, Image, Text, StyleSheet } from 'react-native';
import { useAppConfig } from '../context/AppConfigContext';

export default function BannerComponent() {
  const { config } = useAppConfig();

  return (
    <View style={styles.banner}>
      <Image
        source={{ uri: config.bannerImage }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerLogo}>{config.shopName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 200,
    marginBottom: 16,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 20,
  },
  bannerLogo: {
    fontSize: 32,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
