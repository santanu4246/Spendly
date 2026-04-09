# Spendly

A modern expense tracking mobile application built with React Native and Expo. Track your income and expenses with beautiful analytics and category management.

## Features

- **Transaction Management**: Add, edit, and delete income and expense transactions with ease
- **Smart Dashboard**: View your total balance, income, and expenses at a glance with an elegant card interface
- **Category Organization**: Predefined categories for common transactions plus ability to create custom categories with icons and colors
- **Analytics & Insights**: 
  - Weekly balance line chart showing cumulative balance trends
  - Interactive pie charts for category breakdown
  - Filter analytics by income or expense
- **Time Period Filters**: View transactions by weekly or monthly periods
- **Dark Mode Support**: Beautiful light and dark themes with system-based auto-switching
- **Swipeable Transactions**: Intuitive swipe gestures to manage transactions
- **User Authentication**: Secure login and registration system
- **Profile Management**: Edit user information and manage account settings
- **Date Picker**: Select custom dates for transactions
- **Balance Validation**: Prevents overspending with insufficient balance alerts
- **Responsive Design**: Optimized for both iOS and Android platforms

## Screenshots

### iOS

<p align="center">
  <img src="screenshots/ios/welcome.png" width="200" alt="Welcome Screen" />
  <img src="screenshots/ios/dashboard.png" width="200" alt="Dashboard" />
  <img src="screenshots/ios/analytics.png" width="200" alt="Analytics" />
  <img src="screenshots/ios/profile.png" width="200" alt="Profile" />
</p>

### Android

#### Light mode

<p align="center">
  <img src="screenshots/android/imgLight1.jpeg" width="180" alt="Android light 1" />
  <img src="screenshots/android/imgLight2.jpeg" width="180" alt="Android light 2" />
  <img src="screenshots/android/imgLight3.jpeg" width="180" alt="Android light 3" />
  <img src="screenshots/android/imgLight4.jpeg" width="180" alt="Android light 4" />
</p>
<p align="center">
  <img src="screenshots/android/imgLight5.jpeg" width="180" alt="Android light 5" />
  <img src="screenshots/android/imgLight6.jpeg" width="180" alt="Android light 6" />
  <img src="screenshots/android/imgLight7.jpeg" width="180" alt="Android light 7" />
  <img src="screenshots/android/imgLight8.jpeg" width="180" alt="Android light 8" />
</p>
<p align="center">
  <img src="screenshots/android/imgLight9.jpeg" width="180" alt="Android light 9" />
  <img src="screenshots/android/imgLight10.jpeg" width="180" alt="Android light 10" />
  <img src="screenshots/android/imgLight11.jpeg" width="180" alt="Android light 11" />
  <img src="screenshots/android/imgLight12.jpeg" width="180" alt="Android light 12" />
</p>
<p align="center">
  <img src="screenshots/android/imgLight13.jpeg" width="180" alt="Android light 13" />
</p>

#### Dark mode

<p align="center">
  <img src="screenshots/android/imgDark1.jpeg" width="180" alt="Android dark 1" />
  <img src="screenshots/android/imgDark2.jpeg" width="180" alt="Android dark 2" />
  <img src="screenshots/android/imgDark3.jpeg" width="180" alt="Android dark 3" />
  <img src="screenshots/android/imgDark4.jpeg" width="180" alt="Android dark 4" />
</p>
<p align="center">
  <img src="screenshots/android/imgDark5.jpeg" width="180" alt="Android dark 5" />
  <img src="screenshots/android/imgDark6.jpeg" width="180" alt="Android dark 6" />
  <img src="screenshots/android/imgDark7.jpeg" width="180" alt="Android dark 7" />
  <img src="screenshots/android/imgDark8.jpeg" width="180" alt="Android dark 8" />
</p>
<p align="center">
  <img src="screenshots/android/imgDark9.jpeg" width="180" alt="Android dark 9" />
  <img src="screenshots/android/imgDark10.jpeg" width="180" alt="Android dark 10" />
  <img src="screenshots/android/imgDark11.jpeg" width="180" alt="Android dark 11" />
  <img src="screenshots/android/imgDark12.jpeg" width="180" alt="Android dark 12" />
</p>
<p align="center">
  <img src="screenshots/android/imgDark13.jpeg" width="180" alt="Android dark 13" />
  <img src="screenshots/android/imgDark14.jpeg" width="180" alt="Android dark 14" />
</p>

## Project Structure

```
Spendly/
├── app/                          # Application screens (Expo Router)
│   ├── (auth)/                   # Authentication flow
│   │   ├── welcome.tsx           # Onboarding screen with slides
│   │   ├── login.tsx             # Login/signup screen
│   │   ├── forgot-password.tsx   # Password recovery
│   │   └── _layout.tsx           # Auth layout wrapper
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx             # Home/Dashboard screen
│   │   ├── analytics.tsx         # Analytics with charts
│   │   ├── profile.tsx           # User profile & settings
│   │   └── _layout.tsx           # Tab layout configuration
│   ├── add-transaction.tsx       # Add new transaction modal
│   ├── categories.tsx            # Category selection/management
│   ├── edit-profile.tsx          # Edit user profile
│   ├── appearance.tsx            # Theme settings
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point
├── components/                   # Reusable UI components
│   ├── auth/
│   │   └── auth-toggle.tsx       # Login/signup toggle
│   ├── layout/
│   │   └── AppHeader.tsx         # Common header component
│   └── ui/                       # UI primitives
│       ├── button.tsx            # Custom button component
│       ├── input.tsx             # Custom input component
│       ├── icons.tsx             # Icon components
│       ├── empty-state.tsx       # Empty state component
│       ├── segmented-control.tsx # Segmented control switcher
│       └── swipeable-transaction.tsx # Swipeable transaction card
├── store/                        # State management (Zustand)
│   ├── auth-store.ts             # Authentication state
│   ├── transactions-store.ts    # Transactions data & logic
│   ├── category-store.ts         # Category management
│   ├── theme-store.ts            # Theme preferences
│   └── accounts-store.ts         # Account data
├── hooks/                        # Custom React hooks
│   └── useThemeColor.ts          # Dynamic theme colors hook
├── constants/                    # App constants
│   └── colors.ts                 # Color definitions
├── assets/                       # Static assets
│   ├── images/                   # App icons & images
│   └── DarkByte.ttf              # Custom font
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app (for physical device testing)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Spendly
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npx expo start
```

4. Run the app:

**On iOS Simulator** (Mac only):
```bash
npm run ios
```

**On Android Emulator**:
```bash
npm run android
```

**On Physical Device**:
- Install the Expo Go app from App Store or Play Store
- Scan the QR code from the terminal with your device camera

### Platform-Specific Setup

**iOS Development**:
- Requires macOS with Xcode installed
- Run `xcode-select --install` if you haven't already
- Open iOS Simulator before running `npm run ios`

**Android Development**:
- Install Android Studio and set up an Android Virtual Device (AVD)
- Ensure `ANDROID_HOME` environment variable is set correctly
- Accept Android SDK licenses: `yes | sdkmanager --licenses`

### Environment

This project uses:
- Expo SDK ~54.0
- React 19.1.0
- React Native 0.81.5
- TypeScript for type safety
- Zustand for state management
- AsyncStorage for local data persistence
