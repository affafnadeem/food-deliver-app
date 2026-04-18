import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import RestaurantCard from '../components/RestaurantCard';
import { fetchRestaurants, fetchCuisines } from '../services/api';

const CATEGORIES = [
  { label: 'All', emoji: '🍽️' },
  { label: 'Burgers', emoji: '🍔' },
  { label: 'Pizza', emoji: '🍕' },
  { label: 'Sushi', emoji: '🍱' },
  { label: 'Tacos', emoji: '🌮' },
  { label: 'Chinese', emoji: '🥡' },
  { label: 'Healthy', emoji: '🥗' },
  { label: 'Indian', emoji: '🥘' },
  { label: 'Thai', emoji: '🍜' },
  { label: 'Desserts', emoji: '🍰' },
];

export default function HomeScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadRestaurants = useCallback(async (search = '', cuisine = '') => {
    try {
      setError(null);
      const params = {};
      if (search) params.search = search;
      if (cuisine && cuisine !== 'All') params.cuisine = cuisine;

      const result = await fetchRestaurants(params);
      setRestaurants(result.data || []);
    } catch (err) {
      setError('Failed to load restaurants. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    loadRestaurants(searchQuery, selectedCategory);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setLoading(true);
    loadRestaurants(searchQuery, category);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadRestaurants(searchQuery, selectedCategory);
  };

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetail', {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  };

  const renderCategoryChip = ({ label, emoji }) => (
    <TouchableOpacity
      key={label}
      style={[styles.chip, selectedCategory === label && styles.chipActive]}
      onPress={() => handleCategorySelect(label)}
      activeOpacity={0.7}
    >
      <Text style={styles.chipEmoji}>{emoji}</Text>
      <Text style={[styles.chipText, selectedCategory === label && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const PromoBanner = () => (
    <View style={styles.promoContainer}>
      <View style={styles.promoContent}>
        <Text style={styles.promoTag}>LIMITED OFFER</Text>
        <Text style={styles.promoTitle}>50% OFF</Text>
        <Text style={styles.promoSubtitle}>On your first order today!</Text>
        <TouchableOpacity 
          style={styles.promoBtn}
          onPress={() => Alert.alert('Promo Claimed!', 'Your 50% discount has been applied to your Fofo account.')}
        >
          <Text style={styles.promoBtnText}>Claim Now</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600' }}
        style={styles.promoImage}
      />
    </View>
  );

  const ListHeader = () => (
    <View style={styles.headerContent}>
      <PromoBanner />
      
      <View style={styles.categoriesHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScroll}
      >
        {CATEGORIES.map(cat => renderCategoryChip(cat))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'Popular Near You' : `${selectedCategory} Specials`}
        </Text>
        <Text style={styles.sectionCount}>{restaurants.length} results</Text>
      </View>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="fast-food-outline" size={80} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No results found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? `We couldn't find anything matching "${searchQuery}"`
          : 'Try searching for something else or choosing another category.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>Loading deliciouness...</Text>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RestaurantCard restaurant={item} onPress={handleRestaurantPress} />
          )}
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={<ListEmpty />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#4f46e5']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#64748b',
    marginTop: 15,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 40,
  },
  headerContent: {
    paddingTop: 10,
  },
  promoContainer: {
    margin: 20,
    backgroundColor: '#4f46e5',
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  promoContent: {
    flex: 1,
    zIndex: 1,
  },
  promoTag: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 6,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  promoSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 20,
  },
  promoBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: '#4f46e5',
    fontWeight: '800',
    fontSize: 13,
  },
  promoImage: {
    width: 140,
    height: 140,
    position: 'absolute',
    right: -30,
    bottom: -30,
    borderRadius: 70,
    opacity: 0.8,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seeAll: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '700',
  },
  categoriesScroll: {
    marginBottom: 25,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chipActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  chipEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  chipTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e1b4b',
    letterSpacing: -0.5,
  },
  sectionCount: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e1b4b',
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    fontWeight: '500',
  },
});
