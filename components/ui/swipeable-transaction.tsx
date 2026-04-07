import React from 'react';
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DeleteIcon } from '@/components/ui/icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTransactionsStore, Transaction } from '@/store/transactions-store';

interface SwipeableTransactionProps {
  transaction: Transaction;
  onDelete?: () => void;
}

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return value < 0 ? `-$${formatted}` : `$${formatted}`;
}

export function SwipeableTransaction({ transaction, onDelete }: SwipeableTransactionProps) {
  const Colors = useThemeColor();
  const { deleteTransaction } = useTransactionsStore();
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(92);
  const opacity = useSharedValue(1);

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            opacity.value = withTiming(0, { duration: 200 });
            itemHeight.value = withTiming(0, { duration: 200 }, () => {
              runOnJS(deleteTransaction)(transaction.id);
              if (onDelete) {
                runOnJS(onDelete)();
              }
            });
          },
        },
      ]
    );
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -100);
      } else {
        translateX.value = 0;
      }
    })
    .onEnd(() => {
      if (translateX.value < -50) {
        translateX.value = withTiming(-100);
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    opacity: opacity.value,
    marginBottom: itemHeight.value > 0 ? 12 : 0,
    overflow: 'hidden',
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -10 ? 1 : 0,
  }));

  return (
    <Animated.View style={containerStyle}>
      <View style={styles.container}>
        <Animated.View style={[styles.deleteContainer, deleteButtonStyle]}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
            <DeleteIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.transactionItem,
              { backgroundColor: Colors.cardSecondary },
              animatedStyle,
            ]}
          >
            <View style={styles.transactionLeft}>
              <View style={[styles.categoryIconContainer, { backgroundColor: `${transaction.category.color}20` }]}>
                <Ionicons 
                  name={transaction.category.icon as any} 
                  size={20} 
                  color={transaction.category.color} 
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionName, { color: Colors.text }]}>
                  {transaction.category.name}
                </Text>
                <Text style={[styles.transactionSubtext, { color: Colors.textSecondary }]}>
                  {new Date(transaction.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: new Date(transaction.date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                  })}
                  {transaction.note ? ` • ${transaction.note}` : ''}
                </Text>
              </View>
            </View>
            <View style={[
              styles.amountBadge,
              transaction.type === 'income' 
                ? styles.amountBadgeIncome 
                : styles.amountBadgeExpense
            ]}>
              <Text style={[
                styles.amountText,
                transaction.type === 'income' 
                  ? styles.amountTextIncome 
                  : styles.amountTextExpense
              ]}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </Text>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  deleteContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  deleteButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    marginLeft: 12,
    flex: 1,
    minWidth: 0,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionSubtext: {
    fontSize: 12,
  },
  amountBadge: {
    flexShrink: 0,
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  amountBadgeIncome: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  amountBadgeExpense: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  amountText: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'right',
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  amountTextIncome: {
    color: '#10B981',
  },
  amountTextExpense: {
    color: '#E74C3C',
  },
});
