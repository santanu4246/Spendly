import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { useAuthStore } from "@/store/auth-store";
import { useCategoryStore } from "@/store/category-store";
import { useTransactionsStore } from "@/store/transactions-store";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TransactionType = "expense" | "income";

export default function AddTransactionScreen() {
  const insets = useSafeAreaInsets();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addTransaction } = useTransactionsStore();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const { selectedCategory, setSelectedCategory, setTransactionType } =
    useCategoryStore();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setTransactionType(newType);
    setSelectedCategory(null); // Clear category when switching types
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        newErrors.amount = "Amount must be a number";
      } else if (parsedAmount <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      }
    }

    if (!selectedCategory) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (!user) {
      setErrors({ ...errors, general: "User not authenticated" });
      return;
    }

    setLoading(true);

    try {
      const parsedAmount = parseFloat(amount);

      await addTransaction(user.id, {
        type,
        amount: parsedAmount,
        date: date.toISOString(),
        note: note.trim() || undefined,
        category: {
          id: selectedCategory!.id,
          name: selectedCategory!.name,
          icon: selectedCategory!.icon,
          color: selectedCategory!.color,
        },
      });

      setSelectedCategory(null);
      router.back();
    } catch (error) {
      console.error("Failed to save transaction:", error);
      setErrors({ ...errors, general: "Failed to save transaction" });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = amount.trim() !== "" && selectedCategory !== null;

  return (
    <View
      style={[
        styles.safeArea,
        { 
          paddingTop: Platform.OS === "android" ? insets.top : 20,
          marginTop: Platform.OS === "ios" ? 44 : 0,
          borderTopLeftRadius: Platform.OS === "ios" ? 24 : 0,
          borderTopRightRadius: Platform.OS === "ios" ? 24 : 0,
          overflow: "hidden",
          backgroundColor: Colors.background
        },
      ]}
    >
      <StatusBar barStyle={activeTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <View style={[styles.header, { borderBottomColor: Colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>Add Transaction</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 40}
      >
        <SegmentedControl
          options={[
            { label: "Expense", value: "expense" },
            { label: "Income", value: "income" },
          ]}
          selectedValue={type}
          onValueChange={handleTypeChange}
          style={styles.segmentedControl}
        />

        {errors.general && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errors.general}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.amountContainer}>
            <Text style={[styles.currencySymbol, { color: Colors.textSecondary }]}>$</Text>
            <TextInput
              placeholder="0.00"
              placeholderTextColor={Colors.textSecondary}
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                setErrors({ ...errors, amount: "" });
              }}
              keyboardType="decimal-pad"
              style={[styles.amountInput, { color: Colors.text }]}
            />
          </View>
          {errors.amount ? (
            <Text style={[styles.amountErrorText, { color: Colors.error }]}>{errors.amount}</Text>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: Colors.text }]}>Category</Text>
            <TouchableOpacity
              style={[
                styles.pickerTrigger,
                { backgroundColor: Colors.inputBg, borderColor: errors.category ? Colors.error : Colors.border },
              ]}
              onPress={() => router.push("/categories")}
            >
              <View style={styles.pickerValue}>
                {selectedCategory ? (
                  <View
                    style={[
                      styles.categoryIconSmall,
                      { backgroundColor: `${selectedCategory.color}20` },
                    ]}
                  >
                    <Ionicons
                      name={selectedCategory.icon}
                      size={18}
                      color={selectedCategory.color}
                    />
                  </View>
                ) : (
                  <Ionicons
                    name="grid-outline"
                    size={20}
                    color={Colors.textSecondary}
                  />
                )}
                <Text
                  style={[
                    styles.pickerText,
                    { color: selectedCategory ? Colors.text : Colors.textSecondary },
                  ]}
                >
                  {selectedCategory ? selectedCategory.name : "Select Category"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
            {errors.category ? (
              <Text style={[styles.errorText, { color: Colors.error }]}>{errors.category}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: Colors.text }]}>Date</Text>
            <TouchableOpacity
              style={[styles.pickerTrigger, { backgroundColor: Colors.inputBg, borderColor: Colors.border }]}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.pickerValue}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors.text}
                />
                <Text style={[styles.pickerText, { color: Colors.text }]}>{formatDate(date)}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Android Date Picker */}
          {showDatePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <Input
            label="Note (Optional)"
            placeholder="What was this for?"
            value={note}
            onChangeText={setNote}
            autoCapitalize="sentences"
          />
        </View>
      </KeyboardAwareScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20), borderTopColor: Colors.border, backgroundColor: Colors.background }]}
      >
        <Button
          title="Save Transaction"
          onPress={handleSave}
          disabled={!isFormValid || loading}
          loading={loading}
        />
      </View>

      {/* iOS Date Picker Modal */}
      {Platform.OS === "ios" && (
        <Modal visible={showDatePicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.datePickerContainer, { backgroundColor: Colors.cardSecondary }]}>
              <View style={[styles.datePickerHeader, { borderBottomColor: Colors.border }]}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.datePickerCancel, { color: Colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.datePickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center", width: "100%" }}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  style={[styles.iosDatePicker, { backgroundColor: Colors.cardSecondary }]}
                  textColor={Colors.text}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 0,
  },
  closeButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  segmentedControl: {
    marginBottom: 32,
  },
  errorBanner: {
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(231, 76, 60, 0.3)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorBannerText: {
    color: "#E74C3C",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    gap: 20,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 8,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  amountInput: {
    flex: 1,
    fontSize: 40,
    fontWeight: "bold",
    minHeight: 56,
    paddingHorizontal: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: "center",
        paddingVertical: 0,
      },
    }),
  },
  amountErrorText: {
    fontSize: 14,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  pickerValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pickerText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
  },
  categoryIconSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 0,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  datePickerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  datePickerCancel: {
    fontSize: 16,
  },
  datePickerDone: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
  },
  iosDatePicker: {
    height: 200,
    width: "100%",
    alignSelf: "center",
  },
});
