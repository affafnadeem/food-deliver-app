import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchRestaurantById, fetchMenuByRestaurant } from '../services/api';

export default function RestaurantDetail({ route, navigation }) {
  const { restaurantId } = route.params;

  const [restaurant, setRestaurant] = useState(null);
  const [menuGrouped, setMenuGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    loadData();
  }, [restaurantId]);

  const loadData = async () => {
    try {
      const [restResult, menuResult] = await Promise.all([
        fetchRestaurantById(restaurantId),
        fetchMenuByRestaurant(restaurantId),
      ]);
      setRestaurant(restResult.data);
      setMenuGrouped(menuResult.grouped || {});
      const cats = Object.keys(menuResult.grouped || {});
      if (cats.length > 0) setActiveCategory(cats[0]);
    } catch (err) {
      Alert.alert('Error', 'Failed to load restaurant details.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: { ...item, quantity: (prev[item.id]?.quantity || 0) + 1 },
    }));
  };

  const removeFromCart = (item) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[item.id]?.quantity > 1) {
        updated[item.id] = { ...updated[item.id], quantity: updated[item.id].quantity - 1 };
      } else {
        delete updated[item.id];
      }
      return updated;
    });
  };

  const cartTotal = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  const renderMenuItem = (item) => {
    const qty = cart[item.id]?.quantity || 0;
    return (
      <View key={item.id} style={styles.menuItem}>
        <Image source={{ uri: item.image_url }} style={styles.menuImage} />
        <View style={styles.menuInfo}>
          <Text style={styles.menuName}>{item.name}</Text>
          <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <View style={styles.qtyControl}>
          {qty > 0 ? (
            <>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item)}>
                <Ionicons name="remove" size={16} color="#01696f" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
            </>
          ) : null}
          <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnAdd]} onPress={() => addToCart(item)}>
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#01696f" />
      </View>
    );
  }

  const categories = Object.keys(menuGrouped);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
        {/* Header Image & Back Button */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: restaurant?.image_url }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.restName}>{restaurant?.name}</Text>
              <View style={styles.cuisineRow}>
                <Text style={styles.restCuisine}>{restaurant?.cuisine} • </Text>
                <Text style={styles.restAddress} numberOfLines={1}>{restaurant?.address}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, !restaurant?.is_open && styles.statusClosed]}>
              <Text style={styles.statusText}>{restaurant?.is_open ? 'Open' : 'Closed'}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={styles.statValue}> {restaurant?.rating?.toFixed(1)}</Text>
              <Text style={styles.statLabel}> (500+)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
              <Text style={styles.statValue}> {restaurant?.delivery_time}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="bicycle-outline" size={16} color="#6b7280" />
              <Text style={styles.statValue}> {restaurant?.delivery_fee === 0 ? 'Free' : `$${restaurant?.delivery_fee?.toFixed(2)}`}</Text>
            </View>
          </View>
        </View>

        {/* Category Tabs */}
        <View style={styles.tabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.tab, activeCategory === cat && styles.tabActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.categoryTitle}>{activeCategory}</Text>
          {activeCategory && menuGrouped[activeCategory]?.map(item => renderMenuItem(item))}
        </View>

        {/* Spacer for Floating Cart */}
        {cartCount > 0 && <View style={{ height: 100 }} />}
      </ScrollView>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <SafeAreaView style={styles.cartBarContainer}>
          <TouchableOpacity
            style={styles.cartBar}
            onPress={() => navigation.navigate('Cart', {
              cartItems: cart,
              restaurantName: restaurant?.name
            })}
            activeOpacity={0.9}
          >
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
            <Text style={styles.cartBarText}>View Cart</Text>
            <Text style={styles.cartBarTotal}>${cartTotal.toFixed(2)}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroContainer: { width: '100%', height: 260, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)', // Very subtle overall dimming
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoCard: {
    backgroundColor: '#fff',
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    paddingBottom: 0,
  },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  restName: { fontSize: 28, fontWeight: '900', color: '#1e1b4b', marginBottom: 6, letterSpacing: -1 },
  cuisineRow: { flexDirection: 'row', alignItems: 'center' },
  restCuisine: { fontSize: 14, color: '#4f46e5', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  restAddress: { fontSize: 14, color: '#64748b', flex: 1, fontWeight: '500' },
  statusBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusClosed: { backgroundColor: '#fef2f2' },
  statusText: { fontSize: 13, fontWeight: '800', color: '#15803d' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  stat: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 14, fontWeight: '800', color: '#1e1b4b' },
  statLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  statDivider: { width: 1, height: 20, backgroundColor: '#f1f5f9' },
  tabsWrapper: { backgroundColor: '#fff', paddingTop: 10 },
  tabsContainer: { paddingHorizontal: 20, paddingVertical: 10, gap: 12 },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  tabActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#64748b' },
  tabTextActive: { color: '#fff' },
  menuSection: { padding: 20 },
  categoryTitle: { fontSize: 24, fontWeight: '900', color: '#1e1b4b', marginBottom: 20, letterSpacing: -0.5 },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  menuImage: { width: 70, height: 70, borderRadius: 16, backgroundColor: '#f1f5f9' },
  menuInfo: { flex: 1, marginLeft: 16 },
  menuName: { fontSize: 17, fontWeight: '800', color: '#1e1b4b', marginBottom: 4 },
  menuDesc: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 8, fontWeight: '500' },
  menuPrice: { fontSize: 18, fontWeight: '900', color: '#4f46e5' },
  qtyControl: { alignItems: 'center' },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  qtyBtnAdd: { backgroundColor: '#4f46e5' },
  qtyText: { fontSize: 15, fontWeight: '900', color: '#1e1b4b', marginVertical: 4 },
  cartBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  cartBar: {
    margin: 20,
    backgroundColor: '#4f46e5',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cartBadge: {
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cartBadgeText: { color: '#4f46e5', fontWeight: '900', fontSize: 14 },
  cartBarText: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '800' },
  cartBarTotal: { color: '#fff', fontSize: 18, fontWeight: '900' },
});
