import { Dimensions, PixelRatio, Platform } from 'react-native';

// Base dimensions (iPhone 11 Pro / X)
const baseWidth = 375;
const baseHeight = 812;

/**
 * Get current screen dimensions safely
 * @returns {object} - { width, height }
 */
const getScreenDimensions = () => {
    try {
        const { width, height } = Dimensions.get('window');
        // Fallback to base dimensions if invalid
        return {
            width: width && width > 0 ? width : baseWidth,
            height: height && height > 0 ? height : baseHeight,
        };
    } catch (error) {
        console.warn('Error getting screen dimensions:', error);
        return { width: baseWidth, height: baseHeight };
    }
};

/**
 * Scales a value based on screen width
 * @param {number} size - The size to scale
 * @returns {number} - Scaled size
 */
export const wp = size => {
    try {
        const { width } = getScreenDimensions();
        const percentage = (size / baseWidth) * 100;
        const elemWidth = (percentage * width) / 100;
        return Math.round(elemWidth);
    } catch (error) {
        console.warn('Error in wp:', error);
        return size;
    }
};

/**
 * Scales a value based on screen height
 * @param {number} size - The size to scale
 * @returns {number} - Scaled size
 */
export const hp = size => {
    try {
        const { height } = getScreenDimensions();
        const percentage = (size / baseHeight) * 100;
        const elemHeight = (percentage * height) / 100;
        return Math.round(elemHeight);
    } catch (error) {
        console.warn('Error in hp:', error);
        return size;
    }
};

/**
 * Scales font size based on screen width and pixel ratio
 * @param {number} size - The font size to scale
 * @returns {number} - Scaled font size
 */
export const fs = size => {
    try {
        const { width } = getScreenDimensions();
        const scale = width / baseWidth;
        const newSize = size * scale;
        if (Platform.OS === 'ios') {
            return Math.round(PixelRatio.roundToNearestPixel(newSize));
        } else {
            return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
        }
    } catch (error) {
        console.warn('Error in fs:', error);
        return size;
    }
};

/**
 * Moderately scales a value (less aggressive than wp/hp)
 * @param {number} size - The size to scale
 * @param {number} factor - Scaling factor (default: 0.5)
 * @returns {number} - Scaled size
 */
export const ms = (size, factor = 0.5) => {
    try {
        return size + (wp(size) - size) * factor;
    } catch (error) {
        console.warn('Error in ms:', error);
        return size;
    }
};

/**
 * Get responsive padding/margin
 * @param {number} size - The size to scale
 * @returns {number} - Scaled size
 */
export const spacing = size => {
    try {
        return wp(size);
    } catch (error) {
        console.warn('Error in spacing:', error);
        return size;
    }
};

/**
 * Check if device is small (width < 375)
 * @returns {boolean}
 */
export const isSmallDevice = () => {
    try {
        const { width } = getScreenDimensions();
        return width < 375;
    } catch (error) {
        console.warn('Error in isSmallDevice:', error);
        return false;
    }
};

/**
 * Check if device is large (width >= 414)
 * @returns {boolean}
 */
export const isLargeDevice = () => {
    try {
        const { width } = getScreenDimensions();
        return width >= 414;
    } catch (error) {
        console.warn('Error in isLargeDevice:', error);
        return false;
    }
};

/**
 * Check if device is tablet
 * @returns {boolean}
 */
export const isTablet = () => {
    try {
        const { width } = getScreenDimensions();
        return width >= 768;
    } catch (error) {
        console.warn('Error in isTablet:', error);
        return false;
    }
};

/**
 * Get screen dimensions
 * @returns {object} - { width, height }
 */
export { getScreenDimensions };

export default {
    wp,
    hp,
    fs,
    ms,
    spacing,
    isSmallDevice,
    isLargeDevice,
    isTablet,
    getScreenDimensions,
};
