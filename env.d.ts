// <reference types="vite/client" />
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

interface ImportMetaEnv {
    readonly VITE_IMAGE_PATH: string;
    readonly VITE_BASE_URL: string; // Déclare VITE_BASE_URL comme une variable d'environnement de type string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
