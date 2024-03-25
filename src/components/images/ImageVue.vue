<script setup>
const props = defineProps({
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    src: {
        type: String,
        required: true
    },
    darkSrc: {
        type: String,
        required: false
    }
});

const base_path = __dirname + '/images/';

const THEME_SUPPORT = {
    Auto: !eagle.app.isDarkColors(),
    LIGHT: true,
    LIGHTGRAY: true,
    GRAY: false,
    DARK: false,
    BLUE: false,
    PURPLE: false
};

const uri = ref('');

watchEffect(() => {
    uri.value = THEME_SUPPORT[eagle.app.theme] ? props.src : props.darkSrc ?? props.src;
});

eagle.onThemeChanged((theme) => {
    uri.value = THEME_SUPPORT[theme] ? props.src : props.darkSrc ?? props.src;
});
</script>

<template>
    <div class="image-vue">
        <img
            :style="{
                width: props.width + 'px',
                height: props.height + 'px'
            }"
            :src="base_path + uri"
            :alt="uri"
            loading="lazy"
        />
        <slot></slot>
    </div>
</template>

<style lang="scss">
@use '@styles/modules/mixins' as mixins;
.image-vue {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    object-fit: cover;
    margin: auto;
}
</style>
