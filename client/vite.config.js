import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA(
            {
                registerType: 'autoUpdate',
                injectRegister: 'auto',
                devOptions: {
                    enabled: true
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg}']
                },
                manifest: {
                    name: 'Codex-Chat',
                    short_name: 'CodexAI',
                    description: 'An instant chat about programming with the AI called Codex.',
                    theme_color: '#5436DA',
                    background_color: "#343541",
                    orientation: "portrait",
                    icons: [
                        {
                            src: "./assets/icons/favicon128x128.png",
                            sizes: "128x128",
                            type: "image/png"
                        },
                        {
                            src: "./assets/icons/favicon180x180.png",
                            sizes: "180x180",
                            type: "image/png"
                        },
                        {
                            src: "./assets/icons/favicon192x192.png",
                            sizes: "192x192",
                            type: "image/png"
                        },
                        {
                            src: "./assets/icons/favicon256x256.png",
                            sizes: "256x256",
                            type: "image/png"
                        },
                        {
                            src: "./assets/icons/favicon512x512.png",
                            sizes: "512x512",
                            type: "image/png"
                        },
                        {
                            src: "./assets/icons/favicon640x640.png",
                            sizes: "640x640",
                            type: "image/png",
                            purpose: "any maskable"
                        }
                    ],
                },
            })
    ]
})