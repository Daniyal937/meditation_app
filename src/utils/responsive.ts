import { Dimensions, PixelRatio, Platform } from 'react-native';
import { ScreenDimensions } from '../types';

const baseWidth = 375;
const baseHeight = 812;

const getScreenDimensions = (): ScreenDimensions => {
    try {
        const { width, height } = Dimensions.get('window');
        return {
            width: width && width > 0 ? width : baseWidth,
            height: height && height > 0 ? height : baseHeight,
        };
    } catch (error) {
        console.warn('Error getting screen dimensions:', error);
        return { width: baseWidth, height: baseHeight };
    }
};

export const wp = (size: number): number => {
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

export const hp = (size: number): number => {
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

export const fs = (size: number): number => {
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

export const ms = (size: number, factor: number = 0.5): number => {
    try {
        return size + (wp(size) - size) * factor;
    } catch (error) {
        console.warn('Error in ms:', error);
        return size;
    }
};

export const spacing = (size: number): number => {
    try {
        return wp(size);
    } catch (error) {
        console.warn('Error in spacing:', error);
        return size;
    }
};

export const isSmallDevice = (): boolean => {
    try {
        const { width } = getScreenDimensions();
        return width < 375;
    } catch (error) {
        console.warn('Error in isSmallDevice:', error);
        return false;
    }
};

export const isLargeDevice = (): boolean => {
    try {
        const { width } = getScreenDimensions();
        return width >= 414;
    } catch (error) {
        console.warn('Error in isLargeDevice:', error);
        return false;
    }
};

export const isTablet = (): boolean => {
    try {
        const { width } = getScreenDimensions();
        return width >= 768;
    } catch (error) {
        console.warn('Error in isTablet:', error);
        return false;
    }
};

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
