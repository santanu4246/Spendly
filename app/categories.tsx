import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/colors";
import { Category, useCategoryStore } from "@/store/category-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PREDEFINED_EXPENSE_CATEGORIES: Category[] = [
  {
    id: "exp1",
    name: "Food & Dining",
    icon: "fast-food-outline",
    color: "#10B981",
    isCustom: false,
    type: "expense",
  },
  {
    id: "exp2",
    name: "Transportation",
    icon: "car-outline",
    color: "#3B82F6",
    isCustom: false,
    type: "expense",
  },
  {
    id: "exp3",
    name: "Shopping",
    icon: "cart-outline",
    color: "#8B5CF6",
    isCustom: false,
    type: "expense",
  },
  {
    id: "exp4",
    name: "Entertainment",
    icon: "film-outline",
    color: "#EAB308",
    isCustom: false,
    type: "expense",
  },
  {
    id: "exp5",
    name: "Housing",
    icon: "home-outline",
    color: "#EF4444",
    isCustom: false,
    type: "expense",
  },
  {
    id: "exp6",
    name: "Healthcare",
    icon: "medkit-outline",
    color: "#F97316",
    isCustom: false,
    type: "expense",
  },
  {
    id: "exp7",
    name: "Education",
    icon: "school-outline",
    color: "#EC4899",
    isCustom: false,
    type: "expense",
  },
];

const PREDEFINED_INCOME_CATEGORIES: Category[] = [
  {
    id: "inc1",
    name: "Salary",
    icon: "cash-outline",
    color: "#06B6D4",
    isCustom: false,
    type: "income",
  },
  {
    id: "inc2",
    name: "Freelance",
    icon: "laptop-outline",
    color: "#14B8A6",
    isCustom: false,
    type: "income",
  },
  {
    id: "inc3",
    name: "Investment",
    icon: "trending-up-outline",
    color: "#84CC16",
    isCustom: false,
    type: "income",
  },
  {
    id: "inc4",
    name: "Business",
    icon: "briefcase-outline",
    color: "#F59E0B",
    isCustom: false,
    type: "income",
  },
  {
    id: "inc5",
    name: "Gift",
    icon: "gift-outline",
    color: "#A855F7",
    isCustom: false,
    type: "income",
  },
  {
    id: "inc6",
    name: "Bonus",
    icon: "star-outline",
    color: "#FB923C",
    isCustom: false,
    type: "income",
  },
];

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EAB308",
  "#EF4444",
  "#F97316",
  "#EC4899",
  "#06B6D4",
];
const ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  "star-outline",
  "heart-outline",
  "airplane-outline",
  "fitness-outline",
  "game-controller-outline",
  "book-outline",
  "musical-notes-outline",
  "cafe-outline",
];

export default function CategoryManagerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setSelectedCategory, transactionType } = useCategoryStore();

  const predefinedCategories =
    transactionType === "income"
      ? PREDEFINED_INCOME_CATEGORIES
      : PREDEFINED_EXPENSE_CATEGORIES;

  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [view, setView] = useState<"list" | "create">("list");

  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleCreateCategory = () => {
    if (!newName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newName,
      icon: selectedIcon,
      color: selectedColor,
      isCustom: true,
      type: transactionType,
    };

    setCustomCategories([...customCategories, newCategory]);
    setView("list");
    setNewName("");
    setSelectedColor(COLORS[0]);
    setSelectedIcon(ICONS[0]);
  };

  const handleDeleteCategory = (id: string) => {
    setCustomCategories(customCategories.filter((c) => c.id !== id));
  };

  const allCategories = [
    ...predefinedCategories,
    ...customCategories.filter((c) => c.type === transactionType),
  ];

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    router.back();
  };

  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: Platform.OS === "android" ? insets.top : 20 },
      ]}
    >
      <View style={styles.header}>
        {view === "create" ? (
          <TouchableOpacity
            onPress={() => setView("list")}
            style={styles.closeButton}
          >
            <Ionicons name="arrow-back" size={28} color={Colors.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={28} color={Colors.text} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {view === "list" ? "Categories" : "New Category"}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {view === "list" ? (
        <View style={styles.container}>
          <View style={styles.typeIndicator}>
            <Text style={styles.typeIndicatorText}>
              {transactionType === "income"
                ? "Income Categories"
                : "Expense Categories"}
            </Text>
          </View>
          <ScrollView contentContainerStyle={styles.listContent}>
            {allCategories.map((cat) => (
              <View key={cat.id} style={styles.categoryRow}>
                <TouchableOpacity
                  style={styles.categoryTouchable}
                  onPress={() => handleSelectCategory(cat)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${cat.color}20` },
                    ]}
                  >
                    <Ionicons name={cat.icon} size={24} color={cat.color} />
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>

                {cat.isCustom && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCategory(cat.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={Colors.error}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>

          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 20) },
            ]}
          >
            <Button
              title="Add Custom Category"
              onPress={() => setView("create")}
              variant="secondary"
            />
          </View>
        </View>
      ) : (
        <KeyboardAwareScrollView
          style={styles.container}
          contentContainerStyle={styles.createContent}
          enableOnAndroid={true}
        >
          <Input
            label="Category Name"
            placeholder="e.g. Coffee, Subscriptions"
            value={newName}
            onChangeText={setNewName}
            autoFocus
          />

          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.gridContainer}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorOption,
                  { backgroundColor: c },
                  selectedColor === c && styles.selectedOption,
                ]}
                onPress={() => setSelectedColor(c)}
              >
                {selectedColor === c && (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Icon</Text>
          <View style={styles.gridContainer}>
            {ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.selectedOption,
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Ionicons
                  name={icon}
                  size={24}
                  color={
                    selectedIcon === icon ? Colors.text : Colors.textSecondary
                  }
                />
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Create Category"
            onPress={handleCreateCategory}
            disabled={!newName.trim()}
            style={{ marginTop: 24 }}
          />
        </KeyboardAwareScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  closeButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  typeIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#1A1A1A",
  },
  typeIndicatorText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingRight: 16,
  },
  categoryTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  deleteButton: {
    padding: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
    backgroundColor: Colors.background,
  },
  createContent: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: Colors.text,
  },
});
