import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function RestaurantCard({ restaurant, onPress }) {
  const {
    name,
    cuisine,
    rating,
    delivery_time,
    delivery_fee,
    min_order,
    image_url,
    is_open,
  } = restaurant;

  const renderStars = (rating) => {
    const filled = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return '★'.repeat(filled) + (half ? '½' : '') + '☆'.repeat(5 - filled - (half ? 1 : 0));
  };

  return (
    <TouchableOpacity
      style={[styles.card, !is_open && styles.cardClosed]}
      onPress={() => is_open && onPress(restaurant)}
      activeOpacity={is_open ? 0.85 : 1}
    >
      {/* Restaurant Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        {!is_open && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>CLOSED</Text>
          </View>
        )}
        <View style={styles.cuisineBadge}>
          <Text style={styles.cuisineBadgeText}>{cuisine}</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.stars}>{renderStars(rating)}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🕐</Text>
            <Text style={styles.metaText}>{delivery_time}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🛵</Text>
            <Text style={styles.metaText}>
              {delivery_fee === 0 ? 'Free delivery' : `$${delivery_fee.toFixed(2)} delivery`}
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🛒</Text>
            <Text style={styles.metaText}>Min ${min_order}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#1e1b4b',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    borderColor: '#f1f5f9',
    elevation: 10,
  },
  cardClosed: {
    opacity: 0.6,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180, // Increased for a more cinematic 16:9-like ratio
    backgroundColor: '#f1f5f9',
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30,27,75,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
  },
  cuisineBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cuisineBadgeText: {
    color: '#4f46e5',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    padding: 18,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e1b4b',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.5,
  },
  ratingBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4f46e5',
  },
  stars: {
    color: '#fbbf24',
    fontSize: 12,
    marginBottom: 12,
    letterSpacing: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 12,
    marginRight: 4,
    opacity: 0.7,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
});
