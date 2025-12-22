# Silent Moon - Component Documentation

## Screen Components

### SignUpScreen

**Location**: `src/screens/SignUpScreen.js`

**Purpose**: Welcome/landing screen for new users with app branding and sign-up call-to-action.

**Features**:
- Silent Moon logo with gradient moon icon
- Calming illustration
- "We are what we do" tagline
- Sign up button with gradient
- Login link for existing users

**Props**:
- `navigation` (object): React Navigation prop for screen navigation

**Navigation**:
- Navigates to `SignUpForm` on sign up button press
- Navigates to `Login` on login link press

**Styling**:
- Background: Light gray (#F5F5F5)
- Primary gradient: Purple to light purple (#8E97FD to #A5AFFF)
- Typography: Clean, modern with proper hierarchy

---

### SignUpFormScreen

**Location**: `src/screens/SignUpFormScreen.js`

**Purpose**: User registration form with validation and Firebase-ready authentication.

**Features**:
- Full name input field
- Email input field
- Password input field with visibility toggle
- Form validation
- Terms of service acknowledgment
- Loading state during signup
- Error handling with alerts

**Props**:
- `navigation` (object): React Navigation prop

**State**:
- `name` (string): User's full name
- `email` (string): User's email address
- `password` (string): User's password
- `showPassword` (boolean): Password visibility toggle
- `isLoading` (boolean): Loading state during signup

**Validation**:
- Name: Required, non-empty
- Email: Required, non-empty
- Password: Required, minimum 6 characters

**Navigation**:
- Back to previous screen on back button
- Navigate to `Onboarding` on successful signup
- Navigate to `Login` on login link

---

## Redux Slices

### authSlice

**Location**: `src/redux/slices/authSlice.js`

**Purpose**: Manage authentication state across the app.

**State**:
```javascript
{
  user: null,              // User object from Firebase
  isAuthenticated: false,  // Authentication status
  isLoading: false,        // Loading state
  error: null              // Error message
}
```

**Actions**:
- `loginStart()`: Set loading state for login
- `loginSuccess(user)`: Set user and authenticated state
- `loginFailure(error)`: Set error message
- `signupStart()`: Set loading state for signup
- `signupSuccess(user)`: Set user and authenticated state
- `signupFailure(error)`: Set error message
- `logout()`: Clear user and authentication state
- `clearError()`: Clear error message

**Usage**:
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../redux/slices/authSlice';

// In component
const dispatch = useDispatch();
const { user, isAuthenticated } = useSelector(state => state.auth);

// Login
dispatch(loginSuccess(userData));

// Logout
dispatch(logout());
```

---

### userSlice

**Location**: `src/redux/slices/userSlice.js`

**Purpose**: Manage user profile, preferences, statistics, and content.

**State**:
```javascript
{
  profile: null,           // User profile data
  preferences: {
    theme: 'light',
    language: 'en',
    reminderTime: null,
    notificationsEnabled: true
  },
  stats: {
    totalMinutes: 0,
    dailyStreak: 0,
    coursesCompleted: 0
  },
  favorites: [],           // Array of favorite session IDs
  downloads: []            // Array of downloaded sessions
}
```

**Actions**:
- `setUserProfile(profile)`: Set user profile data
- `updatePreferences(preferences)`: Update user preferences
- `updateStats(stats)`: Update user statistics
- `addFavorite(sessionId)`: Add session to favorites
- `removeFavorite(sessionId)`: Remove session from favorites
- `addDownload(session)`: Add downloaded session
- `removeDownload(sessionId)`: Remove downloaded session
- `clearUserData()`: Reset to initial state

**Usage**:
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { updatePreferences, addFavorite } from '../redux/slices/userSlice';

// In component
const dispatch = useDispatch();
const { preferences, stats } = useSelector(state => state.user);

// Update theme
dispatch(updatePreferences({ theme: 'dark' }));

// Add favorite
dispatch(addFavorite('session-123'));
```

---

## Styling Guidelines

### Color Palette

**Primary Colors**:
- Purple Gradient Start: `#8E97FD`
- Purple Gradient End: `#A5AFFF`

**Neutral Colors**:
- Background: `#F5F5F5`
- White: `#FFFFFF`
- Text Primary: `#3F414E`
- Text Secondary: `#A1A4B2`
- Border: `#E8E8E8`

**Semantic Colors**:
- Success: `#4CAF50`
- Error: `#F44336`
- Warning: `#FF9800`

### Typography

**Font Sizes**:
- Heading Large: 28px (weight: 700)
- Heading Medium: 18px (weight: 600)
- Body: 15px (weight: 400)
- Small: 13-14px (weight: 400)
- Caption: 12px (weight: 300)

**Letter Spacing**:
- Buttons: 1.2px
- Logo: 0.5px
- Body: Normal

### Spacing

**Padding/Margin Scale**:
- XS: 4px
- S: 8px
- M: 12px
- L: 16px
- XL: 20px
- XXL: 24px
- XXXL: 30px

### Border Radius

- Small: 8px
- Medium: 15px
- Large: 38px (buttons)
- Circle: 50%

### Shadows

**Button Shadow**:
```javascript
{
  elevation: 4,
  shadowColor: '#8E97FD',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
}
```

---

## Best Practices

### Component Structure

1. **Imports**: Group by category (React, React Native, third-party, local)
2. **Component Definition**: Use functional components with hooks
3. **State Management**: Use Redux for global state, local state for UI
4. **Styles**: Define StyleSheet at bottom of file
5. **Export**: Default export at the end

### Naming Conventions

- **Components**: PascalCase (e.g., `SignUpScreen`)
- **Functions**: camelCase (e.g., `handleSignUp`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)
- **Files**: Match component name (e.g., `SignUpScreen.js`)

### Code Quality

- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use meaningful variable and function names
- Add comments for complex logic
- Handle errors gracefully
- Validate user input
- Provide loading states
- Use TypeScript or PropTypes for type safety (optional)

### Performance

- Use `React.memo()` for expensive components
- Avoid inline functions in render
- Optimize images and assets
- Use FlatList for long lists
- Implement pagination for large datasets
- Cache API responses when appropriate

---

## Testing Checklist

### SignUpScreen
- [ ] Logo displays correctly
- [ ] Illustration loads properly
- [ ] Sign up button navigates to form
- [ ] Login link navigates to login
- [ ] Responsive on different screen sizes
- [ ] Gradient renders correctly

### SignUpFormScreen
- [ ] All input fields accept text
- [ ] Validation works for empty fields
- [ ] Password minimum length enforced
- [ ] Password visibility toggle works
- [ ] Back button navigates correctly
- [ ] Form submission shows loading state
- [ ] Error alerts display properly
- [ ] Success navigation works

### Redux State
- [ ] Auth actions update state correctly
- [ ] User actions update state correctly
- [ ] State persists across navigation
- [ ] Logout clears state properly

---

## Future Components

### Planned Components
- `LoginScreen`: User login interface
- `OnboardingScreen`: Welcome flow for new users
- `HomeScreen`: Main dashboard
- `MeditationPlayer`: Audio playback interface
- `CourseList`: Browse meditation courses
- `ProfileScreen`: User profile and stats
- `SettingsScreen`: App preferences
- `SleepScreen`: Sleep stories and sounds

### Reusable Components
- `Button`: Custom button component
- `Input`: Custom text input
- `Card`: Content card component
- `AudioPlayer`: Audio playback controls
- `ProgressBar`: Progress indicator
- `StatCard`: Statistics display
- `CategoryCard`: Course category card

---

**Last Updated**: December 2025
**Version**: 1.0.0
