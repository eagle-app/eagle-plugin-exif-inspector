import { createApp } from 'vue';
import App from './views/App.vue';

import VueTippy from 'vue-tippy';
import VueMousetrapPlugin from 'vue-mousetrap';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import '@styles/main.scss';

const app = createApp(App);

const utils = require(`${__dirname}/modules/utils`);

app.use(VueTippy);
app.use(VueMousetrapPlugin).provide('mousetrap', app.config.globalProperties.$mousetrap);

eagle.onPluginCreate(async () => {
    app.mount('#app');

    toggleTheme();
});

eagle.onThemeChanged(() => {
    toggleTheme();
});

const THEME_SUPPORT = {
    Auto: eagle.app.isDarkColors() ? 'gray' : 'light',
    LIGHT: 'light',
    LIGHTGRAY: 'lightgray',
    GRAY: 'gray',
    DARK: 'dark',
    BLUE: 'blue',
    PURPLE: 'purple'
};

async function toggleTheme() {
    const theme = eagle.app.theme;
    const themeName = THEME_SUPPORT[theme] ?? 'dark';
    const htmlEl = document.querySelector('html');

    htmlEl.classList.add('no-transition');
    htmlEl.setAttribute('theme', themeName);
    htmlEl.setAttribute('platform', eagle.app.platform);
    await nextTick();
    htmlEl.classList.remove('no-transition');
}

window.addEventListener('load', async () => {
    await utils.file.deleteFolder(`${__dirname}/temp`);
    await utils.file.createFolder(`${__dirname}/temp`);
});

window.addEventListener('unload', async () => {
    await utils.file.deleteFolder(`${__dirname}/temp`);
});
