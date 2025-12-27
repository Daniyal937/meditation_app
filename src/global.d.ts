declare global {
    const __DEV__: boolean;
}
export interface AudioStatus {
    isLoaded: boolean;
    isPlaying?: boolean;
    positionMillis?: number;
    durationMillis?: number;
    didJustFinish?: boolean;
}
export interface Sound {
    setPositionAsync(positionMillis: number): Promise<void>;
    pauseAsync(): Promise<void>;
    playAsync(): Promise<void>;
    unloadAsync(): Promise<void>;
}
export interface Topic {
    id: number;
    name: string;
    color: string;
    height: number;
    image: any;
    backgroundImage?: any;
}
export interface Session {
    id: number | string;
    name: string;
    duration: string;
    audioUrl?: string;
    category?: string;
    description?: string;
    artist?: string;
    location?: string;
    streams?: string;
}
export { };
