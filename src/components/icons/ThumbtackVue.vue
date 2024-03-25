<script setup>
import { t, keyboard } from '@/composables';
const mousetrap = inject('mousetrap');

const isAlwaysOnTop = ref(false);

const toggleAlwaysOnTop = async () => {
    isAlwaysOnTop.value = !isAlwaysOnTop.value;
    await eagle.window.setAlwaysOnTop(isAlwaysOnTop.value);
};

onMounted(() => {
    mousetrap.bind(['shift+t'], toggleAlwaysOnTop);
});
</script>

<template>
    <tippy allowHTML placement="left" duration="[200,0]">
        <template #default>
            <ImageVue
                class="icon"
                :class="{
                    'icon-active': isAlwaysOnTop
                }"
                width="24"
                height="24"
                :src="
                    isAlwaysOnTop
                        ? 'light/base/ic-thumbtack-pinned.svg'
                        : 'light/base/ic-thumbtack.svg'
                "
                :darkSrc="
                    isAlwaysOnTop
                        ? 'dark/base/ic-thumbtack-pinned.svg'
                        : 'dark/base/ic-thumbtack.svg'
                "
                @click="toggleAlwaysOnTop"
            ></ImageVue>
        </template>

        <template #content>
            <span style="margin-right: 2px">
                {{
                    isAlwaysOnTop
                        ? t('header.thumbtack.isNotAlwaysOnTop')
                        : t('header.thumbtack.isAlwaysOnTop')
                }}
            </span>
            <key>{{ keyboard('Shift') }}</key>
            <key>T</key>
        </template>
    </tippy>
</template>

<style lang="scss"></style>
